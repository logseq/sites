import './index.css'
import { LoginPane } from './Login'
import { authConfig, useAppState, useLemonState, useProState } from '../../state'
import { Button } from '../../components/Buttons'
import { CircleWavyCheck, SignOut, Spinner } from 'phosphor-react'
import { Card } from '@aws-amplify/ui-react'
import { setupAuthConfigure } from './amplify'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

// setup amplify configures
setupAuthConfigure(authConfig)

function LemonPaymentButton ({ userId, username, email }: Partial<{ userId: string, username: string, email: string }>) {
  const proState = useProState()
  const lemon = useLemonState()

  useEffect(() => {
    // https://docs.lemonsqueezy.com/help/lemonjs/handling-events
    window.createLemonSqueezy()

    setTimeout(() => {
      window.LemonSqueezy.Setup({
        eventHandler: (e: any) => {
          if (e?.event === 'Checkout.Success') {
            proState.lastOrder.set(e?.data)
            window.LemonSqueezy.Url.Close()
            lemon.load().catch(null)

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
      href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09
      ?embed=1&media=0&checkout[email]=${email}&checkout[custom][user_uuid]=${userId}`}
      className="lemonsqueezy-button inline-block py-3 px-4 bg-indigo-600 text-lg rounded-lg">
      Buy Logseq Pro
    </a>
  )
}

function LemoOrders () {
  const lemon = useLemonState()
  const lemonState = lemon.get() as any

  useEffect(() => {
    lemon.load().catch(null)
  }, [])

  let pane = <></>

  if (lemon.fetching) {
    pane = <div className={'p-4 text-2xl flex'}><Spinner/> Loading...</div>
  } else {
    pane = (<ul className={'py-2'}>
      {lemonState && lemonState.data?.map(it => {
        const {
          status_formatted, subtotal_formatted, created_at, user_email,
          first_order_item, user_name, customer_id
        } = it.attributes
        return (
          <li key={it.id} className={'text-lg border-b border-dashed py-3 flex items-center'}>
            <span className={'px-4'}>
              <CircleWavyCheck size={30} weight={'duotone'} className={'opacity-70'}/>
            </span>
            <div>
              <small>#{it.id} {user_name} & {user_email} & ^{customer_id}</small>
              <br/>
              <span
                className={'font-bold text-pro-300 pr-1'}>{first_order_item.product_name} / {first_order_item.variant_name} </span>
              {subtotal_formatted} / <code>{status_formatted}</code> / {created_at}
            </div>

            <Button
              className={'text-sm mx-4'} onClick={() => lemon.load(`orders/${it.id}/subscriptions`)}
            >
              Load subscriptions ...
            </Button>
          </li>)
      })}
    </ul>)
  }

  return (
    <div className={'py-4'}>
      <h1 className={'text-4xl'}>Subscription orders:</h1>
      <p>
        <Button onClick={() => lemon.load()}>
          Load orders
        </Button>
      </p>

      {pane}
    </div>
  )
}

function UserEntryPage () {
  const appState = useAppState()
  const userInfo = appState.userInfo.get({ noproxy: true })
  const proState = useProState().get()

  let pane = <></>

  if (userInfo.username) {
    let proInfo = <></>

    if (proState.infoFetching != undefined) {
      if (proState.infoFetching) {
        proInfo = <b className={'flex space-x-6 items-center'}><Spinner size={22}/> Loading Pro Info ...</b>
      } else {
        proInfo = proState.info?.ProUser ?
          (<>
            <b>&lt;Status&gt; Pro user! </b> <br/>
            <b>&lt;Group&gt; {proState.info.UserGroups?.toString()}</b> <br/>
            <b>&lt;Graph limit&gt; {proState.info.GraphCountLimit}</b> <br/>
            <b>&lt;Storage limit&gt; {proState.info.StorageLimit / 1024 / 1024 / 1024} G</b> <br/>
            <b>&lt;Expired At&gt; {(new Date(proState.info.ExpireTime * 1000)).toLocaleDateString()}</b> <br/>
            <b>&lt;Lemon Status&gt; {proState.info.LemonStatus}</b> <br/>
            <b>&lt;Lemon Renew At&gt; {proState.info.LemonRenewsAt}</b> <br/>
            <b>&lt;Lemon Ends At&gt; {proState.info.LemonEndsAt}</b> <br/>
          </>) :
          (<b>Not a Pro user!</b>)
      }
    }

    pane = (
      <div>
        <div className={'flex space-x-6 items-center justify-around relative'}>
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
            userId={userInfo.attributes?.sub}
            username={userInfo.username}
          />

          <Card className={'!bg-blue-600'}>
            {proInfo}
          </Card>
        </div>
        <br/>
        <hr/>
        <pre className={'whitespace-pre w-56 p-4'}>
          {JSON.stringify(userInfo.attributes, null, 2)}
        </pre>
        <hr/>

        <LemoOrders/>
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