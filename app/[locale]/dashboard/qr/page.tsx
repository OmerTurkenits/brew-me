import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries/profiles'
import { getCoffeeProfiles, getActiveCoffeeProfile } from '@/lib/queries/coffeeProfiles'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import QRDisplay from '@/components/qr/QRDisplay'
import ProfileSwitcher from '@/components/coffee/ProfileSwitcher'
import Link from 'next/link'

export default async function QRPage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const t = await getTranslations('qr')

  const [profile, profiles, activeProfile] = await Promise.all([
    getProfile(supabase, user.id).catch(() => null),
    getCoffeeProfiles(supabase, user.id).catch(() => []),
    getActiveCoffeeProfile(supabase, user.id).catch(() => null),
  ])

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto items-center">
      <h1 className="text-xl font-medium text-brand-dark self-start">{t('title')}</h1>

      {activeProfile ? (
        <QRDisplay
          userId={user.id}
          userName={profile?.name ?? 'Me'}
          profileName={activeProfile.name}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-text text-sm mb-4">Create a coffee profile first to generate your QR code.</p>
          <Link href="/dashboard/me" className="text-brand-accent font-medium text-sm">
            Create profile →
          </Link>
        </div>
      )}

      {profiles.length > 1 && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-muted-text mb-2">{t('activeProfile')}</p>
          <ProfileSwitcher
            profiles={profiles}
            activeId={activeProfile?.id ?? null}
            userId={user.id}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${activeProfile ? 'bg-green-400' : 'bg-muted-text'}`} />
        <span className="text-xs text-muted-text">{t('publicStatus')}</span>
        <Link href="/dashboard/me/privacy" className="text-xs text-brand-accent ml-2">
          {t('managePrivacy')}
        </Link>
      </div>
    </div>
  )
}
