import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Client = SupabaseClient<Database>
type Insert = Database['public']['Tables']['coffee_profiles']['Insert']
type Update = Database['public']['Tables']['coffee_profiles']['Update']

export async function getCoffeeProfiles(client: Client, userId: string) {
  const { data, error } = await client
    .from('coffee_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getActiveCoffeeProfile(client: Client, userId: string) {
  const { data, error } = await client
    .from('coffee_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createCoffeeProfile(client: Client, profile: Insert) {
  const { data, error } = await client
    .from('coffee_profiles')
    .insert(profile)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCoffeeProfile(
  client: Client,
  id: string,
  updates: Update
) {
  const { data, error } = await client
    .from('coffee_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCoffeeProfile(client: Client, id: string) {
  const { error } = await client
    .from('coffee_profiles')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function setActiveProfile(
  client: Client,
  userId: string,
  profileId: string
) {
  // Deactivate all, then activate the selected one
  await client
    .from('coffee_profiles')
    .update({ is_active: false })
    .eq('user_id', userId)

  const { data, error } = await client
    .from('coffee_profiles')
    .update({ is_active: true })
    .eq('id', profileId)
    .select()
    .single()
  if (error) throw error
  return data
}
