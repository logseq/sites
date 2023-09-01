import './index.css'
import { LoginPane } from './Login'
import { authConfig, useAppState } from '../../state'
import { setupAuthConfigure } from './amplify'
import { LandingFooterNav } from '../Landing'
import { AccountPane } from './Account'

// setup amplify configures
setupAuthConfigure(authConfig)

function UserEntryPage () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get({ noproxy: true })

  let pane = <></>

  if (userInfo?.username) {
    pane = <AccountPane userInfo={userInfo}/>
  } else {
    pane = <LoginPane/>
  }

  return (
    <div className={'app-page user-entry'}>
      <div className={'page-inner user-pane-content min-h-[90vh]'}>
        {pane}
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