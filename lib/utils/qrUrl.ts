export function getProfileUrl(userId: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? 'https://brewme.app')
  return `${base}/u/${userId}`
}
