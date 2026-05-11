'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  initialValue: boolean
}

export default function PrivacyToggle({ userId, initialValue }: Props) {
  const [enabled, setEnabled] = useState(initialValue)
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function handleToggle() {
    const next = !enabled
    setEnabled(next)
    const supabase = createClient()
    await supabase
      .from('privacy_settings')
      .upsert({ user_id: userId, public_by_default: next })
    startTransition(() => router.refresh())
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-brand-accent' : 'bg-border-line'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
