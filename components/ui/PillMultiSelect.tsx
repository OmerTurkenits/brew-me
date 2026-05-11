'use client'

import { useState } from 'react'

interface Props {
  options: string[]
  optionLabels?: string[]
  value: string[]
  onChange: (value: string[]) => void
  addLabel?: string
}

export default function PillMultiSelect({ options, optionLabels, value, onChange, addLabel = '+ Add' }: Props) {
  const [custom, setCustom] = useState('')
  const [adding, setAdding] = useState(false)

  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item])
  }

  function handleAdd() {
    const trimmed = custom.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setCustom('')
    setAdding(false)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-all
            ${value.includes(opt)
              ? 'bg-brand-accent text-white border-brand-accent'
              : 'bg-white border-border-line text-muted-text hover:border-brand-accent'
            }`}
        >
          {optionLabels?.[i] ?? opt}
        </button>
      ))}

      {value.filter((v) => !options.includes(v)).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => toggle(v)}
          className="px-3 py-1.5 rounded-full text-sm bg-brand-accent text-white border border-brand-accent"
        >
          {v} ×
        </button>
      ))}

      {adding ? (
        <input
          autoFocus
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          onBlur={handleAdd}
          placeholder="Type and press enter"
          className="px-3 py-1.5 rounded-full text-sm border border-amber-border outline-none w-36"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border-line text-muted-text hover:border-brand-accent"
        >
          {addLabel}
        </button>
      )}
    </div>
  )
}
