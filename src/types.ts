export type IProInfo = {
  FileSyncExpireAt: number
  FileSyncGraphCountLimit: {
    'current': number,
    'free': number,
    'pro': number,
  },
  FileSyncStorageLimit: {
    'current': number,
    'currentFormatted': string,
    'free': number,
    'freeFormatted': string,
    'pro': number,
    'proFormatted': string
  },
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