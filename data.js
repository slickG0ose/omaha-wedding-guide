// Edit this file to customize the guide.
//
// CATEGORIES controls the tabs and the section order on the Guide screen.
// Each place needs: id (unique, lowercase-hyphenated), category (must match a
// CATEGORIES id), name, blurb, and query. Optional: tag (small pill on the card).
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
  ceremonyTime: "TODO: e.g. 4:00 PM",
  receptionTime: "TODO: e.g. 6:00 PM",
  hotelBlock: "TODO: hotel name + booking link/code, or delete this line",
  dressCode: "TODO: optional",
  notes: "TODO: any other must-know logistics (parking, shuttle, weather backup, etc.)"
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
  { id: "classics", label: "Classics", heading: "Classic Omaha" },
  { id: "eat", label: "Food", heading: "Food & Drink" },
  { id: "outdoors", label: "Outdoors", heading: "Outdoors & Overlooks" },
  { id: "culture", label: "Music & Arts", heading: "Music, Art & Nightlife" }
];

const PLACES = [
  // ---------- Classic Omaha ----------
  {
    id: "old-market",
    category: "classics",
    name: "Old Market",
    blurb: "Cobblestone streets, local shops, restaurants, and bars downtown. The easiest home base for wandering.",
    query: "Old Market Omaha"
  },
  {
    id: "henry-doorly-zoo",
    category: "classics",
    name: "Henry Doorly Zoo & Aquarium",
    blurb: "Routinely ranked among the best zoos in the country. Budget a half day — it's bigger than people expect.",
    query: "Henry Doorly Zoo"
  },
  {
    id: "kiewit-luminarium",
    category: "classics",
    name: "Kiewit Luminarium",
    blurb: "Hands-on science center on the riverfront. Genuinely fun for adults, not just kids.",
    query: "Kiewit Luminarium Omaha"
  },
  {
    id: "gene-leahy-mall",
    category: "classics",
    name: "Gene Leahy Mall & The RiverFront",
    blurb: "Rebuilt downtown park chain — lawns, sculpture, a big slide, and a straight shot to the river.",
    query: "Gene Leahy Mall Omaha"
  },
  {
    id: "bob-kerrey-bridge",
    category: "classics",
    name: "Bob Kerrey Pedestrian Bridge",
    blurb: "Walk across the Missouri River and stand in two states at once. Best light in the evening.",
    query: "Bob Kerrey Pedestrian Bridge Omaha"
  },
  {
    id: "lauritzen-gardens",
    category: "classics",
    name: "Lauritzen Gardens",
    blurb: "Botanical garden on the bluffs above the river. Calm, pretty, and an easy walk at any pace.",
    query: "Lauritzen Gardens"
  },
  {
    id: "durham-museum",
    category: "classics",
    name: "The Durham Museum",
    blurb: "Omaha history inside a restored art deco train station. Worth it for the building alone.",
    query: "Durham Museum Omaha"
  },

  // ---------- Food & Drink ----------
  // STARTER LIST — well-known metro spots, not yet your personal picks. Cut what
  // you wouldn't actually send people to, add your own, and confirm they're still
  // open before the weekend.
  {
    id: "gorats",
    category: "eat",
    name: "Gorat's Steak House",
    blurb: "Old-school Omaha steakhouse that hasn't changed in decades. Call ahead — it fills up.",
    tag: "Steak",
    query: "Gorat's Steak House Omaha"
  },
  {
    id: "the-drover",
    category: "eat",
    name: "The Drover",
    blurb: "Whiskey-marinated steak in a dark, cozy room. The other answer to \"where do I get an Omaha steak?\"",
    tag: "Steak",
    query: "The Drover Omaha"
  },
  {
    id: "block-16",
    category: "eat",
    name: "Block 16",
    blurb: "Downtown counter-service sandwiches with a cult following. Expect a line at lunch.",
    tag: "Casual",
    query: "Block 16 Omaha"
  },
  {
    id: "le-bouillon",
    category: "eat",
    name: "Le Bouillon",
    blurb: "French bistro tucked into an Old Market basement. Good call for a nicer dinner out.",
    tag: "Dinner",
    query: "Le Bouillon Omaha"
  },
  {
    id: "early-bird",
    category: "eat",
    name: "Early Bird Brunch",
    blurb: "Straightforward, well-executed brunch with a few locations around the metro.",
    tag: "Brunch",
    query: "Early Bird Brunch Omaha"
  },
  {
    id: "archetype-coffee",
    category: "eat",
    name: "Archetype Coffee",
    blurb: "The local coffee benchmark. Blackstone and Little Bohemia are both easy stops.",
    tag: "Coffee",
    query: "Archetype Coffee Omaha"
  },
  {
    id: "todo-restaurant-yours",
    category: "eat",
    name: "TODO: your actual favorite",
    blurb: "TODO: the one you'd take out-of-towners to, and what to order",
    query: "TODO"
  },

  // ---------- Outdoors & Overlooks ----------
  {
    id: "fontenelle-forest",
    category: "outdoors",
    name: "Fontenelle Forest",
    blurb: "Miles of wooded trails in Bellevue, plus a flat boardwalk loop for the easy version. Early October is peak color.",
    tag: "Active",
    query: "Fontenelle Forest Bellevue NE"
  },
  {
    id: "hitchcock-nature-center",
    category: "outdoors",
    name: "Hitchcock Nature Center",
    blurb: "Ridgeline hiking in the Loess Hills, close to the venue on the Iowa side. October is hawk migration season.",
    tag: "Active",
    query: "Hitchcock Nature Center Honey Creek IA"
  },
  {
    id: "lake-cunningham",
    category: "outdoors",
    name: "Lake Cunningham",
    blurb: "Big open water on the north side — paved trails, boat ramps, and room to spread out.",
    tag: "Active",
    query: "Lake Cunningham Omaha"
  },
  {
    id: "hummel-park",
    category: "outdoors",
    name: "Hummel Park",
    blurb: "Hilly, wooded, and quiet north of town. Steep ravines and the old stone steps — not a flat stroll.",
    tag: "Active",
    query: "Hummel Park Omaha"
  },
  {
    id: "chalco-hills",
    category: "outdoors",
    name: "Chalco Hills & Wehrspann Lake",
    blurb: "Flat loop around the lake in Papillion. Good for a walk, a run, or doing very little.",
    tag: "Easy",
    query: "Chalco Hills Recreation Area"
  },
  {
    id: "lewis-clark-overlook",
    category: "outdoors",
    name: "Lewis & Clark Monument Overlook",
    blurb: "Bluff-top view over the river valley and the Omaha skyline, minutes from the venue. Drive right up and sit.",
    tag: "Laid-back",
    query: "Lewis and Clark Monument Council Bluffs"
  },

  // ---------- Music, Art & Nightlife ----------
  {
    id: "benson",
    category: "culture",
    name: "Benson",
    blurb: "My favorite stretch in town — dive bars, live music, and good cheap food along Maple. Check what's on at The Waiting Room or Reverb.",
    tag: "Nick's pick",
    query: "Benson Omaha NE"
  },
  {
    id: "blackstone-district",
    category: "culture",
    name: "Blackstone District",
    blurb: "Walkable midtown strip of bars and restaurants. Compact enough to park once and wander.",
    query: "Blackstone District Omaha"
  },
  {
    id: "slowdown-film-streams",
    category: "culture",
    name: "Slowdown & Film Streams",
    blurb: "Indie music venue next door to the arthouse cinema, both in North Downtown. Easy night out.",
    query: "Slowdown Omaha"
  },
  {
    id: "joslyn-art-museum",
    category: "culture",
    name: "Joslyn Art Museum",
    blurb: "Free general admission, and the expansion gave it a lot more to see. Good rainy-afternoon option.",
    tag: "Free",
    query: "Joslyn Art Museum Omaha"
  },
  {
    id: "dundee",
    category: "culture",
    name: "Dundee",
    blurb: "Small, walkable neighborhood strip with an old-Omaha feel. Low-key dinner and a drink.",
    query: "Dundee Omaha NE"
  },
  {
    id: "orpheum-holland",
    category: "culture",
    name: "Orpheum Theater & Holland Center",
    blurb: "Touring shows, symphony, and big-room performances downtown. Worth checking the calendar for that weekend.",
    query: "Orpheum Theater Omaha"
  }
];
