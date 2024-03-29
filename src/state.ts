import { hookstate, none, StateMethods, useHookstate } from '@hookstate/core'
import { IProInfo } from './types'

// @ts-ignore
import os from 'platform-detect/os.mjs'
import { ReactElement, useEffect } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import toast from 'react-hot-toast'
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import camelcase from 'camelcase'
import { bytesFormat, isDateValid } from './components/utils'

// export const isDev = process.env.NODE_ENV !== 'production'
export const isDev = false // TODO: DEBUG
export const authConfig = isDev ?
  {
    region: 'us-east-2',
    userPoolId: 'us-east-2_kAqZcxIeM',
    userPoolWebClientId: '1qi1uijg8b6ra70nejvbptis0q',
    oauthProviders: [],
  } : {
    region: 'us-east-1',
    userPoolId: 'us-east-1_dtagLnju8',
    userPoolWebClientId: '69cs1lgme7p8kbgld8n5kseii6',
    oauthProviders: []
  }

function getAuthValueFromStorage(key: string) {
  const prefix = `CognitoIdentityServiceProvider.${authConfig.userPoolWebClientId}`
  const authUser = localStorage.getItem(
    `${prefix}.${authConfig.userPoolWebClientId}.LastAuthUser`)
  if (!authUser) return

  return localStorage.getItem(
    `${prefix}.${authConfig.userPoolWebClientId}.${authUser}.${key?.trim()}`)
}

export const checkSmBreakPoint = () => {
  return (
    visualViewport?.width ||
    document.documentElement.clientWidth
  ) <= 640
}

const defaultAppState = {
  isDev, os, isMobile: os.android || os.ios,
  sm: checkSmBreakPoint(),
  userInfo: {
    pending: false,
    username: null,
    signInUserSession: null,
    attributes: null,
    signOut: () => Promise.resolve(),
  },
  releases: {
    fetching: false,
    downloads: {}, // macos -> download url
    e: false,
  },
  discord: {
    guild: null,
    approximate_member_count: 0,
    approximate_presence_count: 0,
  },
}

const appState = hookstate(defaultAppState)

export type IAppState = typeof appState
export type IAppUserInfoState = typeof appState.userInfo
export type IAppUserInfo = typeof defaultAppState.userInfo

const proState =
  hookstate<Partial<{
    info: IProInfo | null,
    infoFetching: boolean,
    orders: {},
    lastSubscription: {},
    subscriptionsFetching: boolean,
    actionPendingSubscriptions: {},
    lemonListSubscriptions: {},
    subscriptionRelatedInfo: {}
    e: Error
  }>>({})

export type IProState = typeof proState

const modalsState =
  hookstate<Partial<{
    modals: Array<{
      id: number,
      visible: boolean,
      content: ReactElement,
      props?: Record<string, any>
    }>
  }>>({ modals: [] })

const releasesEndpoint = 'https://api.github.com/repos/logseq/logseq/releases'
const discordEndpoint = 'https://discord.com/api/v9/invites/VNfUaTtdFb?with_counts=true&with_expiration=true'
const fileSyncEndpoint = 'https://api-dev.logseq.com/file-sync'
const logseqEndpoint = isDev
  ? 'https://api-dev.logseq.com/logseq'
  : 'https://api.logseq.com/logseq'

export const lemonProductEndpoint = isDev
  ? 'https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09'
  : 'https://logseq.lemonsqueezy.com/checkout/buy/4828e0c2-e189-4102-9a90-c7101e53d525'

let appliedLogin = false

export function applyLoginUser(
  user: any, t: {
    navigate: NavigateFunction,
    routeLocation: Location,
    inComponent?: boolean
  },
) {
  // for logout
  if (appliedLogin && !user && t.routeLocation.pathname.startsWith('/account') &&
    t.routeLocation.pathname !== '/login') {
    t.navigate('/login')
    return
  }

  if (user?.username && user?.pool && user?.signInUserSession) {
    appState.userInfo.set({
      signOut: async () => {
        console.time()
        appState.userInfo.pending.set(true)
        await Auth.signOut()
        appState.userInfo.pending.set(false)
        proState.set({})
        console.timeEnd()
        appState.userInfo.set({} as any)
      }, username: user.username,
      signInUserSession: user.signInUserSession,
      attributes: user.attributes,
      pending: false,
    })

    // TODO: debug
    if (!t.inComponent) {
      toast.success(
        `Hi, ${user.username} !`, {
          position: 'top-center',
        })
    }

    if (t.routeLocation.pathname === '/login') {
      t.navigate('/account', { replace: true })
    }
  }

  appliedLogin = true
}

export function useFetchAPI<T = StateMethods<any, any>>(attachedState?: T) {
  const userInfo = useAppState().userInfo.get()

  async function loadAPI(
    type: string,
    setState: StateMethods<any, any> | boolean = false,
    opts: Partial<{ init: RequestInit, notShowErrMsg: boolean }> = {}
  ) {
    try {
      // @ts-ignore
      const idToken = userInfo.signInUserSession?.idToken?.jwtToken
      const res = await fetch(`${logseqEndpoint}/${type}`,
        Object.assign(opts.init || {}, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`, ...(opts.init?.headers || {}),
          },
        }))

      const json = await res.json()

      if (setState) {
        if (setState === true) {
          attachedState?.[camelcase(type)].set(json)
        } else {
          setState?.[camelcase(type)].set(json)
        }
      }

      return json
    } catch (e: any) {
      !opts.notShowErrMsg && toast.error(e.message)
      return e
    }
  }

  return {
    loadAPI
  }
}

export function useAuthUserInfoState() {
  const { user }: any = useAuthenticator(({ user }) => [user])
  const routeLocation = useLocation()
  const navigate = useNavigate()
  const { proState, loadProInfo } = useProState()
  const userInfoValue = appState.userInfo.get()

  // @ts-ignore
  const idToken = userInfoValue.signInUserSession?.idToken?.jwtToken

  useEffect(() => {
    if (!idToken) {
      proState.set({})
    } else if (!proState.get().info) {
      loadProInfo().catch(null)
    }
  }, [idToken])

  useEffect(() => {
    applyLoginUser(user, { navigate, routeLocation })
  }, [user?.username])
}

export function useReleasesState() {
  const state = useAppState()

  useEffect(() => {
    if (!state.releases.fetching.value) {
      state.releases.fetching.set(true)

      fetch(releasesEndpoint).then(res => res.json()).then((json) => {
        // TODO: parse downloads
        let latestRelease = null

        if (json && Array.isArray(json)) {
          json.some(it => {
            if (it.hasOwnProperty('tag_name') &&
              it.tag_name?.toLowerCase() !== 'nightly' &&
              Array.isArray(it.assets)
            ) {
              const platformMappings = {
                'macos-x64': (it: string) => it.includes('x64') &&
                  it.endsWith('.dmg'),
                'macos-arm64': (it: string) => it.includes('arm64') &&
                  it.endsWith('.dmg'),
                'android': (it: string) => it.endsWith('.apk'),
                'linux': (it: string) => it.endsWith('.AppImage'),
                'windows': (it: string) => it.endsWith('.exe'),
              }

              latestRelease = it.assets.reduce((a: any, b: any) => {
                Object.entries(platformMappings).some(([label, validator]) => {
                  if (validator(b.name)) {
                    a[label] = b
                    return true
                  }
                })

                return a
              }, {})

              return true
            }
          })

          state.releases.downloads.set(latestRelease as any)
        }

        if (!latestRelease) {
          throw new Error('Parse latest release failed!')
        }
      }).catch(e => {
        state.releases.e.set(e)
      }).finally(() => {
        state.releases.fetching.set(false)
      })
    }
  }, [])

  return state.releases
}

export function useDiscordState() {
  const state = useAppState()

  useEffect(() => {
    fetch(discordEndpoint).then(res => res.json()).then((json: any) => {
      if (json && json.guild) {
        state.discord.set(json as any)
      }
    }).catch(e => {
      console.debug(
        '[Fetch Discord Err]', e,
      )
    })
  }, [])

  return state.discord
}

export function useAppState() {
  return useHookstate(appState)
}

export function useProState() {
  const appState = useAppState()
  const userInfo = appState.value.userInfo
  const hookProState = useHookstate(proState)
  const proStateValue = hookProState.get({ noproxy: true })
  const proFreeTrialEndsAt = proStateValue?.info?.FreeTrialEndsAt?.LogseqPro
  const inTrial = proFreeTrialEndsAt &&
    (new Date(proFreeTrialEndsAt).getTime()) > Date.now() &&
    (proStateValue.info?.LemonStatus?.LogseqPro !== 'active')

  // @ts-ignore
  const idToken = userInfo.signInUserSession?.idToken?.jwtToken

  async function loadProInfo() {
    try {
      hookProState.infoFetching?.set(true)

      const resp = await fetch(`${logseqEndpoint}/user_info`,
        { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } })

      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }

      const info: IProInfo = await resp.json()

      // normalize info
      info.FileSyncStorageLimit.currentFormatted = bytesFormat(info.FileSyncStorageLimit?.current)
      info.FileSyncStorageLimit.proFormatted = bytesFormat(info.FileSyncStorageLimit?.pro)
      info.FileSyncStorageLimit.freeFormatted = bytesFormat(info.FileSyncStorageLimit?.free)

      hookProState.info.set(info)
    } catch (e: any) {
      console.error('[Request ProState] ', e)
      hookProState.e.set(e)
    } finally {
      hookProState.infoFetching?.set(false)
    }
  }

  return {
    proState: hookProState,
    proStateValue, inTrial,
    loadProInfo,
  }
}

export function useLemonState() {
  const { proState } = useProState()
  const { loadAPI } = useFetchAPI(proState)

  return {
    getSubscriptions: () => proState.lemonListSubscriptions.get(
      { noproxy: true }),
    subscriptionsFetching: proState.subscriptionsFetching.get(),
    loadSubscriptions: async () => {
      proState.subscriptionsFetching.set(true)
      return loadAPI('lemon_list_subscriptions', true).finally(() =>
        proState.subscriptionsFetching.set(false))
    },
    cancelSubscription: async (subId: string) => {
      await loadAPI(
        'lemon_cancel_subscription', false,
        { init: { body: JSON.stringify({ 'subscription-id': subId }) } })
    },
    pauseSubscription: async (subId: string, resumesAt?: string) => {
      const body = { 'subscription-id': parseInt(subId), 'mode': 'free' }
      if (resumesAt) {
        if (!isDateValid(resumesAt))
          throw new Error(`Invalid resumes at date input! #${resumesAt}`)

        body['resumes-at'] = new Date(resumesAt).toISOString()
      }
      await loadAPI(
        'lemon_pause_subscription', false,
        { init: { body: JSON.stringify(body) } },
      )
    },
    unpauseSubscription: async (subId: string) => {
      const body = { 'subscription-id': parseInt(subId) }
      await loadAPI(
        'lemon_unpause_subscription', false,
        { init: { body: JSON.stringify(body) } },
      )
    },
    startFreeTrial: async () => {
      if (proState.value?.info?.ProUser) {
        return
      }

      await loadAPI(
        'start_free_trial', false,
        { init: { body: JSON.stringify({ project: 'LogseqPro' }) } },
      )
    },
    getSubscriptionRelatedInfo: async (
      subId: string,
      resources: Array<'order' | 'subscription-invoices'> = ['subscription-invoices'],
    ) => {
      const body = {
        'subscription-id': parseInt(subId),
        'related-resources': resources,
      }

      try {
        proState.subscriptionRelatedInfo.merge({ [subId]: { pending: true } })

        await new Promise(resolve => setTimeout(resolve, 5000))

        const ret = await loadAPI(
          'lemon_get_subscription_related_resources', false,
          { init: { body: JSON.stringify(body) } },
        )

        for (let k in ret) {
          if (typeof ret[k]?.body === 'string') {
            try {
              ret[k].body = JSON.parse(ret[k].body)
            } catch (e) {
              console.error(e)
            }
          }
        }
        proState.subscriptionRelatedInfo.merge({ [subId]: ret })

        return ret
      } catch (e: any) {
        console.error(e)
        proState.subscriptionRelatedInfo.merge({ [subId]: none })
      }
    },
  }
}

export const createModalFacade = (ms: typeof modalsState) => {
  const m = ({
    modals: ms.modals,
    topmost: () => {
      if (!m.modals?.length) return
      let it: (typeof m.modals.value)[number]
      // @ts-ignore
      while (it = m.modals.get({ noproxy: true }).pop()) {
        if (it.visible) {
          return it
        }
      }
    },
    remove: (id: number) => ms.modals.set((v) => {
      const i = v.findIndex((m) => m.id === id)
      if (i != -1) v.splice(i, 1)
      return v
    }),
    create: (contentFn: (destroy: () => void) => ReactElement, props?: any) => {
      const id = Date.now()
      const idx = ms.modals.length
      ms.modals.set((v) => {
        v.push(
          { id, visible: false, content: contentFn(() => m.remove(id)), props })
        return v
      })

      return {
        id,
        show: () => ms.modals[idx].visible.set(true),
        hide: () => ms.modals[idx].visible.set(false),
        destroy: () => m.remove(id),
      }
    },
  })
  return m
}

export const modalFacade = createModalFacade(modalsState)

export function useModalsState() {
  const hookModalsState = useHookstate(modalsState)
  return createModalFacade(hookModalsState)
}

// @ts-ignore
window.__appState = appState
// @ts-ignore
window.__proState = proState
// @ts-ignore
window.__modalFacade = modalFacade
