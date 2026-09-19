// Trip-list sync for the Omaha wedding guide.
//
// This endpoint is public and deliberately unauthenticated: the 8-character
// trip code IS the credential. That's an acceptable trade only because the
// stored data is a list of place ids from data.js — no names, no emails, no
// device identifiers — so a guessed code leaks a list of restaurants.
//
// Because there's no auth, the handler is strict about what it will accept:
// exact code format, a bounded number of ids, a bounded id shape, and a capped
// body. That's what stops it being used as free anonymous storage.

import { randomInt } from "node:crypto";
import pg from "pg";
import { attachDatabasePool } from "@neon/functions";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

// No O/0/I/1 — guests read these off one screen and type them into another.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const MAX_PLACES = 100;
const MAX_BODY_BYTES = 8 * 1024;

const ALLOWED_ORIGINS = new Set([
  "https://slickg0ose.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);

const isCode = (v) => typeof v === "string" && /^[A-Z0-9]{8}$/.test(v);

const isPlaceIds = (v) =>
  Array.isArray(v) &&
  v.length <= MAX_PLACES &&
  v.every((id) => typeof id === "string" && id.length <= 64 && /^[a-z0-9-]+$/.test(id));

function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(request) }
  });
}

function newCode() {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

async function readBody(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return { error: "payload too large" };
  try {
    return { value: JSON.parse(raw) };
  } catch {
    return { error: "invalid JSON" };
  }
}

async function getList(request, code) {
  if (!isCode(code)) return json(request, { error: "invalid code" }, 400);

  const { rows } = await pool.query("SELECT place_ids FROM trip_lists WHERE code = $1", [code]);
  if (!rows.length) return json(request, { error: "not found" }, 404);

  return json(request, { code, placeIds: rows[0].place_ids });
}

async function saveList(request) {
  const { value, error } = await readBody(request);
  if (error) return json(request, { error }, 400);

  const placeIds = value?.placeIds;
  if (!isPlaceIds(placeIds)) return json(request, { error: "invalid placeIds" }, 400);

  // An existing code updates in place; anything else mints a new one. A caller
  // can't choose its own code, which keeps codes uniformly random.
  if (value?.code !== undefined) {
    if (!isCode(value.code)) return json(request, { error: "invalid code" }, 400);

    const { rowCount } = await pool.query(
      "UPDATE trip_lists SET place_ids = $2, updated_at = now() WHERE code = $1",
      [value.code, placeIds]
    );
    if (!rowCount) return json(request, { error: "not found" }, 404);
    return json(request, { code: value.code, placeIds });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    const { rowCount } = await pool.query(
      "INSERT INTO trip_lists (code, place_ids) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING",
      [code, placeIds]
    );
    if (rowCount) return json(request, { code, placeIds }, 201);
  }

  return json(request, { error: "could not allocate a code" }, 503);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    try {
      if (url.pathname === "/health") return json(request, { ok: true });

      if (url.pathname === "/list") {
        if (request.method === "GET") return getList(request, url.searchParams.get("code"));
        if (request.method === "POST") return saveList(request);
        return json(request, { error: "method not allowed" }, 405);
      }

      return json(request, { error: "not found" }, 404);
    } catch (err) {
      console.error("[triplist]", err);
      return json(request, { error: "server error" }, 500);
    }
  }
};
