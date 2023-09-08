import './index.css'
import { LoginContent } from './Login'
import { authConfig, useAppState } from '../../state'
import { setupAuthConfigure } from './amplify'
import { LandingFooterNav } from '../Landing'
import { AccountContent } from './Account'
import { useLocation } from 'react-router-dom'

// setup amplify configures
setupAuthConfigure(authConfig)

function UserEntryPage () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get({ noproxy: true })
  const location = useLocation()
  const isLoginPath = location.pathname === '/login'

  let content = <></>

  if (userInfo?.username && !isLoginPath) {
    content = <AccountContent userInfo={userInfo}/>
  } else {
    content = <LoginContent/>
  }

  return (
    <div className={'app-page user-entry'}>
      <div className={'page-inner px-20 min-h-[90vh]'}>
        {content}
      </div>

      {/* global footer */}
      <div className="page-inner-full-wrap b relative">
        <div className="page-inner footer-nav">
          <div className="page-inner">
            <LandingFooterNav/>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  UserEntryPage,
}
