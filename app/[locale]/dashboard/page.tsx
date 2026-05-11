import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries/profiles'
import { getActiveCoffeeProfile, getCoffeeProfiles } from '@/lib/queries/coffeeProfiles'
import { getUserBadges } from '@/lib/queries/badges'
import ProfileCard from '@/components/coffee/ProfileCard'
import BadgePill from '@/components/ui/Badge'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const t = await getTranslations('home')

  const [profile, activeProfile, allProfiles, badges] = await Promise.all([
    getProfile(supabase, user.id).catch(() => null),
    getActiveCoffeeProfile(supabase, user.id).catch(() => null),
    getCoffeeProfiles(supabase, user.id).catch(() => []),
    getUserBadges(supabase, user.id).catch(() => []),
  ])

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-text text-sm">{t('welcome')}</p>
          <h1 className="text-2xl font-medium text-brand-dark">{profile?.name ?? t('coffeeLover')}</h1>
        </div>
        <span className="text-3xl">☕</span>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.slice(0, 3).map((ub) => {
            const b = (ub as any).badges
            return b ? <BadgePill key={ub.id} icon={b.icon} label={b.label_en} size="sm" /> : null
          })}
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-2">{t('activeOrder')}</p>
        {activeProfile ? (
          <ProfileCard profile={activeProfile} />
        ) : (
          <div className="bg-white border border-dashed border-border-line rounded-[14px] p-6 text-center">
            <p className="text-muted-text text-sm mb-3">{t('noProfile')}</p>
            <Link
              href="/dashboard/me"
              className="text-sm font-medium text-brand-accent"
            >
              {t('createProfile')}
            </Link>
          </div>
        )}
      </div>

      {allProfiles.length > 1 && (
        <p className="text-xs text-muted-text text-center">
          {t('profilesTotal', { count: allProfiles.length })} ·{' '}
          <Link href="/dashboard/me" className="text-brand-accent">{t('manage')}</Link>
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/qr"
          className="bg-brand-dark text-amber-text rounded-[14px] p-4 flex flex-col gap-2"
        >
          <span className="text-2xl">📱</span>
          <span className="text-sm font-medium">{t('myQrCard')}</span>
        </Link>
        <Link
          href="/dashboard/find"
          className="bg-white border border-border-line rounded-[14px] p-4 flex flex-col gap-2"
        >
          <span className="text-2xl">🔍</span>
          <span className="text-sm font-medium text-brand-dark">{t('findPeople')}</span>
        </Link>
      </div>
    </div>
  )
}
