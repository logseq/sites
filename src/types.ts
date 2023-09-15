export type IProInfo = {
  FileSyncExpireAt: number
  FileSyncGraphCountLimit: number
  FileSyncStorageLimit: number
  ProUser: boolean
  UserGroups: 'alpha-tester' | string

  FreeTrialEndsAt: { ['LogseqPro']: string }
  LemonSubscriptionID: { ['LogseqPro']: string }
  LemonCustomerID: { ['LogseqPro']: string }
  LemonEndsAt: { ['LogseqPro']: string }
  LemonRenewsAt: { ['LogseqPro']: string }
  LemonStatus: { ['LogseqPro']: string }
}

declare global {
  interface Window {
    LemonSqueezy: any
    createLemonSqueezy: () => void
  }
}