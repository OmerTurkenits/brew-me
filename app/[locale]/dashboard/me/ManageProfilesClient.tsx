'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { setActiveProfile, deleteCoffeeProfile } from '@/lib/queries/coffeeProfiles'
import { formatOrderOneLiner } from '@/lib/utils/formatOrder'
import type { CoffeeProfile } from '@/lib/supabase/types'
import Link from 'next/link'

interface Props {
  profiles: CoffeeProfile[]
  userId: string
}

export default function ManageProfilesClient({ profiles, userId }: Props) {
  const t = useTranslations('me')
  const tc = useTranslations('coffee')
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function handleSetActive(profileId: string) {
    const supabase = createClient()
    await setActiveProfile(supabase, userId, profileId)
    startTransition(() => router.refresh())
  }

  async function handleDelete(profileId: string) {
    if (!confirm(t('confirmDelete'))) return
    const supabase = createClient()
    await deleteCoffeeProfile(supabase, profileId)
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex flex-col gap-3">
      {profiles.map((p) => (
        <div key={p.id} className="bg-white border border-border-line rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-brand-dark text-sm">{p.name}</span>
              {p.is_active && (
                <span className="text-xs bg-brand-accent text-white px-2 py-0.5 rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!p.is_active && (
                <button
                  onClick={() => handleSetActive(p.id)}
                  className="text-xs text-brand-accent hover:underline"
                >
                  {t('setActive')}
                </button>
              )}
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-400 hover:underline"
              >
                {t('deleteProfile')}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-text">
            {formatOrderOneLiner(p, (key) => tc(key as any))}
          </p>
        </div>
      ))}

      <Link
        href="/dashboard/me/profiles/new"
        className="border-2 border-dashed border-border-line rounded-[14px] p-4 flex items-center justify-center gap-2 text-muted-text text-sm hover:border-brand-accent hover:text-brand-accent transition-colors"
      >
        + {t('addProfile')}
      </Link>
    </div>
  )
}
