// Edit this file to customize the guide.
//
// The Guide has three sections — Food & Drink, Things to Do, Entertainment —
// and each section is split into groups (Coffee & Breakfast, Dinner, ...).
// CATEGORIES defines both, in the order they appear.
//
// Each place needs: id (unique, lowercase-hyphenated), category + group (must
// match an id in CATEGORIES), name, blurb, and query. Optional:
//   tag   — small pill on the card ("Steak", "Free", "Easy")
//   pick  — true marks it as one of YOUR recommendations: it gets a
//           "Nick's pick" badge and floats to the top of its group
//   tip   — one line in your voice: what to order, when to go, what to skip
//
// Empty groups are hidden from guests, so it's fine to leave a slot unfilled.
// `npm run check:ready` lists which ones are still empty.
//
// query is just what you'd type into a maps search box — a place name, or a
// full street address. The site turns it into an Apple Maps link on iPhone/Mac
// and a Google Maps link everywhere else, so it opens the right app on tap.

const WEDDING = {
  couple: "Anna & Charlie",
  date: "Saturday, October 3, 2026",
  venueName: "Russ & Jean's",
  venueAddress: "2006 Jennings Ave, Council Bluffs, IA 51503",
  venueQuery: "2006 Jennings Ave Council Bluffs IA 51503",
  ceremonyTime: "4:30 PM",
  receptionTime: "Following the ceremony",
  hotelBlock: "TODO: hotel name + booking link/code, or delete this line",
  dressCode: "Semi-formal",
  // Reception playlist — a Spotify / Apple Music / YouTube link. Leave empty
  // and the button doesn't show. Must start with https://.
  playlistUrl: "https://open.spotify.com/playlist/0xhs4DiM4w87j6lkz5v8F5",
  notes: "TODO: any other must-know logistics (parking, shuttle, weather backup, etc.)"
};

// Optional second card on the home screen. Set REHEARSAL to null to remove it
// entirely. Leave `time` empty and the card shows "Time TBD" rather than a
// half-filled field — `npm run check:ready` still reminds you it's unset.
const REHEARSAL = {
  title: "Rehearsal Dinner",
  date: "Friday, October 2, 2026",
  time: "",
  venueName: "Upstream Brewing Company",
  venueArea: "Old Market, downtown Omaha",
  venueQuery: "Upstream Brewing Company Old Market Omaha",
  // Reception playlist — a Spotify / Apple Music / YouTube link. Leave empty
  // and the button doesn't show. Must start with https://.
  playlistUrl: "https://open.spotify.com/playlist/0xhs4DiM4w87j6lkz5v8F5",
  notes: "TODO: who's invited, and anything else people need to know"
};

// This repo is public (GitHub Pages on the free tier requires it), so anything
// here is permanently public and gets scraped. Don't put a personal cell number
// in this file — use a forwarding number you can throw away after the wedding.
const CONTACT = {
  name: "Nick",
  email: "nick.konecny1@gmail.com",
  phone: "",
  blurb: "Questions about the area or the weekend? Reach out."
};

const CATEGORIES = [
  {
    id: "eat",
    label: "Food & Drink",
    heading: "Food & Drink",
    intro: "Where to eat and drink, from first coffee to last call.",
    groups: [
      { id: "breakfast", label: "Coffee & Breakfast" },
      { id: "casual", label: "Lunch & Casual" },
      { id: "dinner", label: "Dinner" },
      { id: "drinks", label: "Bars & Breweries" }
    ]
  },
  {
    id: "do",
    label: "Things to Do",
    heading: "Things to Do",
    intro: "Daytime plans — the classics, a few museums, and fall color outside.",
    groups: [
      { id: "classics", label: "Omaha Classics" },
      { id: "museums", label: "Museums & Rainy-Day" },
      { id: "outdoors", label: "Outdoors & Overlooks" }
    ]
  },
  {
    id: "fun",
    label: "Entertainment",
    heading: "Entertainment",
    intro: "Nights out — live music, shows, and neighborhoods worth wandering.",
    groups: [
      { id: "music", label: "Live Music & Shows" },
      { id: "neighborhoods", label: "Neighborhoods to Wander" }
    ]
  }
];

const PLACES = [
  // =====================================================================
  // FOOD & DRINK
  // STARTER LIST — well-known metro spots, not yet your personal picks. Cut
  // what you wouldn't send people to, mark your favorites with pick: true,
  // and confirm they're still open before the weekend.
  //
  // Copy this block to add one:
  // {
  //   id: "place-name",
  //   category: "eat",
  //   group: "dinner",          // breakfast | casual | dinner | drinks
  //   name: "Place Name",
  //   blurb: "One or two sentences on why it's worth the trip.",
  //   tip: "Get the ___. Go before 6 or expect a wait.",
  //   pick: true,
  //   tag: "Steak",
  //   query: "Place Name Omaha"
  // },
  // =====================================================================

  // ---- Coffee & Breakfast ----
  {
    id: "archetype-coffee",
    category: "eat",
    group: "breakfast",
    name: "Archetype Coffee",
    blurb: "The local coffee benchmark. Blackstone and Little Bohemia are both easy stops.",
    tag: "Coffee",
    query: "Archetype Coffee Omaha"
  },
  {
    id: "early-bird",
    category: "eat",
    group: "breakfast",
    name: "Early Bird Brunch",
    blurb: "Straightforward, well-executed brunch with a few locations around the metro.",
    tag: "Brunch",
    query: "Early Bird Brunch Omaha"
  },

  // ---- Lunch & Casual ----
  {
    id: "block-16",
    category: "eat",
    group: "casual",
    name: "Block 16",
    blurb: "Downtown counter-service sandwiches with a cult following. Expect a line at lunch.",
    tag: "Sandwiches",
    query: "Block 16 Omaha"
  },

  // ---- Dinner ----
  {
    id: "gorats",
    category: "eat",
    group: "dinner",
    name: "Gorat's Steak House",
    blurb: "Old-school Omaha steakhouse that hasn't changed in decades. Call ahead — it fills up.",
    tag: "Steak",
    query: "Gorat's Steak House Omaha"
  },
  {
    id: "the-drover",
    category: "eat",
    group: "dinner",
    name: "The Drover",
    blurb: "Whiskey-marinated steak in a dark, cozy room. The other answer to \"where do I get an Omaha steak?\"",
    tag: "Steak",
    query: "The Drover Omaha"
  },
  {
    id: "le-bouillon",
    category: "eat",
    group: "dinner",
    name: "Le Bouillon",
    blurb: "French bistro tucked into an Old Market basement. Good call for a nicer dinner out.",
    tag: "French",
    query: "Le Bouillon Omaha"
  },

  // ---- Bars & Breweries ----
  // Empty on purpose — add your go-to bars here (group: "drinks").

  // =====================================================================
  // THINGS TO DO
  // =====================================================================

  // ---- Omaha Classics ----
  {
    id: "old-market",
    category: "do",
    group: "classics",
    name: "Old Market",
    blurb: "Cobblestone streets, local shops, restaurants, and bars downtown. The easiest home base for wandering.",
    query: "Old Market Omaha"
  },
  {
    id: "henry-doorly-zoo",
    category: "do",
    group: "classics",
    name: "Henry Doorly Zoo & Aquarium",
    blurb: "Routinely ranked among the best zoos in the country. Budget a half day — it's bigger than people expect.",
    tag: "Half day",
    query: "Henry Doorly Zoo"
  },
  {
    id: "gene-leahy-mall",
    category: "do",
    group: "classics",
    name: "Gene Leahy Mall & The RiverFront",
    blurb: "Rebuilt downtown park chain — lawns, sculpture, a big slide, and a straight shot to the river.",
    tag: "Free",
    query: "Gene Leahy Mall Omaha"
  },
  {
    id: "bob-kerrey-bridge",
    category: "do",
    group: "classics",
    name: "Bob Kerrey Pedestrian Bridge",
    blurb: "Walk across the Missouri River and stand in two states at once. Best light in the evening.",
    tag: "Free",
    query: "Bob Kerrey Pedestrian Bridge Omaha"
  },
  {
    id: "lauritzen-gardens",
    category: "do",
    group: "classics",
    name: "Lauritzen Gardens",
    blurb: "Botanical garden on the bluffs above the river. Calm, pretty, and an easy walk at any pace.",
    query: "Lauritzen Gardens"
  },

  // ---- Museums & Rainy-Day ----
  {
    id: "joslyn-art-museum",
    category: "do",
    group: "museums",
    name: "Joslyn Art Museum",
    blurb: "Free general admission, and the expansion gave it a lot more to see. Good rainy-afternoon option.",
    tag: "Free",
    query: "Joslyn Art Museum Omaha"
  },
  {
    id: "durham-museum",
    category: "do",
    group: "museums",
    name: "The Durham Museum",
    blurb: "Omaha history inside a restored art deco train station. Worth it for the building alone.",
    query: "Durham Museum Omaha"
  },
  {
    id: "kiewit-luminarium",
    category: "do",
    group: "museums",
    name: "Kiewit Luminarium",
    blurb: "Hands-on science center on the riverfront. Genuinely fun for adults, not just kids.",
    query: "Kiewit Luminarium Omaha"
  },

  // ---- Outdoors & Overlooks ----
  {
    id: "lewis-clark-overlook",
    category: "do",
    group: "outdoors",
    name: "Lewis & Clark Monument Overlook",
    blurb: "Bluff-top view over the river valley and the Omaha skyline, minutes from the venue. Drive right up and sit.",
    tag: "Easy",
    query: "Lewis and Clark Monument Council Bluffs"
  },
  {
    id: "fontenelle-forest",
    category: "do",
    group: "outdoors",
    name: "Fontenelle Forest",
    blurb: "Miles of wooded trails in Bellevue, plus a flat boardwalk loop for the easy version. Early October is peak color.",
    tag: "Hike",
    query: "Fontenelle Forest Bellevue NE"
  },
  {
    id: "hitchcock-nature-center",
    category: "do",
    group: "outdoors",
    name: "Hitchcock Nature Center",
    blurb: "Ridgeline hiking in the Loess Hills, close to the venue on the Iowa side. October is hawk migration season.",
    tag: "Hike",
    query: "Hitchcock Nature Center Honey Creek IA"
  },
  {
    id: "hummel-park",
    category: "do",
    group: "outdoors",
    name: "Hummel Park",
    blurb: "Hilly, wooded, and quiet north of town. Steep ravines and the old stone steps — not a flat stroll.",
    tag: "Hike",
    query: "Hummel Park Omaha"
  },
  {
    id: "lake-cunningham",
    category: "do",
    group: "outdoors",
    name: "Lake Cunningham",
    blurb: "Big open water on the north side — paved trails, boat ramps, and room to spread out.",
    tag: "Easy",
    query: "Lake Cunningham Omaha"
  },
  {
    id: "chalco-hills",
    category: "do",
    group: "outdoors",
    name: "Chalco Hills & Wehrspann Lake",
    blurb: "Flat loop around the lake in Papillion. Good for a walk, a run, or doing very little.",
    tag: "Easy",
    query: "Chalco Hills Recreation Area"
  },

  // =====================================================================
  // ENTERTAINMENT
  // =====================================================================

  // ---- Live Music & Shows ----
  {
    id: "slowdown-film-streams",
    category: "fun",
    group: "music",
    name: "Slowdown & Film Streams",
    blurb: "Indie music venue next door to the arthouse cinema, both in North Downtown. Easy night out.",
    query: "Slowdown Omaha"
  },
  {
    id: "orpheum-holland",
    category: "fun",
    group: "music",
    name: "Orpheum Theater & Holland Center",
    blurb: "Touring shows, symphony, and big-room performances downtown. Worth checking the calendar for that weekend.",
    query: "Orpheum Theater Omaha"
  },

  // ---- Neighborhoods to Wander ----
  {
    id: "benson",
    category: "fun",
    group: "neighborhoods",
    name: "Benson",
    blurb: "Dive bars, live music, and good cheap food along Maple.",
    tip: "My favorite stretch in town. Check what's on at The Waiting Room or Reverb.",
    pick: true,
    query: "Benson Omaha NE"
  },
  {
    id: "blackstone-district",
    category: "fun",
    group: "neighborhoods",
    name: "Blackstone District",
    blurb: "Walkable midtown strip of bars and restaurants. Compact enough to park once and wander.",
    query: "Blackstone District Omaha"
  },
  {
    id: "dundee",
    category: "fun",
    group: "neighborhoods",
    name: "Dundee",
    blurb: "Small, walkable neighborhood strip with an old-Omaha feel. Low-key dinner and a drink.",
    query: "Dundee Omaha NE"
  }
];
