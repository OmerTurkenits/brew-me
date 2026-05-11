import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getUserBadges, getAllBadges } from '@/lib/queries/badges'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BadgePill from '@/components/ui/Badge'

export default async function BadgesPage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const [earned, all] = await Promise.all([
    getUserBadges(supabase, user.id).catch(() => []),
    getAllBadges(supabase).catch(() => []),
  ])

  const earnedIds = new Set(earned.map((ub) => ub.badge_id))

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/me" className="text-muted-text text-sm">← Back</Link>
        <h1 className="text-xl font-medium text-brand-dark">My badges</h1>
      </div>

      {earned.length > 0 && (
        <div>
          <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-3">Earned</p>
          <div className="flex flex-wrap gap-2">
            {earned.map((ub) => {
              const b = (ub as any).badges
              return b ? <BadgePill key={ub.id} icon={b.icon} label={b.label_en} /> : null
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-3">All badges</p>
        <div className="flex flex-col gap-3">
          {all.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-3 p-4 rounded-[14px] border ${
                earnedIds.has(badge.id)
                  ? 'border-amber-border bg-warm-tint'
                  : 'border-border-line bg-white opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-sm font-medium text-brand-dark">{badge.label_en}</p>
                {earnedIds.has(badge.id) && (
                  <p className="text-xs text-brand-accent">Earned ✓</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
