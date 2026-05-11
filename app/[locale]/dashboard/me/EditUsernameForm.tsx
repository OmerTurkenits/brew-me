'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  initialName: string
}

export default function EditUsernameForm({ userId, initialName }: Props) {
  const t = useTranslations('me')
  const tc = useTranslations('common')
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ name: name.trim() }).eq('id', userId)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-brand-accent hover:underline mt-0.5"
      >
        {t('editName')}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save() }}
        className="text-sm border border-border-line rounded-lg px-3 py-1.5 text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-amber-border"
        placeholder={t('namePlaceholder')}
      />
      <button
        onClick={save}
        disabled={saving}
        className="text-xs font-medium text-brand-accent hover:underline disabled:opacity-50"
      >
        {saving ? tc('saving') : tc('save')}
      </button>
      <button
        onClick={() => { setName(initialName); setEditing(false) }}
        className="text-xs text-muted-text hover:underline"
      >
        {tc('cancel')}
      </button>
    </div>
  )
}
