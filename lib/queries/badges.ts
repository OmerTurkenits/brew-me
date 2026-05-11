import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Client = SupabaseClient<Database>

export async function getAllBadges(client: Client) {
  const { data, error } = await client.from('badges').select('*')
  if (error) throw error
  return data
}

export async function getUserBadges(client: Client, userId: string) {
  const { data, error } = await client
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function getBadgeByKey(client: Client, key: string) {
  const { data, error } = await client
    .from('badges')
    .select('*')
    .eq('key', key)
    .single()
  if (error) throw error
  return data
}
