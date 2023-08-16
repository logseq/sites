import './index.css'
import { LoginPane } from './Login'
import { authConfig, useAppState, useProState } from '../../state'
import { Button } from '../../components/Buttons'
import { SignOut, Spinner } from 'phosphor-react'
import { Card } from '@aws-amplify/ui-react'
import { setupAuthConfigure } from './amplify'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

// setup amplify configures
setupAuthConfigure(authConfig)

function LemonPaymentButton ({ username, email }: Partial<{ username: string, email: string }>) {
  const proState = useProState()

  useEffect(() => {
    // https://docs.lemonsqueezy.com/help/lemonjs/handling-events
    window.createLemonSqueezy()

    setTimeout(() => {
      window.LemonSqueezy.Setup({
        eventHandler: (e: any) => {
          if (e?.event === 'Checkout.Success') {
            proState.lastOrder.set(e?.data)
            window.LemonSqueezy.Url.Close()
            toast.success(
              <div>
                <h1 className={'text-xl'}>😀 Thanks for your support!</h1>
              </div>
            )
          }
        }
      })
    }, 2000)
  }, [])

  if (!email) return

  return (
    <a
      href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09?embed=1&media=0&checkout[email]=${email}&custom[username]=${username}`}
      className="lemonsqueezy-button inline-block py-3 px-4 bg-indigo-600 text-lg rounded-lg">
      Buy Logseq Pro
    </a>
  )
}

function UserEntryPage () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get({ noproxy: true })
  const proState = useProState().get()

  let pane = <></>

  if (userInfo.username) {
    let proInfo = <></>

    if (proState.fetching != undefined) {
      if (proState.fetching) {
        proInfo = <b className={'flex space-x-6 items-center'}><Spinner size={22}/> Loading Pro Info ...</b>
      } else {
        proInfo = proState.info?.ProUser ?
          (<>
            <b>&lt;Status&gt; Pro user! </b> <br/>
            <b>&lt;Group&gt; {proState.info.UserGroups?.toString()}</b> <br/>
            <b>&lt;Graph limit&gt; {proState.info.GraphCountLimit}</b> <br/>
            <b>&lt;Storage limit&gt; {proState.info.StorageLimit / 1024 / 1024 / 1024} G</b> <br/>
            <b>&lt;Expired At&gt; {(new Date(proState.info.ExpireTime * 1000)).toLocaleDateString()}</b> <br/>
          </>) :
          (<b>Not a Pro user!</b>)
      }
    }

    pane = (
      <div>
        <div className={'flex space-x-6 items-center justify-around'}>
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

          <LemonPaymentButton
            email={userInfo.attributes?.email}
            username={userInfo.username}
          />

          <Card className={'!bg-orange-600'}>
            {proInfo}
          </Card>
        </div>
        <pre className={'whitespace-pre w-56'}>
          {JSON.stringify(userInfo.attributes, null, 2)}
        </pre>
        <pre className={'w-[50vw] overflow-hidden whitespace-pre-wrap py-8'}>
          <b>IDToken: </b> <br/>
          <code>{userInfo.signInUserSession.idToken?.jwtToken}</code>
        </pre>

        {proState.lastOrder &&
          <textarea className={'min-h-[600px] w-full p-2 border bg-transparent'}
                    value={JSON.stringify(proState.lastOrder, null, 2)}
          ></textarea>}
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
  UserEntryPage,
}