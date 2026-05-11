import { createClient, getSessionUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import PrivacyToggle from './PrivacyToggle'

export default async function PrivacyPage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const t = await getTranslations('privacy')

  const { data: settings } = await supabase
    .from('privacy_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: blocks } = await supabase
    .from('privacy_blocks')
    .select('*, profiles!privacy_blocks_blocked_user_id_fkey(*)')
    .eq('owner_user_id', user.id)

  return (
    <div className="px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/me" className="text-muted-text text-sm">← Back</Link>
        <h1 className="text-xl font-medium text-brand-dark">{t('title')}</h1>
      </div>

      <div className="bg-white border border-border-line rounded-[14px] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-brand-dark text-sm">{t('publicByDefault')}</p>
            <p className="text-xs text-muted-text mt-0.5">
              {settings?.public_by_default ? t('publicDesc') : t('privateDesc')}
            </p>
          </div>
          <PrivacyToggle
            userId={user.id}
            initialValue={settings?.public_by_default ?? true}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-section-label uppercase tracking-wide mb-3">{t('blockedUsers')}</p>
        {!blocks || blocks.length === 0 ? (
          <p className="text-sm text-muted-text">{t('noBlocked')}</p>
        ) : (
          <div className="flex flex-col bg-white border border-border-line rounded-[14px] overflow-hidden">
            {blocks.map((b) => {
              const profile = (b as any).profiles
              return (
                <div key={b.id} className="flex items-center justify-between px-4 py-3 border-b border-border-line last:border-0">
                  <span className="text-sm text-brand-dark">{profile?.name ?? 'Unknown'}</span>
                  <UnblockButton blockId={b.id} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function UnblockButton({ blockId }: { blockId: string }) {
  return (
    <form action={async () => {
      'use server'
      const { createClient: createServerClientFn } = await import('@/lib/supabase/server')
      const supabase = await createServerClientFn()
      await supabase.from('privacy_blocks').delete().eq('id', blockId)
    }}>
      <button type="submit" className="text-xs text-red-400 hover:underline">Unblock</button>
    </form>
  )
}
