import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { badge_key } = await request.json()
  if (!badge_key) {
    return NextResponse.json({ error: 'badge_key required' }, { status: 400 })
  }

  const { data: badge, error: badgeError } = await supabase
    .from('badges')
    .select('id')
    .eq('key', badge_key)
    .single()

  if (badgeError || !badge) {
    return NextResponse.json({ error: 'Badge not found' }, { status: 404 })
  }

  // Check if already earned
  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', user.id)
    .eq('badge_id', badge.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: 'Already earned' })
  }

  const { error } = await supabase
    .from('user_badges')
    .insert({ user_id: user.id, badge_id: badge.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
