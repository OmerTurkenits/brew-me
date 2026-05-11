import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getReceivedRecommendations, getSentRecommendations } from '@/lib/queries/recommendations'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'

export default async function RecommendationsPage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const [received, sent] = await Promise.all([
    getReceivedRecommendations(supabase, user.id).catch(() => []),
    getSentRecommendations(supabase, user.id).catch(() => []),
  ])

  function RecCard({ rec, type }: { rec: any; type: 'received' | 'sent' }) {
    const other = type === 'received' ? rec.profiles : rec.profiles
    return (
      <div className="bg-white border border-border-line rounded-[14px] p-4">
        <div className="flex items-center gap-3 mb-2">
          {other && <Avatar userId={type === 'received' ? rec.from_user_id : rec.to_user_id} name={other.name} size="sm" />}
          <div>
            <p className="text-xs text-muted-text">{type === 'received' ? 'From' : 'To'} {other?.name}</p>
            <p className="font-medium text-brand-dark text-sm">{rec.drink_name}</p>
          </div>
        </div>
        {rec.note && <p className="text-sm text-muted-text italic">"{rec.note}"</p>}
      </div>
    )
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/me" className="text-muted-text text-sm">← Back</Link>
        <h1 className="text-xl font-medium text-brand-dark">Recommendations</h1>
      </div>

      {received.length > 0 && (
        <div>
          <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-3">Received</p>
          <div className="flex flex-col gap-3">
            {received.map((r) => <RecCard key={r.id} rec={r} type="received" />)}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div>
          <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-3">Sent</p>
          <div className="flex flex-col gap-3">
            {sent.map((r) => <RecCard key={r.id} rec={r} type="sent" />)}
          </div>
        </div>
      )}

      {received.length === 0 && sent.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl">💌</span>
          <p className="text-muted-text text-sm mt-3">No recommendations yet.</p>
          <p className="text-xs text-muted-text mt-1">Find someone and recommend them a drink!</p>
        </div>
      )}
    </div>
  )
}
