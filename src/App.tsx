import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { DownloadsPage } from './pages/Downloads'
import { Headbar } from './components/Headbar'
import {
  checkSmBreakPoint,
  useAppState, useAuthUserInfoState,
  useDiscordState,
  useReleasesState,
} from './state'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ProPage } from './pages/Pro'
import { UserEntryPage } from './pages/User'

export function App () {
  const appState = useAppState()

  // load global state
  useAuthUserInfoState()
  useReleasesState()
  useDiscordState()

  useEffect(() => {
    const resizeHandler = () => {
      appState.sm.set(
        checkSmBreakPoint(),
      )
    }

    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <div id="app" className={'flex justify-center'}>
      <Toaster
        position={'top-right'}
        toastOptions={{
          className: 'app-toaster',
        }}
      />

      <main className="app-container">
        <Headbar/>

        <Routes>
          <Route path={'/'} element={<HomePage/>}/>
          <Route path={'/downloads'} element={<DownloadsPage/>}/>
          <Route path={'/pro'} element={<ProPage/>}></Route>
          <Route path={'/users'} element={<UserEntryPage/>}></Route>
        </Routes>
      </main>
    </div>
  )
}
