'use client'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function Chip({ label, selected, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
        ${selected
          ? 'border-amber-border bg-warm-tint text-brand-dark'
          : 'border-border-line bg-white text-muted-text hover:border-amber-border hover:bg-warm-tint'
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  )
}
