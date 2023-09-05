import { IAppUserInfo, IProState, useLemonState, useProState } from '../../state'
import { useEffect, useState } from 'react'
import { ArrowsClockwise, SignOut } from 'phosphor-react'
import { Button } from '../../components/Buttons'
import toast from 'react-hot-toast'
import Avatar from 'react-avatar'
import cx from 'classnames'
import { LSSpinner } from '../../components/Icons'
import { none, useHookstate } from '@hookstate/core'

function LemonPaymentButton ({ userId, username, email }: Partial<{
  userId: string,
  username: string,
  email: string
}>) {
  const { proState, loadProInfo } = useProState()
  const lemon = useLemonState()

  useEffect(() => {
    // https://docs.lemonsqueezy.com/help/lemonjs/handling-events
    window.createLemonSqueezy()

    setTimeout(() => {
      window.LemonSqueezy.Setup({
        eventHandler: (e: any) => {
          if (e?.event === 'Checkout.Success') {
            proState.lastSubscription.set(e?.data)

            // TODO: wait for server state
            setTimeout(() => {
              loadProInfo().catch(null)
              window.LemonSqueezy.Url.Close()
              // lemon.loadSubscriptions().catch(null)
            }, 200)

            toast.success(
              <div className={'p-4'}>
                <h1 className={'text-xl'}>😀 Thanks for your support!</h1>
              </div>
            )
          }
        }
      })
    }, 2000)
  }, [])

  if (proState.value.info?.ProUser === true) return

  return (
    <a
      href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09
      ?embed=1&media=0&checkout[email]=${encodeURIComponent(email)}&checkout[custom][user_uuid]=${userId}`}
      className="lemonsqueezy-button inline-block py-3 px-4 bg-indigo-600 text-lg rounded-xl mb-8">
      Subscribe Logseq Pro
    </a>
  )
}

function LemoOrders () {
  const lemon = useLemonState()
  const { proState, loadProInfo } = useProState()
  const lemonSubscriptions = lemon.getSubscriptions() as any

  useEffect(() => {
    lemon.loadSubscriptions().catch(null)
  }, [])

  let pane = <></>

  // if (lemon.subscriptionsFetching) {
  //   pane = <div className={'py-4 text-2xl flex'}><LSSpinner/></div>
  // } else {
    pane = (<ul className={'py-2'}>
      {Array.isArray(lemonSubscriptions) && lemonSubscriptions.map(it => {

        // https://docs.lemonsqueezy.com/api/subscriptions
        const {
          status, status_formatted, subtotal_formatted, created_at, user_email,
          user_name, customer_id, product_name, variant_name
        } = it.attributes

        const isActive = status === 'active'
        const isPaused = status === 'paused'
        const isUnpaid = status === 'unpaid'
        const isCancelled = status === 'cancelled'
        const isExpired = status === 'expired'
        const isBindSubscription = proState.value.info?.LemonSubscriptionID?.LogseqPro == it.id

        return (
          <li key={it.id} className={
            cx('text-lg py-3 flex items-center mb-4 rounded-xl p-6 relative',
              isCancelled ? 'bg-red-600/50 opacity-50' :
                (isBindSubscription ? 'bg-green-800/80' : 'bg-pro-800')
            )}>
            <div className={'w-full'}>
              <small>#{it.id} {user_name} & {user_email} & ^{customer_id}</small>
              <br/>
              <span
                className={'font-bold text-pro-300 pr-1'}>{product_name} / {variant_name} </span>
              {subtotal_formatted} / <code>{status_formatted}</code> / {new Date(created_at).toLocaleDateString()}
            </div>

            {isActive &&
              (<Button
                className={'absolute top-1 right-1 !bg-transparent'}
                onClick={async () => {
                  try {
                    proState.cancelingSubscriptions.merge({ [it.id]: true })
                    await lemon.cancelSubscription(it.id)
                    await lemon.loadSubscriptions()

                    if (isBindSubscription) {
                      await loadProInfo()
                    }
                  } finally {
                    proState.cancelingSubscriptions.merge({ [it.id]: none })
                  }
                }}>

                {proState.cancelingSubscriptions.value?.[it.id] ?
                  <LSSpinner size={10} color={'#ffffff'}/> : 'Cancel'}
              </Button>)}
          </li>)
      })}
    </ul>)
  // }

  return (
    <div className={'py-4 w-full'}>
      <div className={'flex justify-between'}>
        <h1 className={'text-4xl'}>Subscription orders:</h1>
        <Button onClick={() => lemon.loadSubscriptions()} className={
          cx('!bg-transparent', (lemon.subscriptionsFetching && 'animate-spin'))}>
          <ArrowsClockwise weight={'duotone'} size={24} className={'opacity-70'}/>
        </Button>
      </div>

      {pane}
    </div>
  )
}

function UserInfoContent (props: { proState: IProState }) {
  const proState = props.proState.get()

  if (proState.infoFetching != undefined) {
    if (proState.infoFetching) {
      return <b className={'flex space-x-6 items-center'}>
        <LSSpinner/>
        <span>Loading Pro Info ...</span>
      </b>
    } else {
      return (typeof proState.info?.ProUser === 'boolean') ?
        (<>
          <b>&lt;Pro Status&gt; {proState.info?.ProUser ? 'True' : 'False'} </b> <br/>
          <b>&lt;Group&gt; {proState.info.UserGroups?.toString()}</b> <br/>

          <hr className={'my-4'}/>

          <b>&lt;FileSyncGraph limit&gt; {proState.info.FileSyncGraphCountLimit}</b> <br/>
          <b>&lt;FileSyncStorage limit&gt; {proState.info.FileSyncStorageLimit / 1024 / 1024 / 1024} G</b> <br/>
          <b>&lt;FileSyncExpired At&gt; {(new Date(proState.info.FileSyncExpireAt)).toLocaleDateString()}</b> <br/>

          <hr className={'my-4'}/>

          <b>&lt;Lemon Status&gt; {proState.info.LemonStatus.LogseqPro}</b> <br/>
          <b>&lt;Lemon Renew At&gt; {proState.info.LemonRenewsAt.LogseqPro}</b> <br/>
          <b>&lt;Lemon Subscription ID&gt; {proState.info.LemonSubscriptionID.LogseqPro}</b> <br/>
          <b>&lt;Lemon Ends At&gt; {proState.info.LemonEndsAt.LogseqPro}</b> <br/>
        </>) :
        (<b>Not a Pro user!</b>)
    }
  }
}

export function AccountPane ({ userInfo }: {
  userInfo: IAppUserInfo
}) {
  const [active, setActive] = useState<string>()
  const { proState, loadProInfo } = useProState()
  let activeContent = <></>

  switch (active) {
    case 'payments':
      activeContent = (
        <LemoOrders/>
      )
      break
    default:
      activeContent = (
        <div className={'py-2'}>
          {!proState.value.infoFetching &&
            (<div className={'flex justify-between items-center'}>
              <LemonPaymentButton
                email={userInfo.attributes?.email}
                userId={userInfo.attributes?.sub}
                username={userInfo.username}
              />
            </div>)}

          {((typeof proState.value.info?.ProUser === 'boolean') ||
              (proState.value.infoFetching)) &&
            <div className={'!bg-logseq-500 !rounded-2xl !px-8 !py-6 relative'}>
              <UserInfoContent proState={proState}/>

              <a className={'absolute top-4 right-4 cursor-pointer active:opacity-50 opacity-80 hover:opacity-100'}
                 onClick={loadProInfo}
              >
                <ArrowsClockwise size={18} weight={'bold'}/>
              </a>
            </div>
          }
        </div>
      )
  }

  return (
    <div className={'app-account pt-10'}>
      {/* head */}
      <div className={'hd flex justify-between items-center border-b pb-6 px-2 border-b-logseq-500'}>
        <h1 className={'font-semibold text-2xl'}>
          Logseq Account
        </h1>
        <Button
          className={'!text-lg bg-orange-700 scale-75 !px-6 !rounded-3xl'}
          disabled={userInfo.pending}
          rightIcon={userInfo.pending ? <LSSpinner/> : <SignOut/>}
          onClick={() => {
            userInfo.signOut()
          }}
        >
          Sign out
        </Button>
      </div>

      {/* main */}
      <div className={'bd flex space-x-6 relative pt-14'}>
        <div className="l px-12 w-[320px]">
          <h1>
            <Avatar
              size={'90px'}
              round={true}
              name={userInfo.username}
              email={userInfo.attributes?.email}/>
          </h1>
          <h2 className={'text-2xl px-2 pt-4 pb-1 font-medium'}>
            {userInfo.username}
            {proState.value.info?.ProUser && (<sup className={'opacity-30 pl-1.5 scale-75'}>PRO+</sup>)}
          </h2>
          <h3 className={'px-2 text-sm text-gray-500'}>
            {userInfo.attributes?.email}
          </h3>

          <ul className={'pt-12 text-gray-500 text-md flex flex-col space-y-2'}>
            <li onClick={() => setActive(undefined)}>
              <a className={cx('item cursor-pointer select-none', !active && 'active font-bold text-orange-500')}>
                Personal information
              </a>
            </li>

            <li onClick={() => setActive('payments')}>
              <a
                className={cx('item cursor-pointer select-none', active === 'payments' && 'active font-bold text-orange-500')}>
                Billing & Payments
              </a>
            </li>
          </ul>
        </div>

        <div className="r flex flex-col space-y-6 w-full">
          {activeContent}
        </div>
      </div>
    </div>
  )
}