'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export default function SignOutButton() {
  const t = useTranslations('auth')
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <Button variant="secondary" onClick={handleSignOut} className="w-full">
      {t('signOut')}
    </Button>
  )
}
