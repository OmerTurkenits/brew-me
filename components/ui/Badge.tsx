interface Props {
  icon: string
  label: string
  size?: 'sm' | 'md'
}

export default function BadgePill({ icon, label, size = 'md' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-warm-tint border border-amber-border rounded-full font-medium text-section-label
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
