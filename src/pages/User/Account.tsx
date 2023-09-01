import { IAppUserInfo, IProState, useLemonState, useProState } from '../../state'
import { useEffect, useState } from 'react'
import { ArrowsClockwise, SignOut } from 'phosphor-react'
import { Button } from '../../components/Buttons'
import toast from 'react-hot-toast'
import Avatar from 'react-avatar'
import cx from 'classnames'
import { GlassCard } from '../../components/Cards'
import { LSSpinner } from '../../components/Icons'

function LemonPaymentButton ({ userId, username, email }: Partial<{
  userId: string,
  username: string,
  email: string
}>) {
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
      ?embed=1&media=0&checkout[email]=${encodeURIComponent(email)}&checkout[custom][user_uuid]=${userId}`}
      className="lemonsqueezy-button inline-block py-3 px-4 bg-indigo-600 text-lg rounded-lg">
      Buy Logseq Pro
    </a>
  )
}

function LemoOrders () {
  const lemon = useLemonState()
  const lemonSubscriptions = lemon.getSubscriptions() as any

  useEffect(() => {
    lemon.load().catch(null)
  }, [])

  let pane = <></>

  if (lemon.fetching) {
    pane = <div className={'py-4 text-2xl flex'}><LSSpinner/></div>
  } else {
    pane = (<ul className={'py-2'}>
      {Array.isArray(lemonSubscriptions) && lemonSubscriptions.map(it => {
        const {
          status_formatted, subtotal_formatted, created_at, user_email,
          user_name, customer_id, product_name, variant_name
        } = it.attributes
        return (
          <li key={it.id} className={'text-lg py-3 flex items-center'}>
            <GlassCard className={'w-full'}>
              <small>#{it.id} {user_name} & {user_email} & ^{customer_id}</small>
              <br/>
              <span
                className={'font-bold text-pro-300 pr-1'}>{product_name} / {variant_name} </span>
              {subtotal_formatted} / <code>{status_formatted}</code> / {created_at}
            </GlassCard>
          </li>)
      })}
    </ul>)
  }

  return (
    <div className={'py-4 w-full'}>
      <div className={'flex justify-between'}>
        <h1 className={'text-4xl'}>Subscription orders:</h1>
        <Button onClick={() => lemon.load()} className={'!bg-transparent'}>
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
      return proState.info?.ProUser ?
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
}

export function AccountPane ({ userInfo }: {
  userInfo: IAppUserInfo
}) {
  const [active, setActive] = useState<string>()
  const proState = useProState()
  let activeContent = <></>

  switch (active) {
    case 'payments':
      activeContent = (
        <LemoOrders/>
      )
      break
    default:
      activeContent = (
        <>
          <LemonPaymentButton
            email={userInfo.attributes?.email}
            userId={userInfo.attributes?.sub}
            username={userInfo.username}
          />

          <div className={'!bg-logseq-500 !rounded-2xl !px-8 !py-6'}>
            <UserInfoContent proState={proState}/>
          </div>

          <pre className={'whitespace-pre w-56 p-4'}>
            {JSON.stringify(userInfo.attributes, null, 2)}
          </pre>
        </>
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