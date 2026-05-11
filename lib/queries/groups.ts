import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type Client = SupabaseClient<Database>

export async function getMyGroups(client: Client, userId: string) {
  const { data, error } = await client
    .from('group_members')
    .select('role, groups(*)')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function getGroupDetail(client: Client, groupId: string) {
  const { data, error } = await client
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()
  if (error) throw error
  return data
}

export async function getGroupMembers(client: Client, groupId: string) {
  const { data, error } = await client
    .from('group_members')
    .select('*, profiles(*), coffee_profiles!inner(*)')
    .eq('group_id', groupId)
    .eq('coffee_profiles.is_active', true)
  if (error) {
    // Fallback without coffee_profiles join
    const { data: d2, error: e2 } = await client
      .from('group_members')
      .select('*, profiles(*)')
      .eq('group_id', groupId)
    if (e2) throw e2
    return d2
  }
  return data
}

export async function createGroup(
  client: Client,
  group: { name: string; description?: string; created_by: string }
) {
  const { data, error } = await client
    .from('groups')
    .insert(group)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addGroupMember(
  client: Client,
  groupId: string,
  userId: string
) {
  const { data, error } = await client
    .from('group_members')
    .insert({ group_id: groupId, user_id: userId, role: 'member' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeGroupMember(
  client: Client,
  groupId: string,
  userId: string
) {
  const { error } = await client
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
  if (error) throw error
}
