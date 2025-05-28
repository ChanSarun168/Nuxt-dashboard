import type { AvatarProps } from '@nuxt/ui'

export type EventState = 'special' | 'no-special'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface Event {
  _id: string
  name: string
  date: string
  isSpecial: boolean
  time: string
  description: string
  thumbnail: string
  admin_id: string
  isdeleted: boolean
}


export interface EventGroup {
  _id: string
  date?: string
  isdeleted?: boolean
  event_info: Event[]
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
