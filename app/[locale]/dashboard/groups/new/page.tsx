'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function NewGroupPage() {
  const t = useTranslations('groups')
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/sign-in'); return }

    const { data: group, error: err } = await supabase
      .from('groups')
      .insert({ name, description: description || null, created_by: user.id })
      .select()
      .single()

    if (err) { setLoading(false); setError(err.message); return }

    const { error: memberErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id, role: 'admin' })

    setLoading(false)
    if (memberErr) { setError(memberErr.message); return }
    router.push(`/dashboard/groups/${group.id}`)
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/groups" className="text-muted-text text-sm">← Back</Link>
        <h1 className="text-xl font-medium text-brand-dark">{t('createNew')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label={t('groupName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Office floor 3"
        />
        <Input
          id="description"
          label={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Our daily coffee round"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading || !name} size="lg" className="w-full mt-2">
          {loading ? 'Creating...' : t('create')}
        </Button>
      </form>
    </div>
  )
}
