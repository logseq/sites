import { hookstate, useHookstate } from '@hookstate/core'
import { devtools } from '@hookstate/devtools'
import { IProInfo } from './types'

// @ts-ignore
import os from 'platform-detect/os.mjs'
import { useEffect } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import toast from 'react-hot-toast'

export const authConfig = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_dtagLnju8',
  userPoolWebClientId: '69cs1lgme7p8kbgld8n5kseii6',
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
  os, sm: checkSmBreakPoint(),
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
}, devtools({ key: 'app' }))

const proState =
  hookstate<Partial<{ info: IProInfo, fetching: boolean, lastOrder: {}, e: Error }>>({}, devtools({ key: 'pro' }))

const releasesEndpoint = 'https://api.github.com/repos/logseq/logseq/releases'
const discordEndpoint = 'https://discord.com/api/v9/invites/VNfUaTtdFb?with_counts=true&with_expiration=true'
const fileSyncEndpoint = 'https://api.logseq.com/file-sync'

export function useAuthUserInfoState () {
  const { user }: any = useAuthenticator(
    ({ route, signOut, user }) => [route, signOut, user]
  )

  useEffect(() => {
    if (user?.username && user?.pool) {
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
      toast.success(
        `Hi, ${user.username} !`, {
          position: 'top-center'
        })
    }
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
      hookProState.fetching?.set(true)
      requestProInfo()
        .then((info) => hookProState.info.set(info))
        .catch(e => {
          console.error('[Request ProState] ', e)
          hookProState.e.set(e)
        })
        .finally(() => hookProState.fetching?.set(false))
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

// @ts-ignore
window.__appState = appState
// @ts-ignore
window.__proState = proState
