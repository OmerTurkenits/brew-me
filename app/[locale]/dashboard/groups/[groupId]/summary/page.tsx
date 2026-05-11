import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getGroupDetail } from '@/lib/queries/groups'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { formatOrderOneLiner } from '@/lib/utils/formatOrder'
import { DRINK_KEY, MILK_KEY, TEMP_KEY, SUGAR_KEY } from '@/lib/utils/coffeeKeys'
import SummaryTabs, { type AggregatedOrder, type IndividualOrder } from './SummaryTabs'

export default async function GroupSummaryPage({
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

  const { data: members } = await supabase
    .from('group_members')
    .select('*, profiles(*)')
    .eq('group_id', groupId)

  const memberOrders = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data: cp } = await supabase
        .from('coffee_profiles')
        .select('*')
        .eq('user_id', m.user_id)
        .eq('is_active', true)
        .maybeSingle()
      return { member: m, profile: (m as any).profiles, activeProfile: cp }
    })
  )

  const tval = (keyMap: Record<string, string>, value: string) =>
    tc((keyMap[value] ?? value) as any)

  // Build individual list
  const individual: IndividualOrder[] = memberOrders.map(({ member, profile, activeProfile }) => ({
    id: member.id,
    name: profile?.name ?? t('unknown'),
    oneLiner: activeProfile ? formatOrderOneLiner(activeProfile, (key) => tc(key as any)) : '',
    drink: activeProfile ? tval(DRINK_KEY, activeProfile.drink_type) : '',
    milk: activeProfile ? tval(MILK_KEY, activeProfile.milk_type) : '',
    temp: activeProfile ? tval(TEMP_KEY, activeProfile.temperature) : '',
    sugar: activeProfile ? `${tval(SUGAR_KEY, activeProfile.sugar_level)} ${tc('sugar' as any)}` : '',
    special: activeProfile?.special_instructions ?? null,
  }))

  // Build aggregate list — group by full order signature
  const aggMap = new Map<string, AggregatedOrder>()
  for (const { profile, activeProfile } of memberOrders) {
    if (!activeProfile) continue
    const key = [
      activeProfile.drink_type,
      activeProfile.size,
      activeProfile.temperature,
      activeProfile.milk_type,
      activeProfile.sugar_level,
      activeProfile.special_instructions ?? '',
    ].join('|')

    if (!aggMap.has(key)) {
      aggMap.set(key, {
        label: formatOrderOneLiner(activeProfile, (k) => tc(k as any)),
        count: 0,
        names: [],
        special: activeProfile.special_instructions ?? null,
      })
    }
    const entry = aggMap.get(key)!
    entry.count++
    entry.names.push(profile?.name ?? t('unknown'))
  }
  const aggregated: AggregatedOrder[] = [...aggMap.values()].sort((a, b) => b.count - a.count)

  return (
    <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/groups/${groupId}`} className="text-muted-text text-sm">←</Link>
        <div>
          <h1 className="text-xl font-medium text-brand-dark">{t('orderSummary')}</h1>
          <p className="text-sm text-muted-text">{group.name}</p>
        </div>
      </div>

      <SummaryTabs aggregated={aggregated} individual={individual} />
    </div>
  )
}
