'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ProfileForm, { type ProfileFormData } from '@/components/coffee/ProfileForm'

export default function ProfileStep1Page() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [defaults, setDefaults] = useState<Partial<ProfileFormData>>({})

  useEffect(() => {
    const stored = sessionStorage.getItem('quiz_defaults')
    if (stored) setDefaults(JSON.parse(stored))
  }, [])

  async function handleNext(data: ProfileFormData) {
    sessionStorage.setItem('profile_step1', JSON.stringify(data))
    router.push('/onboarding/profile-2')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-muted-text mb-1">Step 2 of 3</p>
        <h2 className="text-2xl font-medium text-brand-dark">{t('buildTitle1')}</h2>
        <p className="text-sm text-muted-text mt-1">{t('buildSubtitle1')}</p>
      </div>
      <ProfileForm
        initialData={defaults}
        onSubmit={handleNext}
        submitLabel={t('next')}
        step={1}
      />
    </div>
  )
}
