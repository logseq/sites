export type IProInfo = {
  ExpireTime: number
  GraphCountLimit: number
  LemonEndsAt: number
  LemonRenewsAt: number
  LemonStatus: string
  ProUser: boolean
  StorageLimit: number
  UserGroups: 'alpha-tester' | string
}

declare global {
  interface Window {
    LemonSqueezy: any
    createLemonSqueezy: () => void
  }
}