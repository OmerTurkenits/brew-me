'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { setActiveProfile } from '@/lib/queries/coffeeProfiles'
import { useRouter } from 'next/navigation'
import type { CoffeeProfile } from '@/lib/supabase/types'

interface Props {
  profiles: CoffeeProfile[]
  activeId: string | null
  userId: string
}

export default function ProfileSwitcher({ profiles, activeId, userId }: Props) {
  const [current, setCurrent] = useState(activeId)
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setCurrent(id)
    const supabase = createClient()
    await setActiveProfile(supabase, userId, id)
    startTransition(() => router.refresh())
  }

  return (
    <select
      value={current ?? ''}
      onChange={handleChange}
      className="w-full px-4 py-2.5 rounded-xl border border-border-line bg-white text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
    >
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  )
}
