import React from 'react'

export default function CharacterNode({ character, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center focus:outline-none ${selected ? 'scale-105' : ''}`}
      title={character.name}
    >
      <img src={character.image} alt={character.name} className="w-20 h-20 rounded-full object-cover border-2 border-yellow-300 shadow-md" />
      <div className="mt-2 text-sm text-white truncate max-w-[120px] text-center">{character.name}</div>
    </button>
  )
}
