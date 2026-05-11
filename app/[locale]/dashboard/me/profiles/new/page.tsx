'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProfileForm, { type ProfileFormData } from '@/components/coffee/ProfileForm'
import Link from 'next/link'

export default function NewProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<Partial<ProfileFormData>>({})

  async function handleStep1(data: ProfileFormData) {
    setStep1Data(data)
    setStep(2)
  }

  async function handleStep2(data: ProfileFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('coffee_profiles').insert({
      user_id: user.id,
      ...step1Data,
      ...data,
      is_active: false,
    })

    router.push('/dashboard/me')
    router.refresh()
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/me" className="text-muted-text text-sm">← Back</Link>
        <h1 className="text-xl font-medium text-brand-dark">
          {step === 1 ? 'New profile (1/2)' : 'New profile (2/2)'}
        </h1>
      </div>
      {step === 1 ? (
        <ProfileForm onSubmit={handleStep1} submitLabel="Next" step={1} />
      ) : (
        <ProfileForm initialData={step1Data} onSubmit={handleStep2} submitLabel="Create profile" step={2} />
      )}
    </div>
  )
}
