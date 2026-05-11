'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { searchProfiles } from '@/lib/queries/profiles'
import { getActiveCoffeeProfile } from '@/lib/queries/coffeeProfiles'
import type { Profile, CoffeeProfile } from '@/lib/supabase/types'
import Avatar from '@/components/ui/Avatar'
import { formatOrderOneLiner } from '@/lib/utils/formatOrder'

const RECENT_KEY = 'brewme_recent_lookups'

function useRecentLookups() {
  const [recents, setRecents] = useState<{ userId: string; name: string }[]>([])
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecents(JSON.parse(stored))
    } catch {}
  }, [])
  return recents
}

export default function FindPage() {
  const t = useTranslations('find')
  const tc = useTranslations('coffee')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [profiles, setProfiles] = useState<Record<string, CoffeeProfile | null>>({})
  const [loading, setLoading] = useState(false)
  const recents = useRecentLookups()

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    const supabase = createClient()
    const data = await searchProfiles(supabase, q).catch(() => [])
    setResults(data)

    // Fetch active profiles for results
    const entries = await Promise.all(
      data.map(async (p) => {
        const cp = await getActiveCoffeeProfile(supabase, p.id).catch(() => null)
        return [p.id, cp] as [string, CoffeeProfile | null]
      })
    )
    setProfiles(Object.fromEntries(entries))
    setLoading(false)
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto">
      <h1 className="text-xl font-medium text-brand-dark">{t('title')}</h1>

      <input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full px-4 py-3 rounded-xl border border-border-line bg-white text-brand-dark placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-amber-border"
      />

      {!query && (
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/find/scan"
            className="bg-brand-dark text-amber-text rounded-[14px] p-5 flex flex-col gap-3"
          >
            <span className="text-3xl">📷</span>
            <span className="text-sm font-medium">{t('scanQr')}</span>
          </Link>
          <Link
            href="/dashboard/groups"
            className="bg-white border border-border-line rounded-[14px] p-5 flex flex-col gap-3"
          >
            <span className="text-3xl">👥</span>
            <span className="text-sm font-medium text-brand-dark">{t('viewGroup')}</span>
          </Link>
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-text text-center">Searching...</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col bg-white border border-border-line rounded-[14px] overflow-hidden">
          {results.map((user) => {
            const cp = profiles[user.id]
            return (
              <Link
                key={user.id}
                href={`/u/${user.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border-line last:border-0 hover:bg-warm-tint transition-colors"
              >
                <Avatar userId={user.id} name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark">{user.name}</p>
                  {cp && <p className="text-xs text-muted-text truncate">{formatOrderOneLiner(cp, (key) => tc(key as any))}</p>}
                </div>
                <span className="text-muted-text text-sm">→</span>
              </Link>
            )
          })}
        </div>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-sm text-muted-text text-center">{t('noResults')}</p>
      )}

      {!query && recents.length > 0 && (
        <div>
          <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-2">
            {t('recentLookups')}
          </p>
          <div className="flex flex-col bg-white border border-border-line rounded-[14px] overflow-hidden">
            {recents.map((r) => (
              <Link
                key={r.userId}
                href={`/u/${r.userId}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border-line last:border-0 hover:bg-warm-tint transition-colors"
              >
                <Avatar userId={r.userId} name={r.name} size="sm" />
                <span className="text-sm text-brand-dark">{r.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
