'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const QRScanner = dynamic(() => import('@/components/qr/QRScanner'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-sm mx-auto bg-brand-dark rounded-2xl flex items-center justify-center">
      <p className="text-amber-text text-sm">Loading camera...</p>
    </div>
  ),
})

export default function ScanPage() {
  const t = useTranslations('scanner')

  return (
    <div className="min-h-screen bg-brand-dark px-5 py-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/find" className="text-amber-text">
          ← Back
        </Link>
        <h1 className="text-lg font-medium text-amber-text">{t('title')}</h1>
      </div>

      <QRScanner />

      <p className="text-center text-amber-text/60 text-sm">{t('orSearch')}</p>

      <Link
        href="/dashboard/find"
        className="w-full text-center py-3 rounded-xl border border-amber-border text-amber-text text-sm"
      >
        Search by name instead
      </Link>
    </div>
  )
}
