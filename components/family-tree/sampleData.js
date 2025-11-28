// Sample family data for FamilyTree component
export const sampleCharacters = [
  { id: 'a', name: 'Elder Deta', image: 'nameplate.jpg', parents: [], spouse: 'b', children: ['c','d'] },
  { id: 'b', name: 'Marin', image: 'main-cast-1.jpg', parents: [], spouse: 'a', children: ['c','d'] },
  { id: 'c', name: 'Bluma', image: 'Bluma-image1.jpg', parents: ['a','b'], spouse: null, children: ['e'] },
  { id: 'd', name: 'Gwen', image: 'gwen-1.jpg', parents: ['a','b'], spouse: null, children: [] },
  { id: 'e', name: 'Young Hero', image: 'tavern-backround.jpg', parents: ['c'], spouse: null, children: [] },
]
