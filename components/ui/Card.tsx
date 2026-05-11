import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean
}

export default function Card({ padding = true, className = '', children, ...props }: Props) {
  return (
    <div
      className={`bg-white border border-border-line rounded-[14px] ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
