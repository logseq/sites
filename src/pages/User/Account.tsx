import {
  IAppUserInfo,
  IProState,
  useLemonState,
  useProState,
} from '../../state'
import { ReactElement, useEffect } from 'react'
import {
  ArrowsClockwise,
  Cardholder,
  IdentificationCard, LockOpen,
  SignOut,
} from 'phosphor-react'
import { Button } from '../../components/Buttons'
import toast from 'react-hot-toast'
import Avatar from 'react-avatar'
import cx from 'classnames'
import { LSSpinner } from '../../components/Icons'
import { none } from '@hookstate/core'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function LemonPaymentButton ({ userId, email }: Partial<{
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
              </div>,
            )
          }
        },
      })
    }, 2000)
  }, [])

  if (proState.value.info?.ProUser === true) return

  return (
    <a
      href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09
      ?embed=1&media=0&checkout[email]=${encodeURIComponent(
        email)}&checkout[custom][user_uuid]=${userId}`}
      className="lemonsqueezy-button inline-block py-3 px-4 bg-indigo-600 text-lg rounded-xl mb-8">
      Subscribe Logseq Pro
    </a>
  )
}

export function RowOfPaneContent (
  props: {
    label: string | ReactElement
    children: ReactElement
  },
) {
  return (
    <div className={'row flex'}>
      <div className="l w-[260px] px-2 opacity-80 text-sm">
        {props.label}
      </div>
      <div className="r w-full">
        {props.children}
      </div>
    </div>
  )
}

export function LemoSubscriptions () {
  const lemon = useLemonState()
  const { proState, loadProInfo } = useProState()
  const lemonSubscriptions = lemon.getSubscriptions() as any

  useEffect(() => {
    lemon.loadSubscriptions().catch(null)
  }, [])

  let pane = <></>

  pane = (<ul className={'py-2'}>
    {Array.isArray(lemonSubscriptions) && lemonSubscriptions.map(it => {

      // https://docs.lemonsqueezy.com/api/subscriptions
      const {
        status, status_formatted, subtotal_formatted, created_at, user_email,
        user_name, customer_id, product_name, variant_name, renews_at,
      } = it.attributes

      const isActive = status === 'active'
      const isPaused = status === 'paused'
      const isUnpaid = status === 'unpaid'
      const isCancelled = status === 'cancelled'
      const isExpired = status === 'expired'
      const isBindSubscription = proState.value.info?.LemonSubscriptionID?.LogseqPro ==
        it.id

      return (
        <li key={it.id} className={
          cx('text-lg py-3 flex items-center mb-4 rounded-xl p-6 relative',
            isCancelled ? 'bg-red-600/50 opacity-50' :
              (isBindSubscription ? 'bg-green-800/80' : 'bg-pro-800'),
          )}>
          <div className={'w-full'}>
            <small>#{it.id} {user_name} & {user_email} & ^{customer_id}</small>
            <br/>
            <span
              className={'font-bold text-pro-300 pr-1'}>{product_name} / {variant_name} </span>
            {subtotal_formatted} / <code>{status_formatted}</code> / {new Date(
            created_at).toLocaleDateString()}
            <strong className={'pl-2 font-medium'}>Renew
              at: {renews_at}</strong>
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

  return (
    <>
      <RowOfPaneContent label={'Current active'}>
        <div className={'w-full'}>
          <div className={'flex justify-between'}>
            <Button onClick={() => lemon.loadSubscriptions()} className={
              cx('!bg-transparent',
                (lemon.subscriptionsFetching && 'animate-spin'))}>
              <ArrowsClockwise weight={'duotone'} size={24}
                               className={'opacity-70'}/>
            </Button>
          </div>

          {pane}
        </div>
      </RowOfPaneContent>

      <RowOfPaneContent label={'Previous subscriptions'}>
        <h1>
          Cancelled
        </h1>
      </RowOfPaneContent>
    </>
  )
}

export function UserInfoContent (props: { proState: IProState }) {
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
          <b>&lt;Pro Status&gt; {proState.info?.ProUser ? 'True' : 'False'} </b>
          <br/>
          <b>&lt;Group&gt; {proState.info.UserGroups?.toString()}</b> <br/>

          <hr className={'my-4'}/>

          <b>&lt;FileSyncGraph
            limit&gt; {proState.info.FileSyncGraphCountLimit}</b> <br/>
          <b>&lt;FileSyncStorage limit&gt; {proState.info.FileSyncStorageLimit /
            1024 / 1024 / 1024} G</b> <br/>
          <b>&lt;FileSyncExpired At&gt; {(new Date(
            proState.info.FileSyncExpireAt)).toLocaleDateString()}</b> <br/>

          <hr className={'my-4'}/>

          <b>&lt;Lemon Status&gt; {proState.info.LemonStatus.LogseqPro}</b>
          <br/>
          <b>&lt;Lemon Renew At&gt; {proState.info.LemonRenewsAt.LogseqPro}</b>
          <br/>
          <b>&lt;Lemon Subscription
            ID&gt; {proState.info.LemonSubscriptionID.LogseqPro}</b> <br/>
          <b>&lt;Lemon Ends At&gt; {proState.info.LemonEndsAt.LogseqPro}</b>
          <br/>
        </>) :
        (<b>Not a Pro user!</b>)
    }
  }
}

export function AccountUserInfoPane ({ userInfo }: { userInfo: IAppUserInfo }) {
  const { proState, loadProInfo } = useProState()
  const proStateValue = proState.value

  return (
    <>
      <RowOfPaneContent label={'Current plan'}>
        <div className={'px-6'}>
          {!proStateValue.infoFetching &&
            (<div className={'flex justify-between items-center'}>
              <LemonPaymentButton
                email={userInfo.attributes?.email}
                userId={userInfo.attributes?.sub}
                username={userInfo.username}
              />
            </div>)}

          {proStateValue.e &&
            (<pre className={'bg-red-600/50 p-4 block rounded-lg'}>
        {proStateValue.e?.message}
              {proStateValue.e?.stack}
      </pre>)}

          {((typeof proState.value.info?.ProUser === 'boolean') ||
              (proStateValue.infoFetching)) &&
            <div className={'!bg-logseq-500 !rounded-2xl !px-8 !py-6 relative'}>
              <UserInfoContent proState={proState}/>

              <a
                className={'absolute top-4 right-4 cursor-pointer active:opacity-50 opacity-80 hover:opacity-100'}
                onClick={loadProInfo}
              >
                <ArrowsClockwise size={18} weight={'bold'}/>
              </a>
            </div>
          }
        </div>
      </RowOfPaneContent>
      <RowOfPaneContent label={'Profile'}>
        <div className="px-6 min-h-[60px]">
          <h1>
            {userInfo?.attributes?.email}
          </h1>
        </div>
      </RowOfPaneContent>
      <RowOfPaneContent label={'Authentication'}>
        <div className="px-6 flex items-center space-x-5">
          <Button
            className={'!py-2 !bg-logseq-700 !px-6'} leftIcon={<LockOpen/>}
            onClick={() => toast('😀 TODO: You clicked me :)',
              { position: 'top-center' })}
          >
            Change password
          </Button>

          <Button
            className={'!py-2 !bg-red-900 !px-6'}
            onClick={() => toast('❌ TODO: Are you sure?',
              { position: 'top-center' })}
          >
            Delete account
          </Button>
        </div>
      </RowOfPaneContent>
    </>)
}

export function AccountPane ({ userInfo }: {
  userInfo: IAppUserInfo
}) {
  const { proState } = useProState()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={'app-account pt-10 text-[#a4b5b6]'}>
      {/* head */}
      <div
        className={'hd flex justify-between items-center px-2'}>
        <div className={'flex items-center'}>
          <h1>
            <Avatar
              size={'50px'}
              color={'#08404f'}
              round={true}
              name={userInfo.username}
              email={userInfo.attributes?.email}/>
          </h1>
          <div className={'pl-4'}>
            <h2 className={'text-xl px-2 font-medium'}>
              <span className={'text-gray-200'}>{userInfo.username}</span>
              {proState.value.info?.ProUser &&
                (<sup className={'opacity-30 pl-1.5 scale-75'}>PRO+</sup>)}
            </h2>
            <h3 className={'px-2 text-sm text-gray-400/80'}>
              {userInfo.attributes?.email}
            </h3>
          </div>
        </div>
        <Button
          className={'!text-lg bg-logseq-600 scale-75 !px-6 !rounded-xl'}
          disabled={userInfo.pending}
          rightIcon={userInfo.pending ? <LSSpinner/> : <SignOut/>}
          onClick={() => {
            userInfo.signOut()
          }}
        >
          Sign out
        </Button>
      </div>

      {/* tabs */}
      <ul className={'pt-10 text-md flex items-center ' +
        'border-b border-b-logseq-500 space-x-4'}>
        <li onClick={() => navigate('/account')}>
          <a
            className={cx('block cursor-pointer select-none pb-2.5 px-4 \
              border-b tracking-wide border-b-transparent hover:text-gray-400',
              (location.pathname === '/account') &&
              'active font-bold !text-gray-200 !border-b-logseq-300')}>
            <span
              className={'inline-flex items-center pr-2 relative top-[3px]'}>
              <IdentificationCard size={17} weight={'bold'}/>
            </span>
            Account information
          </a>
        </li>

        <li onClick={() => navigate('/account/subscriptions')}>
          <a
            className={cx('block cursor-pointer select-none pb-2.5 px-2 ' +
              'border-b tracking-wide border-b-transparent hover:text-gray-400',
              (location.pathname === '/account/subscriptions') &&
              'active font-bold !text-gray-200 !border-b-logseq-300')}>
            <span
              className={'inline-flex items-center pr-2 relative top-[3px]'}>
              <Cardholder size={17} weight={'bold'}/>
            </span>
            Payments & Subscriptions
          </a>
        </li>
      </ul>

      {/* main */}
      <div className={'bd relative pt-8'}>
        <div className="flex flex-col space-y-6 w-full">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
