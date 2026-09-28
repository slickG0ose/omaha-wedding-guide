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
  dressCode: "Semi-formal",
  // Reception playlist — a Spotify / Apple Music / YouTube link. Leave empty
  // and the button doesn't show. Must start with https://.
  playlistUrl: "https://open.spotify.com/playlist/0xhs4DiM4w87j6lkz5v8F5",
  notes: "TODO: any other must-know logistics (parking, shuttle, weather backup, etc.)"
};

// Optional second card on the home screen. Set REHEARSAL to null to remove it
// entirely. Leave `time` empty and the card shows "Time coming soon" rather than a
// half-filled field — `npm run check:ready` still reminds you it's unset.
const REHEARSAL = {
  title: "Rehearsal Dinner",
  date: "Friday, October 2, 2026",
  venueName: "Upstream Brewing Company",
  venueArea: "Old Market, downtown Omaha",
  venueQuery: "Upstream Brewing Company Old Market Omaha",
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
      { id: "coffee", label: "Coffee" },
      { id: "breakfast", label: "Breakfast & Bakeries" },
      { id: "casual", label: "Lunch & Casual" },
      { id: "sweets", label: "Ice Cream & Treats" },
      { id: "classic-dinner", label: "Omaha Institutions" },
      { id: "dinner-out", label: "Dinner Out" },
      { id: "sushi", label: "Sushi" },
      { id: "global", label: "Around the World" },
      { id: "bars", label: "Bars, Lounges & Beer Gardens" }
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
      { id: "outdoors", label: "Outdoors & Overlooks" },
      { id: "shops", label: "Local Shops" }
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

// AREAS powers the Guide's "By neighborhood" view. Every place needs an
// `area` matching one of these ids. Order here is the order on the page.
const AREAS = [
  { id: "downtown", label: "Downtown & Old Market", intro: "Walkable core by the river — park once and wander." },
  { id: "midtown", label: "Midtown & Blackstone", intro: "Farnam and Leavenworth corridor, a short hop west of downtown." },
  { id: "dundee", label: "Dundee", intro: "Small, leafy neighborhood strip around 50th & Underwood." },
  { id: "benson", label: "Benson", intro: "Maple Street bars, music, and food — Omaha's night-out strip." },
  { id: "south", label: "South Omaha & the Zoo", intro: "The zoo, the gardens, and old-school South O." },
  { id: "west", label: "West Omaha", intro: "Spread out and suburban — you'll want a car." },
  { id: "iowa", label: "Council Bluffs", intro: "The Iowa side, closest to the wedding venue." },
  { id: "farther", label: "Farther Afield", intro: "Worth a 20–30 minute drive." }
];

const PLACES = [
  // =====================================================================
  // FOOD & DRINK
  // Confirm hours before the weekend — several of these close early or
  // skip days. Mark your favorites with pick: true and add a `tip` in your
  // own words.
  //
  // Copy this block to add one:
  // {
  //   id: "place-name",           // lowercase-hyphenated, no apostrophes
  //   category: "eat",
  //   group: "sushi",             // coffee | breakfast | casual | sweets |
  //                               // classic-dinner | dinner-out | sushi |
  //                               // global (Around the World) | bars
  //   area: "downtown",           // see AREAS above
  //   name: "Place Name",
  //   blurb: "One or two sentences on why it's worth the trip.",
  //   tip: "Get the ___. Go before 6 or expect a wait.",
  //   pick: true,
  //   tag: "Steak",
  //   query: "Place Name Omaha"
  // },
  // =====================================================================

  // ---- Coffee ----
  {
    id: "archetype-coffee",
    category: "eat",
    group: "coffee",
    area: "midtown",
    name: "Archetype Coffee",
    blurb: "The local coffee benchmark. Blackstone and Little Bohemia are both easy stops.",
    query: "Archetype Coffee Omaha"
  },
  {
    id: "blue-line-coffee",
    category: "eat",
    group: "coffee",
    area: "dundee",
    name: "Blue Line Coffee",
    blurb: "Cozy, mismatched-chairs neighborhood shop in Dundee. Strong cappuccinos, and the blueberry scones are the move.",
    pick: false,
    query: "Blue Line Coffee 4924 Underwood Ave Omaha"
  },
  {
    id: "zen-coffee",
    category: "eat",
    group: "coffee",
    area: "midtown",
    name: "Zen Coffee Company",
    blurb: "Bright, woman-owned shop on Farnam just west of downtown, with pastries baked in-house. Order the tasting flight to try four drinks at once.",
    pick: false,
    query: "Zen Coffee Company 2504 Farnam St Omaha"
  },

  // ---- Breakfast & Bakeries ----
  {
    id: "baileys",
    category: "eat",
    group: "breakfast",
    area: "west",
    name: "Bailey's Breakfast & Lunch",
    blurb: "Locals' all-day breakfast spot in west Omaha with meats smoked in-house. First come, first served, and closes at 2 PM.",
    tag: "Breakfast",
    pick: true,
    query: "Bailey's Breakfast & Lunch 1259 S 120th St Omaha"
  },
  {
    id: "olsen-bake-shop",
    category: "eat",
    group: "breakfast",
    area: "south",
    name: "Olsen Bake Shop",
    blurb: "Family-run South Omaha bakery going since 1942 — kolaches, donuts, and strudel from the case. Grab a box on your way somewhere.",
    tag: "Bakery",
    pick: true,
    query: "Olsen Bake Shop 1708 S 10th St Omaha"
  },

  // ---- Lunch & Casual ----
  {
    id: "block-16",
    category: "eat",
    group: "casual",
    area: "downtown",
    name: "Block 16",
    blurb: "Downtown counter-service sandwiches with a cult following. Expect a line at lunch.",
    tag: "Sandwiches",
    query: "Block 16 Omaha"
  },

  // ---- Ice Cream & Treats ----
  {
    id: "coneflower-creamery",
    category: "eat",
    group: "sweets",
    area: "midtown",
    name: "Coneflower Creamery",
    blurb: "Small-batch ice cream in Blackstone made with Nebraska dairy. Get the Blackstone Butter Brickle — a nod to the butter brickle invented at the old Blackstone Hotel.",
    tag: "Ice cream",
    pick: true,
    query: "Coneflower Creamery Omaha"
  },

  // ---- Omaha Institutions ----
  {
    id: "the-drover",
    category: "eat",
    group: "classic-dinner",
    area: "west",
    name: "The Drover",
    blurb: "Whiskey-marinated steak in a dark, cozy room. The answer to \"where do I get an Omaha steak?\"",
    tag: "Steak",
    pick: false,
    query: "The Drover Omaha"
  },
  {
    id: "ms-pub",
    category: "eat",
    group: "classic-dinner",
    area: "downtown",
    name: "M's Pub",
    blurb: "Old Market fixture since 1972. Order the lahvosh (Armenian cracker bread piled with toppings) to share. Reservations recommended.",
    pick: false,
    query: "M's Pub 422 S 11th St Omaha"
  },

  // ---- Dinner Out ----
  {
    id: "clio",
    category: "eat",
    group: "dinner-out",
    area: "downtown",
    name: "Clio",
    blurb: "Flagship's Mediterranean spot at 12th & Howard — mezze, spreads, and big shareable plates, with a serious European wine list. Plenty for vegetarians. Book ahead.",
    tag: "Mediterranean",
    pick: true,
    query: "Clio 1202 Howard St Omaha"
  },
  {
    id: "anthem",
    category: "eat",
    group: "dinner-out",
    area: "downtown",
    name: "Anthem",
    blurb: "Across the street from Clio in the Old Market. Fun, high-energy room doing Tex-Asian comfort food — smash burgers, wonton tuna tacos, noodles — plus weekend brunch and a patio.",
    tag: "Tex-Asian",
    pick: true,
    query: "Anthem 1205 Howard St Omaha"
  },

  // ---- Sushi ----
  {
    id: "yoshitomo",
    category: "eat",
    group: "sushi",
    area: "benson",
    name: "Yoshitomo",
    blurb: "Intimate Benson sushi bar with inventive, playful nigiri and small plates. A James Beard semifinalist — book ahead.",
    pick: true,
    query: "Yoshitomo 6011 Maple St Omaha"
  },
  {
    id: "blue-sushi",
    category: "eat",
    group: "sushi",
    area: "downtown",
    name: "Blue Sushi Sake Grill",
    blurb: "Lively, multi-level Old Market spot with a long roll list, good vegan options, and a big sake menu. Easy for a group.",
    pick: false,
    query: "Blue Sushi Sake Grill 416 S 12th St Omaha"
  },
  {
    id: "hiro-88",
    category: "eat",
    group: "sushi",
    area: "downtown",
    name: "Hiro 88",
    blurb: "Local sushi and pan-Asian mini-chain. The Old Market location on Jackson St is the one to hit if you're downtown.",
    pick: true,
    query: "Hiro 88 1308 Jackson St Omaha"
  },

  // ---- Around the World ----
  {
    id: "kinaara",
    category: "eat",
    group: "global",
    area: "west",
    name: "Kinaara",
    blurb: "Chef-owned Indian at Regency, rooted in Kerala. South Indian specialties and biryani, with plenty of vegan and gluten-free options.",
    tag: "Indian",
    pick: true,
    query: "Kinaara 120 Regency Pkwy Omaha"
  },
  {
    id: "star-indian-cuisine",
    category: "eat",
    group: "global",
    area: "west",
    name: "Star Indian Cuisine",
    blurb: "Small, family-run west Omaha spot with a big following and warm owners. Dinner-focused — check hours before you go.",
    tag: "Indian",
    pick: true,
    query: "Star Indian Cuisine 2429 S 132nd St Omaha"
  },
  {
    id: "santoro",
    category: "eat",
    group: "global",
    area: "west",
    name: "Santoro",
    blurb: "Puebla-inspired Mexican from chef Jesús Rivera — mole enchiladas and cochinita pibil. Dinner only, Tuesday–Saturday, no reservations.",
    tag: "Mexican",
    pick: true,
    query: "Santoro 8601 W Dodge Rd Omaha"
  },
  {
    id: "lalibela",
    category: "eat",
    group: "global",
    area: "midtown",
    name: "Lalibela Ethiopian Restaurant",
    blurb: "Midtown Ethiopian since 2010. Stews, meats, and vegetables served on injera you tear and scoop with — platters feed a crowd, so come hungry or bring friends. Closed Mondays.",
    tag: "Ethiopian",
    pick: true,
    query: "Lalibela Ethiopian Restaurant 4422 Cass St Omaha"
  },
  {
    id: "salween-thai",
    category: "eat",
    group: "global",
    area: "midtown",
    name: "Salween Thai",
    blurb: "Longtime Saddle Creek Thai spot. Spice runs on a 1–10 scale, not 1–5 — order accordingly. Pad see ew and cashew chicken are the regulars' picks.",
    tag: "Thai",
    pick: false,
    query: "Salween Thai 1102 NW Radial Hwy Omaha"
  },
  {
    id: "el-basha",
    category: "eat",
    group: "global",
    area: "west",
    name: "El Basha",
    blurb: "Family-run Lebanese grill on Pacific St — hummus, falafel, shawarma, and some of the best gyros in town. Hungry? Get the mixed grill. Closed Sundays.",
    tag: "Lebanese",
    pick: true,
    query: "El Basha 7503 Pacific St Omaha"
  },

  // ---- Bars, Lounges & Beer Gardens ----
  {
    id: "red-lion-lounge",
    category: "eat",
    group: "bars",
    area: "midtown",
    name: "Red Lion Lounge",
    blurb: "Revived 1950s jazz lounge in Blackstone — red velvet booths, classic cocktails, live jazz most nights, and a gold 1965 phone booth for photos.",
    tag: "Cocktails",
    pick: true,
    query: "Red Lion Lounge 3802 Farnam St Omaha"
  },
  {
    id: "barchen",
    category: "eat",
    group: "bars",
    area: "benson",
    name: "Bärchen Beer Garden",
    blurb: "German-style beer hall and big outdoor garden in Benson. 30 European drafts (order a boot), house-made sausages, schnitzel, and giant Bavarian pretzels.",
    tag: "Beer garden",
    pick: true,
    query: "Barchen Beer Garden 6209 Maple St Omaha"
  },
  {
    id: "set-the-bar",
    category: "eat",
    group: "bars",
    area: "benson",
    name: "SET the Bar",
    blurb: "Nebraska's first women's sports bar, at 62nd & Maple — a wall of screens with the games on audio. Everyone's welcome; the women's games just get the big screen.",
    tag: "Sports bar",
    pick: true,
    query: "SET the Bar Benson Omaha"
  },
  {
    id: "shakedown-street-tavern",
    category: "eat",
    group: "bars",
    area: "benson",
    name: "Shakedown Street Tavern",
    blurb: "Grateful Dead–themed bar in the middle of the Benson strip, with local live music. Monday is Omaha's longest-running open mic.",
    tag: "Live music",
    pick: true,
    query: "Shakedown Street Tavern 2735 N 62nd St Omaha"
  },
  {
    id: "brokedown-palace",
    category: "eat",
    group: "bars",
    area: "west",
    name: "Brokedown Palace",
    blurb: "Shakedown's sister bar out west at 88th & Maple — Deadheads, Husker games, live bands on the patio, and a dog-friendly crowd.",
    tag: "Live music",
    pick: true,
    query: "Brokedown Palace 8805 Maple St Omaha"
  },

  // =====================================================================
  // THINGS TO DO
  // =====================================================================

  // ---- Omaha Classics ----
  {
    id: "old-market",
    category: "do",
    group: "classics",
    area: "downtown",
    name: "Old Market",
    blurb: "Cobblestone streets, local shops, restaurants, and bars downtown. The easiest home base for wandering.",
    query: "Old Market Omaha"
  },
  {
    id: "henry-doorly-zoo",
    category: "do",
    group: "classics",
    area: "south",
    name: "Henry Doorly Zoo & Aquarium",
    blurb: "Routinely ranked among the best zoos in the country. Budget a half day — it's bigger than people expect.",
    tag: "Half day",
    query: "Henry Doorly Zoo"
  },
  {
    id: "gene-leahy-mall",
    category: "do",
    group: "classics",
    area: "downtown",
    name: "Gene Leahy Mall & The RiverFront",
    blurb: "Rebuilt downtown park chain — lawns, sculpture, a big slide, and a straight shot to the river.",
    tag: "Free",
    query: "Gene Leahy Mall Omaha"
  },
  {
    id: "bob-kerrey-bridge",
    category: "do",
    group: "classics",
    area: "downtown",
    name: "Bob Kerrey Pedestrian Bridge",
    blurb: "Walk across the Missouri River and stand in two states at once. Best light in the evening.",
    tag: "Free",
    query: "Bob Kerrey Pedestrian Bridge Omaha"
  },
  {
    id: "lauritzen-gardens",
    category: "do",
    group: "classics",
    area: "south",
    name: "Lauritzen Gardens",
    blurb: "Botanical garden on the bluffs above the river. Calm, pretty, and an easy walk at any pace.",
    query: "Lauritzen Gardens"
  },

  // ---- Museums & Rainy-Day ----
  {
    id: "joslyn-art-museum",
    category: "do",
    group: "museums",
    area: "midtown",
    name: "Joslyn Art Museum",
    blurb: "Free general admission, and the expansion gave it a lot more to see. Good rainy-afternoon option.",
    tag: "Free",
    query: "Joslyn Art Museum Omaha"
  },
  {
    id: "durham-museum",
    category: "do",
    group: "museums",
    area: "downtown",
    name: "The Durham Museum",
    blurb: "Omaha history inside a restored art deco train station. Worth it for the building alone.",
    query: "Durham Museum Omaha"
  },
  {
    id: "kiewit-luminarium",
    category: "do",
    group: "museums",
    area: "downtown",
    name: "Kiewit Luminarium",
    blurb: "Hands-on science center on the riverfront. Genuinely fun for adults, not just kids.",
    query: "Kiewit Luminarium Omaha"
  },

  // ---- Outdoors & Overlooks ----
  {
    id: "lewis-clark-overlook",
    category: "do",
    group: "outdoors",
    area: "iowa",
    name: "Lewis & Clark Monument Overlook",
    blurb: "Bluff-top view over the river valley and the Omaha skyline, minutes from the venue. Drive right up and sit.",
    tag: "Easy",
    query: "Lewis and Clark Monument Council Bluffs"
  },
  {
    id: "fontenelle-forest",
    category: "do",
    group: "outdoors",
    area: "farther",
    name: "Fontenelle Forest",
    blurb: "Miles of wooded trails in Bellevue, plus a flat boardwalk loop for the easy version. Early October is peak color.",
    tag: "Hike",
    query: "Fontenelle Forest Bellevue NE"
  },
  {
    id: "hitchcock-nature-center",
    category: "do",
    group: "outdoors",
    area: "iowa",
    name: "Hitchcock Nature Center",
    blurb: "Ridgeline hiking in the Loess Hills, close to the venue on the Iowa side. October is hawk migration season.",
    tag: "Hike",
    query: "Hitchcock Nature Center Honey Creek IA"
  },
  {
    id: "hummel-park",
    category: "do",
    group: "outdoors",
    area: "farther",
    name: "Hummel Park",
    blurb: "Hilly, wooded, and quiet north of town. Steep ravines and the old stone steps — not a flat stroll.",
    tag: "Hike",
    query: "Hummel Park Omaha"
  },
  {
    id: "lake-cunningham",
    category: "do",
    group: "outdoors",
    area: "farther",
    name: "Lake Cunningham",
    blurb: "Big open water on the north side — paved trails, boat ramps, and room to spread out.",
    tag: "Easy",
    query: "Lake Cunningham Omaha"
  },

  // ---- Local Shops ----
  {
    id: "lidgett-music",
    category: "do",
    group: "shops",
    area: "iowa",
    name: "Lidgett Music",
    blurb: "One of the best high-end guitar shops in the Midwest — Gibson, PRS, Martin, Collings — on Council Bluffs' historic 100 block, close to the venue. Odd hours and closed Tuesdays, so check before you go.",
    tag: "Guitars",
    pick: true,
    query: "Lidgett Music Council Bluffs IA"
  },

  // =====================================================================
  // ENTERTAINMENT
  // =====================================================================

  // ---- Live Music & Shows ----
  {
    id: "slowdown-film-streams",
    category: "fun",
    group: "music",
    area: "downtown",
    name: "Slowdown & Film Streams",
    blurb: "Indie music venue next door to the arthouse cinema, both in North Downtown. Easy night out.",
    query: "Slowdown Omaha"
  },
  {
    id: "orpheum-holland",
    category: "fun",
    group: "music",
    area: "downtown",
    name: "Orpheum Theater & Holland Center",
    blurb: "Touring shows, symphony, and big-room performances downtown. Worth checking the calendar for that weekend.",
    query: "Orpheum Theater Omaha"
  },

  // ---- Neighborhoods to Wander ----
  {
    id: "benson",
    category: "fun",
    group: "neighborhoods",
    area: "benson",
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
    area: "midtown",
    name: "Blackstone District",
    blurb: "Walkable midtown strip of bars and restaurants. Compact enough to park once and wander.",
    query: "Blackstone District Omaha"
  },
  {
    id: "dundee",
    category: "fun",
    group: "neighborhoods",
    area: "dundee",
    name: "Dundee",
    blurb: "Small, walkable neighborhood strip with an old-Omaha feel. Low-key dinner and a drink.",
    query: "Dundee Omaha NE"
  }
];
