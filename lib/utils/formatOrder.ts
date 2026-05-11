import type { CoffeeProfile } from '@/lib/supabase/types'
import { DRINK_KEY, MILK_KEY, SUGAR_KEY, SIZE_KEY, TEMP_KEY } from './coffeeKeys'

type T = (key: string) => string
const id: T = (k) => k

export function formatOrderOneLiner(profile: CoffeeProfile, t: T = id): string {
  const parts: string[] = [
    t(DRINK_KEY[profile.drink_type] ?? profile.drink_type),
    t(SIZE_KEY[profile.size] ?? profile.size),
    t(TEMP_KEY[profile.temperature] ?? profile.temperature),
  ]
  if (profile.milk_type && profile.milk_type !== 'none') {
    parts.push(t(MILK_KEY[profile.milk_type] ?? profile.milk_type))
  }
  if (profile.sugar_level && profile.sugar_level !== 'none') {
    parts.push(`${t(SUGAR_KEY[profile.sugar_level] ?? profile.sugar_level)} ${t('sugar')}`)
  }
  return parts.join(', ')
}

export function formatShotsLabel(shots: number): string {
  return shots === 1 ? '1 shot' : `${shots} shots`
}
