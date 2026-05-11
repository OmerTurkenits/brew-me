'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SignUpPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Update profile name (trigger sets it from email prefix, we override with real name)
    if (data.user) {
      await supabase.from('profiles').update({ name }).eq('id', data.user.id)
    }

    setLoading(false)
    router.push('/onboarding/quiz')
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-medium text-brand-dark mb-1">☕ BrewMe</h1>
        <p className="text-muted-text text-sm">{t('tagline')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          type="text"
          label={t('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Alex"
        />
        <Input
          id="email"
          type="email"
          label={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          type="password"
          label={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
          {loading ? 'Creating account...' : t('getStarted')}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-text">
        {t('hasAccount')}{' '}
        <Link href="/sign-in" className="text-brand-accent font-medium">
          {t('signIn')}
        </Link>
      </p>
    </div>
  )
}
