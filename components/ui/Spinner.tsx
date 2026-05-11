export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-7 h-7 rounded-full border-2 border-border-line border-t-brand-accent animate-spin" />
    </div>
  )
}
