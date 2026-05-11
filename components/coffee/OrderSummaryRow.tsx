import type { CoffeeProfile } from '@/lib/supabase/types'
import { formatOrderOneLiner } from '@/lib/utils/formatOrder'
import Avatar from '@/components/ui/Avatar'

interface Props {
  userId: string
  name: string
  avatarUrl?: string | null
  profile: CoffeeProfile | null
}

export default function OrderSummaryRow({ userId, name, avatarUrl, profile }: Props) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-line last:border-0">
      <Avatar userId={userId} name={name} avatarUrl={avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-dark">{name}</p>
        <p className="text-xs text-muted-text truncate">
          {profile ? formatOrderOneLiner(profile) : 'No active profile'}
        </p>
      </div>
    </div>
  )
}
