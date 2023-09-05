import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { DownloadsPage } from './pages/Downloads'
import { Headbar } from './components/Headbar'
import {
  checkSmBreakPoint,
  useAppState, useAuthUserInfoState,
  useDiscordState, useModalsState,
  useReleasesState,
} from './state'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ProPage } from './pages/Pro'
import { UserEntryPage } from './pages/User'
import { Modal } from './components/Modal'
import { createPortal } from 'react-dom'
import { scrollToTop } from './components/utils'

export function App () {
  const appState = useAppState()
  const modalsState = useModalsState()
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

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
          <Route path={'/login'} element={<UserEntryPage/>}></Route>
          <Route path={'/account'} element={<UserEntryPage/>}></Route>
        </Routes>

        {/*  modals */}
        {modalsState.modals.get({ noproxy: true })?.map(m => {
          return (
            createPortal(
              <Modal id={m.id} key={m.id}
                     visible={m.visible}
                     destroy={() => modalsState.remove(m.id)}
                     {...m.props}
              >
                {m.content}</Modal>,
              document.body))
        })}
      </main>
    </div>
  )
}
