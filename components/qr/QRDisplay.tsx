'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import Button from '@/components/ui/Button'

interface Props {
  userId: string
  userName: string
  profileName: string
}

export default function QRDisplay({ userId, userName, profileName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    // Compute URL client-side so it uses the actual origin (localhost in dev, real domain in prod)
    const profileUrl = `${window.location.origin}/u/${userId}`
    setUrl(profileUrl)

    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, profileUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#3D2B1F', light: '#FDFAF6' },
    })
  }, [userId])

  async function handleSave() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `brewme-${userName}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-warm-surface border border-border-line rounded-2xl p-4">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>

      <div className="text-center">
        <p className="font-medium text-brand-dark">{userName}</p>
        <p className="text-sm text-muted-text">{profileName}</p>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="secondary" onClick={handleSave} className="flex-1">
          Save QR
        </Button>
        <Button onClick={handleCopy} className="flex-1">
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </div>
    </div>
  )
}
