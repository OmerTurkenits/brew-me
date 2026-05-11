import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries/profiles'
import { getCoffeeProfiles } from '@/lib/queries/coffeeProfiles'
import { getUserBadges } from '@/lib/queries/badges'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import BadgePill from '@/components/ui/Badge'
import ManageProfilesClient from './ManageProfilesClient'
import SignOutButton from './SignOutButton'
import EditUsernameForm from './EditUsernameForm'
import LanguageToggle from '@/components/ui/LanguageToggle'

export default async function MePage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const t = await getTranslations('me')

  const [profile, profiles, badges] = await Promise.all([
    getProfile(supabase, user.id).catch(() => null),
    getCoffeeProfiles(supabase, user.id).catch(() => []),
    getUserBadges(supabase, user.id).catch(() => []),
  ])

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar userId={user.id} name={profile?.name ?? 'Me'} size="lg" />
        <div>
          <h1 className="text-xl font-medium text-brand-dark">{profile?.name}</h1>
          <EditUsernameForm userId={user.id} initialName={profile?.name ?? ''} />
          <p className="text-sm text-muted-text">{user.email}</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-2">{t('myBadges')}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((ub) => {
              const b = (ub as any).badges
              return b ? <BadgePill key={ub.id} icon={b.icon} label={b.label_en} /> : null
            })}
          </div>
        </div>
      )}

      {/* Coffee profiles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-section-label uppercase tracking-wide">{t('myProfiles')}</p>
        </div>
        <ManageProfilesClient profiles={profiles} userId={user.id} />
      </div>

      {/* Links */}
      <div className="flex flex-col bg-white border border-border-line rounded-[14px] overflow-hidden">
        {[
          { href: '/dashboard/me/badges', label: t('myBadges'), emoji: '🏅' },
          { href: '/dashboard/me/recommendations', label: t('recommendations'), emoji: '💌' },
          { href: '/dashboard/me/privacy', label: t('privacy'), emoji: '🔒' },
        ].map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-border-line last:border-0 hover:bg-warm-tint transition-colors"
          >
            <span>{emoji}</span>
            <span className="flex-1 text-sm text-brand-dark">{label}</span>
            <span className="text-muted-text">→</span>
          </Link>
        ))}
        <div className="border-t border-border-line">
          <LanguageToggle />
        </div>
      </div>

      <SignOutButton />
    </div>
  )
}
