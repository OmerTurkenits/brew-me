'use client'

import type { CoffeeProfile } from '@/lib/supabase/types'
import { useTranslations } from 'next-intl'
import { DRINK_KEY, SIZE_KEY, TEMP_KEY, MILK_KEY, SUGAR_KEY, FOAM_KEY } from '@/lib/utils/coffeeKeys'

interface Props {
  profile: CoffeeProfile
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b border-border-line last:border-0">
      <span className="text-sm text-muted-text">{label}</span>
      <span className="text-sm font-medium text-brand-dark">{value}</span>
    </div>
  )
}

export default function ProfileCard({ profile }: Props) {
  const t = useTranslations('coffee')
  const tm = useTranslations('me')

  const tval = (key: string, fallback: string) => {
    try { return t(key as any) } catch { return fallback }
  }

  const shotsLabel = `${profile.shots} ${profile.shots === 1 ? tval('shotSingular', 'shot') : tval('shotPlural', 'shots')}`

  return (
    <div className="bg-white border border-border-line rounded-[14px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-brand-dark">{profile.name}</h3>
        {profile.is_active && (
          <span className="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full">
            {tm('active')}
          </span>
        )}
      </div>

      <Row label={t('drinkType')} value={tval(DRINK_KEY[profile.drink_type], profile.drink_type)} />
      <Row label={t('size')} value={tval(SIZE_KEY[profile.size], profile.size)} />
      <Row label={t('temperature')} value={tval(TEMP_KEY[profile.temperature], profile.temperature)} />
      <Row label={t('shots')} value={shotsLabel} />
      {profile.milk_type && (
        <Row label={t('milk')} value={tval(MILK_KEY[profile.milk_type], profile.milk_type)} />
      )}
      {profile.sugar_level && (
        <Row label={t('sugar')} value={tval(SUGAR_KEY[profile.sugar_level], profile.sugar_level)} />
      )}
      {profile.foam_preference && (
        <Row label={t('foam')} value={tval(FOAM_KEY[profile.foam_preference], profile.foam_preference)} />
      )}
      {profile.special_instructions && (
        <div className="mt-3 p-3 bg-warm-tint rounded-lg">
          <p className="text-xs text-section-label font-medium mb-1">{t('special')}</p>
          <p className="text-sm text-brand-dark">{profile.special_instructions}</p>
        </div>
      )}
    </div>
  )
}
