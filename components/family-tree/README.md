Family Tree React component
===========================

Files in this folder:
- `FamilyTree.jsx` — main component. Props: `characters` (array), `radius` (px).
- `CharacterNode.jsx` — small presentational component for a character avatar.
- `sampleData.js` — example dataset to get started.

Usage
-----

1. Install dependencies in your React project:

   npm install framer-motion

2. Ensure Tailwind CSS is configured in your project (this component uses Tailwind classes).

3. Import and use:

```jsx
import FamilyTree from './components/family-tree/FamilyTree'
import { sampleCharacters } from './components/family-tree/sampleData'

function App(){
  return <FamilyTree characters={sampleCharacters} radius={300} />
}
```

Notes
-----
- The component is intentionally self-contained and focuses on visuals and animations. It uses decorative SVG lines as approximations; for pixel-perfect connector lines you may want to compute element centers and transform coordinates into the SVG viewport.
- The center view shows parents above, spouse to the right, children below. Clicking a character animates the center view; closing animates back.
