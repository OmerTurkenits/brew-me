'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import ProfileForm, { type ProfileFormData } from '@/components/coffee/ProfileForm'

export default function ProfileStep2Page() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [step1Data, setStep1Data] = useState<Partial<ProfileFormData>>({})

  useEffect(() => {
    const stored = sessionStorage.getItem('profile_step1')
    if (stored) setStep1Data(JSON.parse(stored))
  }, [])

  async function handleFinish(data: ProfileFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/sign-in'); return }

    const merged: ProfileFormData = { ...step1Data, ...data }

    // Create the first coffee profile as active
    await supabase.from('coffee_profiles').insert({
      user_id: user.id,
      ...merged,
      is_active: true,
    })

    // Award personality badge
    const badgeKey = sessionStorage.getItem('quiz_badge_key')
    if (badgeKey) {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('key', badgeKey)
        .maybeSingle()
      if (badge) {
        const { data: existing } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_id', badge.id)
          .maybeSingle()
        if (!existing) {
          await supabase.from('user_badges').insert({ user_id: user.id, badge_id: badge.id })
        }
      }
    }

    // Clean up session storage
    sessionStorage.removeItem('quiz_defaults')
    sessionStorage.removeItem('quiz_badge_key')
    sessionStorage.removeItem('profile_step1')

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-muted-text mb-1">Step 3 of 3</p>
        <h2 className="text-2xl font-medium text-brand-dark">{t('buildTitle2')}</h2>
        <p className="text-sm text-muted-text mt-1">{t('buildSubtitle2')}</p>
      </div>
      <ProfileForm
        initialData={step1Data}
        onSubmit={handleFinish}
        submitLabel={t('finish')}
        step={2}
      />
    </div>
  )
}
