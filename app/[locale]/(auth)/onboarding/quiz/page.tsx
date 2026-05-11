'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

const QUIZ_OPTIONS = [
  {
    key: 'strong',
    emoji: '☕',
    profileDefaults: { drink_type: 'espresso', milk_type: 'none', sugar_level: 'none', temperature: 'hot' },
    badgeKey: 'the_minimalist',
  },
  {
    key: 'milky',
    emoji: '🥛',
    profileDefaults: { drink_type: 'latte', milk_type: 'oat', sugar_level: 'half', temperature: 'hot' },
    badgeKey: 'the_smooth_operator',
  },
  {
    key: 'iced',
    emoji: '🧊',
    profileDefaults: { drink_type: 'cold brew', milk_type: 'none', sugar_level: 'none', temperature: 'iced' },
    badgeKey: 'cold_brew_adventurer',
  },
  {
    key: 'sweet',
    emoji: '🍬',
    profileDefaults: { drink_type: 'mocha', milk_type: 'whole', sugar_level: 'two', temperature: 'hot' },
    badgeKey: 'the_sweet_tooth',
  },
]

export default function QuizPage() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected) return
    const option = QUIZ_OPTIONS.find((o) => o.key === selected)!
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/sign-in'); return }

    // Persist quiz choice in sessionStorage for the profile builder
    sessionStorage.setItem('quiz_defaults', JSON.stringify(option.profileDefaults))
    sessionStorage.setItem('quiz_badge_key', option.badgeKey)

    setLoading(false)
    router.push('/onboarding/profile-1')
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-brand-dark">{t('quizTitle')}</h2>
        <p className="text-sm text-muted-text mt-1">{t('quizSubtitle')}</p>
      </div>

      <div className="flex flex-col gap-3">
        {QUIZ_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSelected(opt.key)}
            className={`flex items-center gap-4 p-4 rounded-[14px] border text-left transition-all
              ${selected === opt.key
                ? 'border-amber-border bg-warm-tint'
                : 'border-border-line bg-white hover:border-amber-border'
              }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="font-medium text-brand-dark">{t(opt.key as 'strong')}</span>
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selected || loading}
        size="lg"
        className="w-full"
      >
        {loading ? 'Loading...' : t('next')}
      </Button>
    </div>
  )
}
