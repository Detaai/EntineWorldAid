import React, { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterNode from './CharacterNode'

/**
 * FamilyTree
 * Props:
 * - characters: Array of { id, name, image, parents: [id], spouse: id|null, children: [id] }
 * - radius: number (px)
 *
 * Notes:
 * - Uses Tailwind classes for styling; requires Tailwind in the host app.
 * - Uses Framer Motion for animation.
 */
export default function FamilyTree({ characters = [], radius = 300 }) {
  const [selectedId, setSelectedId] = useState(null)
  const containerRef = useRef(null)
  const [rotationSpeed, setRotationSpeed] = useState(20) // seconds per revolution

  // map by id for easy lookup
  const map = useMemo(() => {
    const m = new Map()
    characters.forEach((c) => m.set(c.id, c))
    return m
  }, [characters])

  // positions for semicircle
  const positions = useMemo(() => {
    const n = characters.length
    const pts = []
    for (let i = 0; i < n; i++) {
      // angle from 0..PI (half circle)
      const t = n === 1 ? 0.5 : i / (n - 1)
      const angle = Math.PI * t
      const x = Math.cos(angle) * radius
      const y = -Math.sin(angle) * radius
      pts.push({ x, y })
    }
    return pts
  }, [characters, radius])

  // idle rotation: use a Framer Motion keyframe animation that rotates continuously
  const rotationTransition = useMemo(() => ({
    repeat: Infinity,
    ease: 'linear',
    duration: rotationSpeed,
  }), [rotationSpeed])

  useEffect(() => {
    // reduce motion if prefers-reduced-motion
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq && mq.matches) setRotationSpeed(0)
  }, [])

  const selected = selectedId ? map.get(selectedId) : null

  return (
    <div className="w-full h-full relative flex items-center justify-center p-6">
      {/* semicircle container */}
      <motion.div
        ref={containerRef}
        className="relative w-[800px] h-[420px]"
        style={{ perspective: 1200 }}
        animate={rotationSpeed ? { rotate: [0, 360] } : {}}
        transition={rotationSpeed ? rotationTransition : {}}
        onHoverStart={() => setRotationSpeed(8)}
        onHoverEnd={() => setRotationSpeed(20)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* render nodes */}
          {characters.map((ch, i) => {
            const pos = positions[i]
            const left = `calc(50% + ${pos.x}px)`
            const top = `calc(50% + ${pos.y}px)`
            return (
              <motion.div
                key={ch.id}
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.03 }}
                style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)' }}
              >
                <CharacterNode
                  character={ch}
                  onClick={() => setSelectedId(ch.id)}
                  selected={selectedId === ch.id}
                />
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* center view */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute z-50 w-[720px] h-[480px] bg-gradient-to-br from-gray-900/80 to-black/70 border border-gray-700 rounded-2xl p-6 shadow-2xl flex"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* central character */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <img src={selected.image} alt={selected.name} className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover mx-auto shadow-lg" />
                <div className="mt-4 text-2xl font-semibold text-white">{selected.name}</div>
              </div>

              {/* parents above */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-6">
                {selected.parents && selected.parents.map((pid) => {
                  const p = map.get(pid)
                  if (!p) return null
                  return (
                    <div key={pid} className="flex flex-col items-center text-center">
                      <img src={p.image} alt={p.name} className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
                      <div className="text-sm text-gray-100 mt-2">{p.name}</div>
                    </div>
                  )
                })}
              </div>

              {/* spouse to the right */}
              {selected.spouse && map.get(selected.spouse) && (
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center text-center">
                  <img src={map.get(selected.spouse).image} alt="spouse" className="w-28 h-28 rounded-full object-cover border-2 border-gray-300" />
                  <div className="text-sm text-gray-100 mt-2">{map.get(selected.spouse).name}</div>
                </div>
              )}

              {/* children below */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6">
                {selected.children && selected.children.map((cid) => {
                  const c = map.get(cid)
                  if (!c) return null
                  return (
                    <div key={cid} className="flex flex-col items-center text-center">
                      <img src={c.image} alt={c.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                      <div className="text-sm text-gray-100 mt-2">{c.name}</div>
                    </div>
                  )
                })}
              </div>

              {/* close button */}
              <button
                className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-md shadow"
                onClick={() => setSelectedId(null)}
              >Close</button>

              {/* connectors: SVG lines between center and parents/spouse/children */}
              <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
                {/* parents lines */}
                {selected.parents && selected.parents.map((pid, idx) => {
                  const elParent = document.querySelector(`img[src="${map.get(pid)?.image}"]`)
                  const elCenter = document.querySelector(`img[src="${selected.image}"]`)
                  if (!map.get(pid) || !elCenter) return null
                  try {
                    const parentRect = elParent?.getBoundingClientRect()
                    const centerRect = elCenter?.getBoundingClientRect()
                    if (!parentRect) return null
                    // transform to svg coords is complicated; use simple visual approximation by percentage
                  } catch (e) {
                    return null
                  }
                  // Fallback: draw simple decorative line from top center to center-top
                  const x1 = 50 + (idx - ((selected.parents.length - 1) / 2)) * 6
                  return <line key={`p-${pid}`} x1={`${x1}%`} y1={`12%`} x2={`50%`} y2={`46%`} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                })}

                {/* spouse line */}
                {selected.spouse && map.get(selected.spouse) && (
                  <line x1={`72%`} y1={`50%`} x2={`63%`} y2={`50%`} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                )}

                {/* children lines */}
                {selected.children && selected.children.map((cid, idx) => (
                  <line key={`c-${cid}`} x1={`50%`} y1={`54%`} x2={`${44 + idx * 6}%`} y2={`86%`} stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                ))}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
