import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getGroupDetail } from '@/lib/queries/groups'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { formatOrderOneLiner } from '@/lib/utils/formatOrder'
import { MILK_KEY } from '@/lib/utils/coffeeKeys'
import AddMemberForm from './AddMemberForm'

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const [t, tc] = await Promise.all([getTranslations('groups'), getTranslations('coffee')])

  const group = await getGroupDetail(supabase, groupId).catch(() => null)
  if (!group) redirect('/dashboard/groups')

  // Fetch members with their profiles and active coffee profiles
  const { data: members } = await supabase
    .from('group_members')
    .select('*, profiles(*)')
    .eq('group_id', groupId)

  const memberProfiles = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data: cp } = await supabase
        .from('coffee_profiles')
        .select('*')
        .eq('user_id', m.user_id)
        .eq('is_active', true)
        .maybeSingle()
      return { ...m, activeProfile: cp }
    })
  )

  const isAdmin = memberProfiles.some(
    (m) => m.user_id === user.id && m.role === 'admin'
  )

  // Most popular milk stat
  const milks = memberProfiles
    .map((m) => m.activeProfile?.milk_type)
    .filter(Boolean) as string[]
  const popularMilk = milks.length
    ? Object.entries(
        milks.reduce((acc, m) => ({ ...acc, [m]: (acc[m] ?? 0) + 1 }), {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0][0]
    : null

  return (
    <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/groups" className="text-muted-text text-sm">← Back</Link>
        <div>
          <h1 className="text-xl font-medium text-brand-dark">{group.name}</h1>
          {group.description && <p className="text-xs text-muted-text">{group.description}</p>}
        </div>
      </div>

      {/* Stats chips */}
      <div className="flex gap-2 flex-wrap">
        <span className="bg-warm-tint border border-border-line rounded-full px-3 py-1 text-xs text-section-label">
          {memberProfiles.length} {t('members')}
        </span>
        {popularMilk && (
          <span className="bg-warm-tint border border-border-line rounded-full px-3 py-1 text-xs text-section-label">
            {t('popularMilk')}: {tc(MILK_KEY[popularMilk] as any ?? popularMilk)}
          </span>
        )}
      </div>

      {/* Member list */}
      <div className="bg-white border border-border-line rounded-[14px] overflow-hidden">
        {memberProfiles.map((m) => {
          const profile = (m as any).profiles
          return (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-border-line last:border-0">
              <Avatar userId={m.user_id} name={profile?.name ?? '?'} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-brand-dark">{profile?.name}</p>
                  {m.role === 'admin' && (
                    <span className="text-xs text-brand-accent">{t('admin')}</span>
                  )}
                </div>
                <p className="text-xs text-muted-text truncate">
                  {m.activeProfile ? formatOrderOneLiner(m.activeProfile, (key) => tc(key as any)) : 'No active profile'}
                </p>
              </div>
              <Link href={`/u/${m.user_id}`} className="text-muted-text text-sm">→</Link>
            </div>
          )
        })}
      </div>

      {isAdmin && <AddMemberForm groupId={groupId} />}

      {/* Full order summary button */}
      <Link
        href={`/dashboard/groups/${groupId}/summary`}
        className="w-full bg-brand-dark text-amber-text rounded-[14px] p-4 text-center font-medium text-sm"
      >
        {t('viewSummary')}
      </Link>
    </div>
  )
}
