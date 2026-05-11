import { getAvatarColor, getInitials } from '@/lib/utils/avatarColor'

interface Props {
  userId: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  avatarUrl?: string | null
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

export default function Avatar({ userId, name, size = 'md', avatarUrl }: Props) {
  const color = getAvatarColor(userId)
  const initials = getInitials(name)

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-medium flex-shrink-0`}
    >
      {initials}
    </div>
  )
}
