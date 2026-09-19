// Edit this file to customize the guide. Each place needs: id (unique,
// lowercase-hyphenated), category, name, blurb, and a maps link.
// category must be one of: "eat", "drink", "do", "stay"

const WEDDING = {
  couple: "Anna & Charlie",
  date: "Saturday, October 3, 2026",
  venueName: "TODO: Venue name",
  venueAddress: "TODO: Venue address",
  venueMapsUrl: "https://maps.google.com/?q=TODO",
  ceremonyTime: "TODO: e.g. 4:00 PM",
  receptionTime: "TODO: e.g. 6:00 PM",
  hotelBlock: "TODO: hotel name + booking link/code, or delete this line",
  dressCode: "TODO: optional",
  notes: "TODO: any other must-know logistics (parking, shuttle, weather backup, etc.)"
};

const CONTACT = {
  name: "Nick",
  email: "TODO@example.com",
  blurb: "Questions about the area or the weekend? Reach out."
};

const PLACES = [
  {
    id: "old-market",
    category: "do",
    name: "Old Market",
    blurb: "Cobblestone streets, local shops, restaurants, and bars downtown. Good home base for wandering.",
    mapsUrl: "https://maps.google.com/?q=Old+Market+Omaha"
  },
  {
    id: "henry-doorly-zoo",
    category: "do",
    name: "Henry Doorly Zoo & Aquarium",
    blurb: "Consistently ranked one of the best zoos in the country. Worth a half day.",
    mapsUrl: "https://maps.google.com/?q=Henry+Doorly+Zoo"
  },
  {
    id: "lauritzen-gardens",
    category: "do",
    name: "Lauritzen Gardens",
    blurb: "Botanical garden overlooking the Missouri River. Calm, pretty, easy walk.",
    mapsUrl: "https://maps.google.com/?q=Lauritzen+Gardens"
  },
  {
    id: "bob-kerrey-bridge",
    category: "do",
    name: "Bob Kerrey Pedestrian Bridge",
    blurb: "Walk across the Missouri River — Nebraska to Iowa and back. Great photo spot.",
    mapsUrl: "https://maps.google.com/?q=Bob+Kerrey+Pedestrian+Bridge+Omaha"
  },
  {
    id: "todo-restaurant-1",
    category: "eat",
    name: "TODO: your favorite dinner spot",
    blurb: "TODO: why you like it / what to order",
    mapsUrl: "https://maps.google.com/?q=TODO"
  },
  {
    id: "todo-restaurant-2",
    category: "eat",
    name: "TODO: brunch/breakfast spot",
    blurb: "TODO",
    mapsUrl: "https://maps.google.com/?q=TODO"
  },
  {
    id: "todo-bar-1",
    category: "drink",
    name: "TODO: a bar you'd actually take people to",
    blurb: "TODO",
    mapsUrl: "https://maps.google.com/?q=TODO"
  },
  {
    id: "todo-coffee-1",
    category: "drink",
    name: "TODO: coffee shop",
    blurb: "TODO",
    mapsUrl: "https://maps.google.com/?q=TODO"
  },
  {
    id: "todo-hotel-1",
    category: "stay",
    name: "TODO: hotel/lodging suggestion",
    blurb: "TODO: proximity to venue, why you'd pick it",
    mapsUrl: "https://maps.google.com/?q=TODO"
  }
];
