import { hookstate, useHookstate } from '@hookstate/core'
import { IProInfo } from './types'

// @ts-ignore
import os from 'platform-detect/os.mjs'
import { ReactElement, useEffect } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import toast from 'react-hot-toast'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'

export const isDev = process.env.NODE_ENV !== 'production'
export const authConfig = isDev ?
  {
    region: 'us-east-2',
    userPoolId: 'us-east-2_kAqZcxIeM',
    userPoolWebClientId: '1qi1uijg8b6ra70nejvbptis0q',
    oauthProviders: []
  } : {
    // TODO: production
    // region: 'us-east-1',
    // userPoolId: 'us-east-1_dtagLnju8',
    // userPoolWebClientId: '69cs1lgme7p8kbgld8n5kseii6',
    // oauthProviders: []
    region: 'us-east-2',
    userPoolId: 'us-east-2_kAqZcxIeM',
    userPoolWebClientId: '1qi1uijg8b6ra70nejvbptis0q',
    oauthProviders: []
  }

function getAuthValueFromStorage (key: string) {
  const prefix = `CognitoIdentityServiceProvider.${authConfig.userPoolWebClientId}`
  const authUser = localStorage.getItem(`${prefix}.${authConfig.userPoolWebClientId}.LastAuthUser`)
  if (!authUser) return

  return localStorage.getItem(`${prefix}.${authConfig.userPoolWebClientId}.${authUser}.${key?.trim()}`)
}

export const checkSmBreakPoint = () => {
  return (
    visualViewport?.width ||
    document.documentElement.clientWidth
  ) <= 640
}

const appState = hookstate({
  isDev, os, sm: checkSmBreakPoint(),
  userInfo: {
    pending: false,
    username: null,
    signInUserSession: null,
    attributes: null,
    signOut: () => {}
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
})

const proState =
  hookstate<Partial<{
    info: IProInfo,
    infoFetching: boolean,
    orders: {},
    ordersFetching: boolean,
    lastOrder: {},
    e: Error
  }>>({})

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
const lemoEndpoint = isDev ? 'http://127.0.0.1:8787/lemon/api' : 'https://plugins.logseq.io/lemon/api'

export function applyLoginUser (
  user: any, t: {
    navigate: NavigateFunction,
    routeLocation: Location,
    inComponent?: boolean
  }
) {
  if (user?.username && user?.pool && user?.signInUserSession) {
    appState.userInfo.set({
      signOut: async () => {
        console.time()
        appState.userInfo.pending.set(true)
        await Auth.signOut()
        appState.userInfo.pending.set(false)
        console.timeEnd()
        appState.userInfo.set({} as any)
      }, username: user.username,
      signInUserSession: user.signInUserSession,
      attributes: user.attributes,
      pending: false
    })

    // TODO: debug
    if (!t.inComponent) {
      toast.success(
        `Hi, ${user.username} !`, {
          position: 'top-center'
        })
    }

    if (t.routeLocation.pathname === '/login') {
      t.navigate('/account')
    }
  }

}

export function useAuthUserInfoState () {
  const { user }: any = useAuthenticator(({ user }) => [user])
  const routeLocation = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    applyLoginUser(user, { navigate, routeLocation })
  }, [user?.username])
}

export function useReleasesState () {
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

export function useDiscordState () {
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

export function useAppState () {
  return useHookstate(appState)
}

export function useProState () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get()
  const hookProState = useHookstate(proState)

  // @ts-ignore
  const idToken = userInfo.signInUserSession?.idToken?.jwtToken

  useEffect(() => {
    if (!idToken) {
      hookProState.set({})
    } else if (!hookProState.get().info) {
      hookProState.infoFetching?.set(true)
      requestProInfo()
        .then((info) => hookProState.info.set(info))
        .catch(e => {
          console.error('[Request ProState] ', e)
          hookProState.e.set(e)
        })
        .finally(() => hookProState.infoFetching?.set(false))
    }

    async function requestProInfo () {
      const resp = await fetch(`${fileSyncEndpoint}/user_info`,
        { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } })

      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }

      return resp.json()
    }
  }, [idToken])

  return hookProState
}

export function useLemonState () {
  const userInfo = useAppState().userInfo.get()
  const proState = useProState()

  return {
    get: () => proState.orders.value,
    fetching: proState.ordersFetching.get(),
    load: async (type: string = 'orders') => {
      try {
        // @ts-ignore
        const idToken = userInfo.signInUserSession?.idToken?.jwtToken
        proState.ordersFetching.set(true)
        const res = await fetch(`${lemoEndpoint}/${type}`,
          { method: 'GET', headers: { Authorization: `Bearer ${idToken}` } })
        const json = await res.json()

        proState[type].set(json)
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        proState.ordersFetching.set(false)
      }
    }
  }
}

export function useModalsState () {
  const hookModalsState = useHookstate(modalsState)

  const ret = {
    modals: hookModalsState.modals,
    remove: (id: number) => hookModalsState.modals.set((v) => {
      const i = v.findIndex((m) => m.id === id)
      if (i != -1) v.splice(i, 1)
      return v
    }),
    create: (contentFn: (destroy: () => void) => ReactElement, props?: any) => {
      const id = Date.now()
      const idx = hookModalsState.modals.length
      hookModalsState.modals.set((v) => {
        v.push({ id, visible: false, content: contentFn(() => ret.remove(id)), props })
        return v
      })

      return {
        show: () => hookModalsState.modals[idx].visible.set(true),
        hide: () => hookModalsState.modals[idx].visible.set(false),
        destroy: () => ret.remove(id)
      }
    }
  }

  return ret
}

// @ts-ignore
window.__appState = appState
// @ts-ignore
window.__proState = proState
