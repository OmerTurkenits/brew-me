'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'

export default function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = locale === 'en' ? 'he' : 'en'
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-warm-tint transition-colors disabled:opacity-50"
    >
      <span>🌐</span>
      <span className="flex-1 text-sm text-brand-dark">
        {locale === 'en' ? 'עברית' : 'English'}
      </span>
      <span className="text-muted-text">→</span>
    </button>
  )
}
