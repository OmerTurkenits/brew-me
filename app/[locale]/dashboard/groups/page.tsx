import { createClient, getSessionUser } from '@/lib/supabase/server'
import { getMyGroups } from '@/lib/queries/groups'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function GroupsPage() {
  const [supabase, user] = await Promise.all([createClient(), getSessionUser()])
  if (!user) redirect('/sign-in')

  const t = await getTranslations('groups')
  const myGroups = await getMyGroups(supabase, user.id).catch(() => [])

  return (
    <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-brand-dark">{t('title')}</h1>
        <Link
          href="/dashboard/groups/new"
          className="w-8 h-8 rounded-full bg-brand-dark text-amber-text flex items-center justify-center text-xl leading-none"
        >
          +
        </Link>
      </div>

      {myGroups.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="text-5xl">👥</span>
          <p className="text-muted-text text-sm">{t('noGroups')}</p>
          <Link
            href="/dashboard/groups/new"
            className="text-brand-accent font-medium text-sm"
          >
            {t('createFirst')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myGroups.map((gm) => {
            const group = (gm as any).groups
            if (!group) return null
            return (
              <Link
                key={group.id}
                href={`/dashboard/groups/${group.id}`}
                className="bg-white border border-border-line rounded-[14px] p-4 flex items-center justify-between hover:border-amber-border transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-brand-dark">{group.name}</p>
                    {gm.role === 'admin' && (
                      <span className="text-xs bg-brand-accent/10 text-brand-accent px-1.5 py-0.5 rounded-full">
                        {t('admin')}
                      </span>
                    )}
                  </div>
                  {group.description && (
                    <p className="text-xs text-muted-text mt-0.5">{group.description}</p>
                  )}
                </div>
                <span className="text-muted-text">→</span>
              </Link>
            )
          })}
        </div>
      )}

      <Link
        href="/dashboard/groups/new"
        className="border-2 border-dashed border-border-line rounded-[14px] p-4 flex items-center justify-center gap-2 text-muted-text text-sm hover:border-brand-accent hover:text-brand-accent transition-colors"
      >
        <span>+</span>
        <span>{t('createNew')}</span>
      </Link>
    </div>
  )
}
