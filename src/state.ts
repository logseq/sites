import { hookstate, useHookstate } from '@hookstate/core'
import { IProInfo } from './types'

// @ts-ignore
import os from 'platform-detect/os.mjs'
import { useEffect } from 'react'

export const checkSmBreakPoint = () => {
  return (
    visualViewport?.width ||
    document.documentElement.clientWidth
  ) <= 640
}

const appState = hookstate({
  os, sm: checkSmBreakPoint(),
  userInfo: { pending: false, username: null, signInUserSession: null, attributes: null, signOut: () => {} },
  releases: {
    fetching: false,
    downloads: {}, // macos -> download url
    fetchErr: null,
  },
  discord: {
    guild: null,
    approximate_member_count: 0,
    approximate_presence_count: 0,
  },
})

const proState =
  hookstate<{ info: IProInfo } | null>(null)

const releasesEndpoint = 'https://api.github.com/repos/logseq/logseq/releases'
const discordEndpoint = 'https://discord.com/api/v9/invites/VNfUaTtdFb?with_counts=true&with_expiration=true'
const fileSyncEndpoint = 'https://api.logseq.com/file-sync'

export function useReleasesState () {
  const state = useAppState()

  useEffect(() => {
    if (!state.releases.fetching.get()) {
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
        state.releases.fetchErr.set(e)
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
      hookProState.set(null)
    } else {
      requestProInfo()
        .then((info) => proState.set({ info }))
        .catch(e => console.error('[Request ProState] ', e))
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
