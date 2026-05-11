import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries/profiles'
import { getActiveCoffeeProfile, getCoffeeProfiles } from '@/lib/queries/coffeeProfiles'
import { getUserBadges } from '@/lib/queries/badges'
import { notFound } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import BadgePill from '@/components/ui/Badge'
import ProfileCard from '@/components/coffee/ProfileCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>
}): Promise<Metadata> {
  const { userId } = await params
  const supabase = await createClient()
  const profile = await getProfile(supabase, userId).catch(() => null)
  return {
    title: profile ? `${profile.name}'s coffee order — BrewMe` : 'BrewMe',
    description: `See how ${profile?.name ?? 'this person'} takes their coffee.`,
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const supabase = await createClient()

  const profile = await getProfile(supabase, userId).catch(() => null)
  if (!profile) notFound()

  const [activeProfile, allProfiles, badges] = await Promise.all([
    getActiveCoffeeProfile(supabase, userId).catch(() => null),
    getCoffeeProfiles(supabase, userId).catch(() => []),
    getUserBadges(supabase, userId).catch(() => []),
  ])

  // Quick stats
  const milkCounts = allProfiles.reduce(
    (acc, p) => ({ ...acc, [p.milk_type]: (acc[p.milk_type] ?? 0) + 1 }),
    {} as Record<string, number>
  )
  const favouriteMilk = Object.entries(milkCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const tempCounts = allProfiles.reduce(
    (acc, p) => ({ ...acc, [p.temperature]: (acc[p.temperature] ?? 0) + 1 }),
    {} as Record<string, number>
  )
  const favTemp = Object.entries(tempCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  return (
    <div className="min-h-screen bg-warm-surface px-5 py-8">
      <div className="max-w-sm mx-auto flex flex-col gap-6">
        {/* Home button */}
        <div className="flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-line rounded-full text-sm font-medium text-brand-dark hover:border-amber-border hover:bg-warm-tint transition-colors"
          >
            <span>☕</span>
            <span>BrewMe</span>
          </a>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar userId={userId} name={profile.name} size="lg" />
          <div>
            <h1 className="text-2xl font-medium text-brand-dark">{profile.name}</h1>
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {badges.map((ub) => {
                const b = (ub as any).badges
                return b ? <BadgePill key={ub.id} icon={b.icon} label={b.label_en} size="sm" /> : null
              })}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="bg-warm-tint border border-border-line rounded-full px-3 py-1 text-xs text-section-label">
            {allProfiles.length} profile{allProfiles.length !== 1 ? 's' : ''}
          </span>
          {favouriteMilk && (
            <span className="bg-warm-tint border border-border-line rounded-full px-3 py-1 text-xs text-section-label">
              🥛 {favouriteMilk}
            </span>
          )}
          {favTemp && (
            <span className="bg-warm-tint border border-border-line rounded-full px-3 py-1 text-xs text-section-label">
              🌡 {favTemp}
            </span>
          )}
        </div>

        {/* Active order */}
        {activeProfile ? (
          <div>
            <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-2">Active order</p>
            <ProfileCard profile={activeProfile} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-text text-sm">No active coffee profile.</p>
          </div>
        )}

      </div>
    </div>
  )
}
