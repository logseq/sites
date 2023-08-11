import './index.css'
import { setupAuthConfigure } from './amplify'
import { LoginPane } from './Login'
import { useAppState, useProState } from '../../state'
import { Button } from '../../components/Buttons'
import { SignOut, Spinner, Star } from 'phosphor-react'
import { Card } from '@aws-amplify/ui-react'

// setup amplify configures
setupAuthConfigure({
  region: 'us-east-1',
  userPoolId: 'us-east-1_dtagLnju8',
  userPoolWebClientId: '69cs1lgme7p8kbgld8n5kseii6',
  oauthProviders: []
})

function UserEntryPage () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get({ noproxy: true })
  const proState = useProState().get()

  let pane = <></>

  if (userInfo.username) {
    pane = (
      <div>
        <p className={'flex space-x-6 items-center justify-around'}>
          <h1 className={'text-4xl'}>Hi, {userInfo.username}!</h1>
          <Button
            className={'text-lg'}
            disabled={userInfo.pending}
            rightIcon={userInfo.pending ? <Spinner/> : <SignOut/>}
            onClick={() => {
              userInfo.signOut()
            }}
          >
            Sign out
          </Button>

          <Card className={'!bg-orange-600'}>
            {proState?.info.ProUser ?
              (<>
                <b>&lt;Status&gt; Pro user! </b> <br/>
                <b>&lt;Group&gt; {proState.info.UserGroups?.toString()}</b> <br/>
                <b>&lt;Graph limit&gt; {proState.info.GraphCountLimit}</b> <br/>
                <b>&lt;Storage limit&gt; {proState.info.StorageLimit / 1024 / 1024 / 1024} G</b> <br/>
                <b>&lt;Expired At&gt; {(new Date(proState.info.ExpireTime * 1000)).toLocaleDateString()}</b> <br/>
              </>) :
              (<b>Not a Pro user!</b>)}
          </Card>
        </p>
        <pre className={'whitespace-pre w-56'}>
          {JSON.stringify(userInfo.attributes, null, 2)}
        </pre>
        <pre className={'w-[50vw] overflow-hidden whitespace-pre-wrap'}>
          {JSON.stringify(userInfo.signInUserSession, null, 2)}
        </pre>
      </div>
    )
  } else {
    pane = <LoginPane/>
  }

  return (
    <div className={'app-page user-entry page-inner'}>
      {pane}
    </div>
  )
}

export {
  UserEntryPage
}