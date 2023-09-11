import {
  IAppUserInfo,
  IProState,
  useLemonState,
  useProState,
} from '../../state'
import { ReactElement, useEffect } from 'react'
import {
  ArrowFatLinesUp,
  ArrowRight,
  ArrowsClockwise,
  Cardholder,
  Chat,
  ChatsCircle, Diamond,
  DiscordLogo,
  IdentificationCard,
  LockKeyOpen,
  LockOpen,
  MicrophoneStage,
  Notebook,
  PlayCircle,
  Queue,
  SignOut,
  Stack, StackSimple,
} from 'phosphor-react'
import { Button } from '../../components/Buttons'
import toast from 'react-hot-toast'
import Avatar from 'react-avatar'
import cx from 'classnames'
import { LSSpinner } from '../../components/Icons'
import { none } from '@hookstate/core'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { func } from 'prop-types'

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
    <a href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09
      ?embed=1&media=0&checkout[email]=${encodeURIComponent(
      email)}&checkout[custom][user_uuid]=${userId}`}
       className={'lemonsqueezy-button flex justify-between mt-4 bg-pro-700 py-3 px-6 rounded-lg items-center hover:opacity-80 active:opacity-100'}>
      <strong className={'flex items-center font-normal'}>
        <ArrowFatLinesUp size={24} weight={'duotone'}/>
        <span className={'flex flex-col mx-3'}>
              <b className={'font-semibold text-lg text-gray-100'}>Start free trial</b>
              <small>Try <span className={'text-gray-100'}>Logseq Pro</span> for 2 weeks</small>
        </span>
      </strong>

      <strong>
        <ArrowRight size={20}/>
      </strong>
    </a>)
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

function AccountFreePlanCard (
  { proState, userInfo }: { proState: IProState, userInfo: IAppUserInfo },
) {
  return (
    <div className={'account-plan-card free'}>
      <div className="inner">
        <div className="hd">
          <strong>
            Free
          </strong>

          <a className={'relative top-[-10px]'}
             onClick={() => toast('TODO: refresh plan ...')}>
            <ArrowsClockwise size={18} weight={'bold'}/>
          </a>
        </div>
        <div className="desc free">
          <div className={'flex items-center pt-3'}>
          <span className={'flex items-center'}>
            <StackSimple size={26} weight={'duotone'} color={'#608E91'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>1</strong>
            <small className={'text-base px-2'}>synced graphs</small>
          </span>
            <span className={'px-4'}>-------</span>
            <span className={'flex items-center'}>
            <Notebook size={26} weight={'duotone'} color={'#608E91'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>
              50MB
            </strong>
            <small className={'text-base px-2'}>
              storage per graph
            </small>
          </span>
          </div>
        </div>
        <div className="sub-desc">
          <a className={'flex items-center space-x-2 cursor-pointer'}
             href={'https://discord.com/channels/725182569297215569/918889676071374889/1050520429258887320'}
             target={'_blank'}
          >
            <DiscordLogo size={16} weight={'duotone'}/>
            <span>Discord community</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>

          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <Queue size={16} weight={'duotone'}/>
            <span>In-app handbook</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>
        </div>
        {/*  pro */}
        <div className="desc pro">
          <h2 className={'text-gray-50 py-2 px-1'}>
            Upgrading to <strong className={'pro-flag'}>PRO</strong> unlocks:
          </h2>
          <div className={'flex items-center pt-3'}>
          <span className={'flex items-center'}>
            <Stack size={26} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>10</strong>
            <small className={'text-base px-2'}>synced graphs</small>
          </span>
            <span className={'px-4'}>-------</span>
            <span className={'flex items-center'}>
            <Notebook size={26} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>
              10GB
            </strong>
            <small className={'text-base px-2'}>
              storage per graph
            </small>
          </span>
          </div>

          <div className={'flex items-center pt-2'}>
          <span className={'flex items-center'}>
            <LockKeyOpen size={27} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>
              Early access
            </strong>
            <small className={'text-base px-2 relative top-[2px]'}>
              to upcoming features
            </small>
          </span>
          </div>

          <span className={'flex flex-col pt-2 text-sm space-y-2 text-gray-300 px-1 py-1'}>
          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <ChatsCircle size={16} weight={'duotone'}
                         className={'text-pro-400'}/>
            <span>Get support</span>
          </a>

          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <MicrophoneStage size={16} weight={'duotone'}
                             className={'text-pro-400'}/>
            <span>Exclusive townhalls with team members</span>
          </a>
        </span>

          {/*start pro trial*/}
          <LemonPaymentButton
            email={userInfo.attributes?.email}
            userId={userInfo.attributes?.sub}
            username={userInfo.username}
          />
        </div>
      </div>
    </div>)
}

function AccountProPlanCard (
  { proState }: { proState: IProState },
) {
  const _proStateValue = proState.value

  return (
    <div className={'account-plan-card pro'}>
      <div className="inner">
        <div className="hd">
          <strong>
            Pro
          </strong>

          <a className={'relative top-[-10px]'}
             onClick={() => toast('TODO: refresh plan ...')}>
            <ArrowsClockwise size={18} weight={'bold'}/>
          </a>
        </div>
        <div className="desc pro">
          <div className={'flex items-center pt-3'}>
          <span className={'flex items-center'}>
            <Stack size={26} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>10</strong>
            <small className={'text-base px-2'}>synced graphs</small>
          </span>
            <span className={'px-4'}>-------</span>
            <span className={'flex items-center'}>
            <Notebook size={26} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>
              10GB
            </strong>
            <small className={'text-base px-2'}>
              storage per graph
            </small>
          </span>
          </div>

          <div className={'flex items-center pt-2'}>
          <span className={'flex items-center'}>
            <LockKeyOpen size={27} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>
              Early access
            </strong>
            <small className={'text-base px-2 relative top-[2px]'}>
              to upcoming features
            </small>
          </span>
          </div>
        </div>
        <div className="sub-desc">
          <a className={'flex items-center space-x-2 cursor-pointer'}
             href={'https://discord.com/channels/725182569297215569/918889676071374889/1050520429258887320'}
             target={'_blank'}
          >
            <DiscordLogo size={16} weight={'duotone'}/>
            <span>Discord community</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>

          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <Queue size={16} weight={'duotone'}/>
            <span>In-app handbook</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>

          <span className={'flex flex-col pt-2 text-sm space-y-2 text-gray-300'}>
          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <ChatsCircle size={16} weight={'duotone'}
                         className={'text-pro-400'}/>
            <span>Get support</span>
          </a>

          <a className={'flex items-center space-x-2 cursor-pointer'}>
            <MicrophoneStage size={16} weight={'duotone'}
                             className={'text-pro-400'}/>
            <span>Exclusive townhalls with team members</span>
          </a>
        </span>
        </div>
      </div>
    </div>
  )
}

export function UserInfoContent (props: {
  userInfo: IAppUserInfo,
  proState: IProState,
  loadProInfo: () => Promise<void>
}) {
  const proStateValue = props.proState.get()

  if (proStateValue.infoFetching != undefined) {
    if (proStateValue.infoFetching) {
      return <b className={'flex space-x-6 items-center'}>
        <LSSpinner/>
        <span>Loading plan...</span>
      </b>
    } else {
      return (proStateValue.info?.ProUser === true) ?
        (<AccountProPlanCard {...props}/>) :
        (<AccountFreePlanCard {...props}/>)
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
          {proStateValue.e &&
            (<pre className={'bg-red-600/50 p-4 block rounded-lg'}>
              {proStateValue.e?.message}
              {proStateValue.e?.stack}
             </pre>)}

          {((typeof proState.value.info?.ProUser === 'boolean') ||
              (proStateValue.infoFetching)) &&
            (<UserInfoContent
              userInfo={userInfo}
              proState={proState}
              loadProInfo={loadProInfo}
            />)
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

export function AccountContent ({ userInfo }: {
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
