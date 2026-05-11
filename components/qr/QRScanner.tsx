'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function QRScanner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    let scanner: import('html5-qrcode').Html5Qrcode | null = null

    async function startScanner() {
      const { Html5Qrcode } = await import('html5-qrcode')
      if (!containerRef.current) return

      scanner = new Html5Qrcode('qr-scanner')

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner?.stop()
          // Parse userId from URL like https://brewme.app/u/{userId}
          const match = decodedText.match(/\/u\/([a-f0-9-]{36})/)
          if (match) {
            router.push(`/u/${match[1]}`)
          }
        },
        () => {}
      )
    }

    startScanner().catch(console.error)

    return () => {
      scanner?.stop().catch(() => {})
    }
  }, [router])

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      <div id="qr-scanner" ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />
      {/* Amber corner brackets viewfinder overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-56 h-56 relative">
          <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-accent rounded-tl-sm" />
          <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-accent rounded-tr-sm" />
          <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-accent rounded-bl-sm" />
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-accent rounded-br-sm" />
        </div>
      </div>
    </div>
  )
}
