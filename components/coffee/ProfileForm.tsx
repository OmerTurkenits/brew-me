'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Input from '@/components/ui/Input'
import Chip from '@/components/ui/Chip'
import Button from '@/components/ui/Button'
import type { CoffeeProfile } from '@/lib/supabase/types'
import { DRINK_KEY, SIZE_KEY, TEMP_KEY, MILK_KEY, SUGAR_KEY, FOAM_KEY } from '@/lib/utils/coffeeKeys'

const DRINK_TYPES = ['espresso', 'latte', 'cappuccino', 'flat white', 'americano', 'cold brew', 'macchiato', 'mocha']
const SIZES = ['small', 'medium', 'large']
const TEMPS = ['hot', 'iced', 'warm']
const MILKS = ['whole', 'oat', 'almond', 'soy', 'coconut', 'none']
const SUGARS = ['none', 'half', 'one', 'two']
const FOAMS = ['none', 'normal', 'extra']

export type ProfileFormData = Omit<CoffeeProfile, 'id' | 'user_id' | 'created_at' | 'is_active'>

interface Props {
  initialData?: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => Promise<void>
  submitLabel?: string
  step?: 1 | 2
}

export default function ProfileForm({ initialData, onSubmit, submitLabel, step }: Props) {
  const t = useTranslations('coffee')
  const to = useTranslations('onboarding')
  const tc = useTranslations('common')

  const [form, setForm] = useState<ProfileFormData>({
    name: initialData?.name ?? '',
    drink_type: initialData?.drink_type ?? 'espresso',
    size: initialData?.size ?? 'medium',
    temperature: initialData?.temperature ?? 'hot',
    shots: initialData?.shots ?? 1,
    milk_type: initialData?.milk_type ?? 'whole',
    sugar_level: initialData?.sugar_level ?? 'none',
    sweetener_type: initialData?.sweetener_type ?? null,
    foam_preference: initialData?.foam_preference ?? 'normal',
    syrups: [],
    toppings: [],
    special_instructions: initialData?.special_instructions ?? null,
    allergens: [],
    is_seasonal: initialData?.is_seasonal ?? false,
    season: initialData?.season ?? 'all',
  })
  const [loading, setLoading] = useState(false)

  function set<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  const label = submitLabel ?? tc('save')

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t('special')}
          value={form.special_instructions ?? ''}
          onChange={(e) => set('special_instructions', e.target.value || null)}
          placeholder="e.g. extra hot, no foam..."
        />
        <Input
          label={to('profileName')}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder={to('profileNamePlaceholder')}
          required
        />
        <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
          {loading ? tc('saving') : label}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('drinkType')}</p>
        <div className="flex flex-wrap gap-2">
          {DRINK_TYPES.map((d) => (
            <Chip key={d} label={t(DRINK_KEY[d] as any)} selected={form.drink_type === d} onClick={() => set('drink_type', d)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('size')}</p>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <Chip key={s} label={t(SIZE_KEY[s] as any)} selected={form.size === s} onClick={() => set('size', s)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('temperature')}</p>
        <div className="flex gap-2">
          {TEMPS.map((temp) => (
            <Chip key={temp} label={t(TEMP_KEY[temp] as any)} selected={form.temperature === temp} onClick={() => set('temperature', temp)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('milk')}</p>
        <div className="flex flex-wrap gap-2">
          {MILKS.map((m) => (
            <Chip key={m} label={t(MILK_KEY[m] as any)} selected={form.milk_type === m} onClick={() => set('milk_type', m)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('sugar')}</p>
        <div className="flex gap-2">
          {SUGARS.map((s) => (
            <Chip key={s} label={t(SUGAR_KEY[s] as any)} selected={form.sugar_level === s} onClick={() => set('sugar_level', s)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('foam')}</p>
        <div className="flex gap-2">
          {FOAMS.map((f) => (
            <Chip key={f} label={t(FOAM_KEY[f] as any)} selected={form.foam_preference === f} onClick={() => set('foam_preference', f)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-dark mb-2">{t('shots')}</p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => set('shots', Math.max(1, form.shots - 1))} className="w-8 h-8 rounded-full border border-border-line flex items-center justify-center text-brand-dark hover:bg-warm-tint">−</button>
          <span className="font-medium w-4 text-center">{form.shots}</span>
          <button type="button" onClick={() => set('shots', Math.min(6, form.shots + 1))} className="w-8 h-8 rounded-full border border-border-line flex items-center justify-center text-brand-dark hover:bg-warm-tint">+</button>
        </div>
      </div>

      {step === 1 ? (
        <Button type="submit" size="lg" className="w-full mt-2">{label}</Button>
      ) : (
        <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
          {loading ? tc('saving') : label}
        </Button>
      )}
    </form>
  )
}
