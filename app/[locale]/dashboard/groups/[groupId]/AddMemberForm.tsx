'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { searchProfiles } from '@/lib/queries/profiles'
import { addGroupMember } from '@/lib/queries/groups'
import type { Profile } from '@/lib/supabase/types'
import Avatar from '@/components/ui/Avatar'

export default function AddMemberForm({ groupId }: { groupId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    const supabase = createClient()
    const data = await searchProfiles(supabase, q).catch(() => [])
    setResults(data)
  }

  async function handleAdd(userId: string) {
    setLoading(true)
    const supabase = createClient()
    await addGroupMember(supabase, groupId, userId).catch(() => {})
    setQuery('')
    setResults([])
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-section-label uppercase tracking-wide">Add member</p>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name..."
        className="w-full px-4 py-2.5 rounded-xl border border-border-line bg-white text-brand-dark placeholder:text-muted-text focus:outline-none focus:ring-2 focus:ring-brand-accent/30 text-sm"
      />
      {results.length > 0 && (
        <div className="bg-white border border-border-line rounded-xl overflow-hidden">
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => handleAdd(u.id)}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-border-line last:border-0 hover:bg-warm-tint text-left transition-colors"
            >
              <Avatar userId={u.id} name={u.name} size="sm" />
              <span className="text-sm text-brand-dark">{u.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
