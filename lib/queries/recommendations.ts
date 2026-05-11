import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Client = SupabaseClient<Database>

export async function getSentRecommendations(client: Client, userId: string) {
  const { data, error } = await client
    .from('recommendations')
    .select('*, profiles!recommendations_to_user_id_fkey(*)')
    .eq('from_user_id', userId)
    .order('sent_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getReceivedRecommendations(client: Client, userId: string) {
  const { data, error } = await client
    .from('recommendations')
    .select('*, profiles!recommendations_from_user_id_fkey(*)')
    .eq('to_user_id', userId)
    .order('sent_at', { ascending: false })
  if (error) throw error
  return data
}

export async function sendRecommendation(
  client: Client,
  rec: { from_user_id: string; to_user_id: string; drink_name: string; note?: string }
) {
  const { data, error } = await client
    .from('recommendations')
    .insert(rec)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRecommendation(client: Client, id: string) {
  const { error } = await client.from('recommendations').delete().eq('id', id)
  if (error) throw error
}
