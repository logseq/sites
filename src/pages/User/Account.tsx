import {
  IAppUserInfo,
  modalFacade, useAppState, useAuthUserInfoState,
  useLemonState,
  useProState,
} from '../../state'
import { ReactElement, useEffect, useRef, useState } from 'react'
import {
  ArrowFatLinesUp,
  ArrowRight,
  ArrowsClockwise, ArrowSquareOut,
  Cardholder,
  ChatsCircle,
  DiscordLogo, DotsThreeOutline,
  IdentificationCard,
  LockKeyOpen,
  LockOpen,
  MicrophoneStage, NoteBlank,
  Notebook,
  Queue, Receipt, ReceiptX, Repeat,
  SignOut, Stack, StackSimple, WarningCircle,
} from '@phosphor-icons/react'
import { Button } from '../../components/Buttons'
import toast from 'react-hot-toast'
import Avatar from 'react-avatar'
import cx from 'classnames'
import { LSSpinner } from '../../components/Icons'
import { none } from '@hookstate/core'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Dropdown } from '../../components/Dropdown'
import { AccountSettings } from '@aws-amplify/ui-react'
import { ValidationMode } from '@aws-amplify/ui'
import { Auth } from 'aws-amplify'

function LemonPaymentButton ({ userId, email, opts }: Partial<{
  userId: string,
  username: string,
  email: string,
  opts?: any
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
            }, 1000)

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

  // if (proState.value.info?.ProUser === true) return

  return (
    <a href={`https://logseq.lemonsqueezy.com/checkout/buy/f9a3c7cb-b8eb-42b5-b22a-7dfafad8dc09
      ?embed=1&media=0&checkout[email]=${encodeURIComponent(
      email)}&checkout[custom][user_uuid]=${userId}`}
       className={'lemonsqueezy-button flex justify-between mt-4 bg-pro-700 py-3 px-6 rounded-lg items-center hover:opacity-80 active:opacity-100'}>
      <strong className={'flex items-center font-normal'}>
        <ArrowFatLinesUp size={24} weight={'duotone'}/>
        <span className={'flex flex-col mx-3'}>
          {opts?.text ||
            (<>
              <b className={'font-semibold text-lg text-gray-100'}>Subscribe
                Logseq Pro</b>
              <small>Get <span
                className={'text-gray-100'}>more features</span> to speed up
                your works!</small>
            </>)}
        </span>
      </strong>

      <strong>
        <ArrowRight size={20}/>
      </strong>
    </a>)
}

function StartTrialButton () {
  const [pending, setPending] = useState(false)
  const lemonState = useLemonState()
  const { loadProInfo } = useProState()

  return (
    <button
      onClick={async () => {

        try {
          setPending(true)
          await lemonState.startFreeTrial()
          loadProInfo().catch(null)
        } catch (e: any) {
          toast.error(e)
        } finally {
          setPending(false)
        }
      }}
      disabled={pending}
      className={'flex justify-between mt-4 bg-pro-700 py-3 px-6 rounded-lg items-center hover:opacity-80 active:opacity-100 select-none cursor-pointer w-full disabled:cursor-wait'}>
      <strong className={'flex items-center font-normal'}>
        <ArrowFatLinesUp size={24} weight={'duotone'}/>
        <span className={'flex flex-col mx-3'}>
          <b className={'font-semibold text-lg text-gray-100 text-left'}>Start free trial</b>
          <small>Try <span className={'text-gray-100'}>Logseq Pro</span> for 1 month</small>
        </span>
      </strong>

      <strong>
        {pending ? (
          <LSSpinner className={'relative top-0.5'} size={8}/>
        ) : <ArrowRight size={20}/>}
      </strong>
    </button>)
}

export function NothingContent ({ text }: { text: string }) {
  return (
    <div className="nothing-content py-20">
      <h1 className={'flex flex-col justify-center items-center'}>
        <NoteBlank weight={'duotone'} size={70} className={'opacity-20'}/>
        <span className={'text-gray-600'}>
          {text}
        </span>
      </h1>
    </div>
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
  const [previousMore, setPreviousMore] = useState(false)
  const DEFAULT_LEN = 3

  useEffect(() => {
    if (lemonSubscriptions == null) {
      lemon.loadSubscriptions().catch(null)
    }
  }, [])

  const loadButton = (
    <div className={'flex justify-between absolute top-[-80px] right-2 z-10'}>
      <Button onClick={() => {
        lemon.loadSubscriptions().catch(null)
        setPreviousMore(false)
      }} className={
        cx('!bg-transparent mr-1',
          (lemon.subscriptionsFetching && 'animate-spin'))}>
        <ArrowsClockwise weight={'bold'} size={22}
                         className={'opacity-70'}/>
      </Button>
    </div>)

  if (!lemonSubscriptions || !lemonSubscriptions.length) {
    return (
      <div className={'relative'}>
        {loadButton}

        {!lemon.subscriptionsFetching &&
          <NothingContent text={'Empty list'}/>}
      </div>)
  }

  let activePane = <></>
  let inactivePane = <></>

  const renderList = (subscriptions: any, previous = false) => {
    const len = subscriptions?.length || 0

    return (
      <div>
        <ul>
          {Array.isArray(subscriptions) && subscriptions.map((it, idx) => {
            if (previous && !previousMore && (idx + 1) > DEFAULT_LEN) return

            // https://docs.lemonsqueezy.com/api/subscriptions
            const {
              status,
              status_formatted,
              subtotal_formatted,
              created_at,
              user_email,
              user_name,
              customer_id,
              product_name,
              variant_name,
              renews_at,
              pause,
              updated_at,
            } = it.attributes

            const isTrial = status === 'on_trial'
            const isActive = status === 'active'
            const isPaused = status === 'paused'
            const isUnpaid = status === 'unpaid'
            const isCancelled = status === 'cancelled'
            const isExpired = status === 'expired'
            const isBindSubscription = proState.value.info?.LemonSubscriptionID?.LogseqPro ==
              it.id

            const isCurrent = isActive || isTrial || isPaused
            const actionItems = []

            const isWithInvoice = isCurrent

            const pickInvoiceUrl = (info: any) => info?.['subscription-invoices']?.body?.data[0]?.attributes?.urls?.invoice_url
            const relatedInfoState = proState.value.subscriptionRelatedInfo?.[it.id]
            const invoiceUrl = relatedInfoState &&
              pickInvoiceUrl(relatedInfoState)

            if (isCurrent) {
              actionItems.push(
                {
                  text: (
                    <Button
                      className={'!bg-transparent !px-2 !py-2 !w-full'}
                      onClick={async () => {
                        // TODO: move to ui components
                        const m = modalFacade.create((c: any) => (
                          <div className="ui-modal-confirm-content">
                            <div
                              className={'text-xl pt-4 text-gray-300 flex items-center space-x-2'}>
                              <WarningCircle size={20} weight={'duotone'}/>
                              <span>Are you sure you want to cancel the subscription?</span>
                            </div>

                            <p className="flex justify-end pt-6 space-x-6">
                              <Button onClick={c}
                                      className={'!bg-transparent opacity-50'}>No</Button>
                              <Button className={'!bg-red-600'}
                                      onClick={() => {
                                        c()
                                        doCancel()
                                      }}
                              >Yes</Button>
                            </p>
                          </div>
                        ), {
                          className: 'as-confirm',
                          hasClose: false,
                        })

                        m.show()

                        async function doCancel () {
                          try {
                            proState.actionPendingSubscriptions.merge(
                              { [it.id]: true })
                            await lemon.cancelSubscription(it.id)
                            await lemon.loadSubscriptions()

                            if (isBindSubscription) {
                              await loadProInfo()
                            }
                          } finally {
                            proState.actionPendingSubscriptions.merge(
                              { [it.id]: none })
                          }
                        }
                      }}>
                  <span className={'flex items-center space-x-1'}>
                    <ReceiptX weight={'duotone'} size={18}/>
                    <small className={'text-sm'}>Cancel subscription</small>
                  </span>
                    </Button>),
                },
              )

              // pause Or unpause
              actionItems.push(
                {
                  text: (
                    <Button className={'!bg-transparent !px-2 !py-2 !w-full'}
                            onClick={() => {
                              async function doPause () {
                                try {
                                  proState.actionPendingSubscriptions.merge(
                                    { [it.id]: true })

                                  if (!isPaused) {
                                    await lemon.pauseSubscription(it.id)
                                  } else {
                                    await lemon.unpauseSubscription(it.id)
                                  }

                                  lemon.loadSubscriptions().then(() => {
                                    if (isBindSubscription) loadProInfo()
                                  })
                                } finally {
                                  proState.actionPendingSubscriptions.merge(
                                    { [it.id]: none })
                                }
                              }

                              doPause().catch(null)
                            }}
                    >
                  <span className={'flex items-center space-x-1'}>
                    <Receipt weight={'duotone'} size={18}/>
                    <small className={'text-sm'}>{isPaused
                      ? 'Unpause'
                      : 'Pause'} subscription</small>
                  </span>
                    </Button>
                  ),
                },
              )
            }

            return (
              <li key={it.id} className={
                cx(
                  'subscription-card text-lg flex items-center mb-4 rounded-xl relative',
                  `is-${status}`)}>

                <div className="inner">
                  <div className="hd">
                    <strong>
                      {status_formatted}
                    </strong>

                    {!!actionItems.length &&
                      (<Dropdown
                        items={actionItems}
                        subItemClassName={'!top-1'}
                        className={'card-actions'}
                        triggerType={'click'}
                      >
                        <button className={'as-button'}>
                          {proState.actionPendingSubscriptions.value?.[it.id] ?
                            <LSSpinner size={8} color={'#ffffff'}/> :
                            <DotsThreeOutline/>
                          }
                        </button>
                      </Dropdown>)}
                  </div>

                  {isCurrent && (
                    <div className={'active-desc'}>
                      <div className="l">
                        <small className={'pb-1.5'}>Subscriber</small>
                        <strong>{user_name}</strong>
                        <small
                          className={'opacity-50 relative top-[-2px]'}>{user_email}</small>
                      </div>
                      <div className="r">
                        <small className={'pb-1.5'}>Start date</small>
                        <strong>{new Date(
                          created_at).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  )}

                  <div className="info-desc">
                    <div className="flex justify-between items-center">
                      <strong className={'text-gray-200'}>
                        <b className={'text-2xl pr-1'}>Logseq</b>
                        <span
                          className="pro-flag relative top-[-2px]">PRO</span>
                      </strong>

                      {isWithInvoice &&
                        <span className={'text-sm select-none pr-1'}>
                        {relatedInfoState?.pending ?
                          <LSSpinner size={6}/> :
                          <a
                            className={'opacity-60 hover:opacity-80 active:opacity-100 cursor-pointer flex items-center space-x-1'}
                            onClick={() => {
                              if (invoiceUrl) {
                                return open(invoiceUrl, '_blank')
                              }

                              lemon.getSubscriptionRelatedInfo(it.id).then(info => {
                                const url = pickInvoiceUrl(info)
                                url && open(url, '_blank')
                              }).catch(null)
                            }}
                          >
                            <ArrowSquareOut weight={'bold'}/>
                            <b>Get invoice</b>
                          </a>}
                      </span>}

                    </div>

                    <div
                      className={'flex justify-between pt-1 items-center text-[15px] tracking-wide'}>
                      <b className={'flex items-center space-x-2'}>
                        <Repeat weight={'bold'} size={18}/>
                        <span>{variant_name}</span>
                      </b>
                      <b>
                        <span className={'opacity-70 pr-1'}>
                          {(isActive || isTrial) ? `Next renewal: ${new Date(
                              renews_at).toDateString()}` :
                            ((isPaused && pause?.resumes_at)
                              ? `Resumes at: ${(new Date(
                                pause?.resumes_at).toDateString())}`
                              :
                              `Updated at: ${(new Date(
                                updated_at)).toDateString()}`)}
                        </span>
                      </b>
                    </div>
                  </div>
                </div>
              </li>)
          })}
        </ul>
        {previous && len > DEFAULT_LEN && (
          <span className={'flex items-center justify-center py-2'}>
            <a
              className={'cursor-pointer flex items-center text-sm opacity-80 hover:opacity-100 hover:underline'}
              onClick={() => setPreviousMore(!previousMore)}
            >
              {previousMore ? 'less items' : 'more items'}
            </a>
          </span>
        )}
      </div>)
  }

  const activeSubs = []
  const inactiveSubs = []

  lemonSubscriptions?.forEach((it: any) => {
    if (['active', 'on_trial', 'paused'].includes(it.attributes?.status)) {
      activeSubs.push(it)
    } else {
      inactiveSubs.push(it)
    }
  })

  activePane = renderList(activeSubs)
  inactivePane = renderList(inactiveSubs, true)

  return (
    <div className={'relative'}>
      {loadButton}

      {activeSubs?.length != 0 && (
        <RowOfPaneContent label={'Current subscription'}>
          <div className={'px-6 relative'}>
            {activePane}
          </div>
        </RowOfPaneContent>)}

      {inactiveSubs?.length != 0 &&
        (<RowOfPaneContent label={'Previous subscriptions'}>
          <div className={'px-6 relative'}>
            {inactivePane}
          </div>
        </RowOfPaneContent>)}
    </div>
  )
}

function AccountFreePlanCard (
  { userInfo }: { userInfo: IAppUserInfo },
) {
  const { proState, loadProInfo } = useProState()
  const proStateInfoValue = proState.value.info

  return (
    <div className={'account-plan-card free'}>
      <div className="inner">
        <div className="hd">
          <strong>
            Free
          </strong>

          <a className={cx('relative top-[-10px]',
            proState.value.infoFetching && 'animate-spin')}
             onClick={() => {
               if (proState.value.infoFetching) return
               loadProInfo().catch(null)
             }}>
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
            <span className={'line'}>-------</span>
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
            <span className={'line'}>-------</span>
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

          <span
            className={'flex flex-col pt-2 text-sm space-y-2 text-gray-300 px-1 py-1'}>
          <a className={'flex items-center space-x-2 cursor-pointer'}
             href={'mailto://support@logseq.com'}
          >
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
          {(!proStateInfoValue?.ProUser &&
            proStateInfoValue?.FreeTrialEndsAt?.LogseqPro == null) ?
            <StartTrialButton/> :
            <LemonPaymentButton
              email={userInfo.attributes?.email}
              userId={userInfo.attributes?.sub}
              username={userInfo.username}
            />}
        </div>
      </div>
    </div>)
}

function AccountProPlanCard (
  { userInfo }: { userInfo: IAppUserInfo },
) {
  const { proStateValue, loadProInfo, inTrial } = useProState()
  const fileSyncExpiredAt = proStateValue.info?.FileSyncExpireAt
  return (
    <div className={'account-plan-card pro'}>
      <div className="inner">
        <div className="hd">
          <strong>
            Pro {inTrial ? ' / On trial' : ''}
          </strong>

          <span className={'flex items-center space-x-5'}>
            <small className={'opacity-60'}>Expired at: {(new Date(
              fileSyncExpiredAt)).toLocaleDateString()}</small>
            <a
              className={cx(
                'relative top-0 cursor-pointer active:opacity-50 select-none',
                proStateValue.infoFetching && 'animate-spin')}
              onClick={() => {
                if (proStateValue.infoFetching) return
                loadProInfo().catch(null)
              }}>
              <ArrowsClockwise size={18} weight={'bold'}/>
            </a>
          </span>
        </div>
        <div className="desc pro">
          <div className={'flex items-center pt-3'}>
          <span className={'flex items-center'}>
            <Stack size={26} weight={'duotone'} color={'#3cbaf3'}/>
            <strong
              className={'text-2xl text-gray-200 font-medium pl-2'}>10</strong>
            <small className={'text-base px-2'}>synced graphs</small>
          </span>
            <span className={'line'}>-------</span>
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
          <a className={'flex items-center space-x-2 cursor-pointer w-1/2'}
             href={'https://discord.com/channels/725182569297215569/918889676071374889/1050520429258887320'}
             target={'_blank'}
          >
            <DiscordLogo size={16} weight={'duotone'}/>
            <span>Discord community</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>

          <a className={'flex items-center space-x-2 cursor-pointer w-1/2'}>
            <Queue size={16} weight={'duotone'}/>
            <span>In-app handbook</span>
            <ArrowRight className={'relative top-[2px] opacity-70'} size={16}/>
          </a>

          <span
            className={'flex flex-col pt-2 text-sm space-y-2 text-gray-300'}>
          <a className={'flex items-center space-x-2 cursor-pointer'}
             href={'mailto://support@logseq.com'}
          >
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

        {/* Debug */}
        <LemonPaymentButton
          email={userInfo.attributes?.email}
          userId={userInfo.attributes?.sub}
          username={userInfo.username}
          opts={inTrial ? {} : {
            text: (<>
              <b className={'font-semibold text-lg text-gray-100'}>Subscribe
                Logseq Pro (Debug button)</b>
              <small>Get <span
                className={'text-gray-100'}>more features</span> to speed your
                works!</small>
            </>),
          }}
        />
      </div>
    </div>
  )
}

export function UserInfoContent (props: { userInfo: IAppUserInfo }) {
  const { proStateValue } = useProState()

  if (!proStateValue.info && proStateValue.infoFetching) {
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

/**
 * You can specify the following requirements in the Password policy in the AWS
 * Management Console under the Sign-in experience tab.
 * A Password minimum length of at least six characters and at most 99 characters.
 * This is the shortest password you want your users to be able to set.
 * Amazon Cognito passwords can be up to 256 characters in length.
 *
 * Your users must create a password that Contains at least 1 of the following types of characters.
 * 1. Number
 * 2. Special character from the following set. A non-leading, non-trailing space character is also treated as a special character.
 *   ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ ` = + -
 * 3. Uppercase Basic Latin letter
 * 4. Lowercase Basic Latin letter
 *
 * @param close
 * @constructor
 */
export function AccountChangePasswordPane ({ close }: { close: () => void }) {
  const [pending, setPending] = useState(false)
  const minLength = {
    validationMode: 'onChange' as ValidationMode,
    validator: (password: string) => password.length >= 6,
    message: 'Password must have length 6 or greater',
  }

  const maxLength = {
    validationMode: 'onChange' as ValidationMode,
    validator: (password: string) => password.length <= 12,
    message: 'Password must have length 12 or less',
  }

  const changePasswordComponents = {
    SubmitButton: ({ isDisabled }: any) => {
      return (
        <button
          className={'py-2.5 border-gray-400/80 mt-3 bg-transparent border rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'}
          disabled={isDisabled}
          onClick={(e: any) => {
            const form: HTMLFormElement = e.target?.closest(
              'form.amplify-accountsettings-changepassword')
            if (!form) return
            form.requestSubmit()
            setPending(true)
            return false
          }}
          type={'submit'}
        >
          {pending ? <LSSpinner size={8}/> : 'Update password'}
        </button>
      )
    },
  }

  const handleSuccess = () => {
    toast.success('password is successfully changed!', {
      position: 'top-center',
    })
    close()
    setPending(false)
  }

  const handleError = (e) => {
    toast.error('change password failed!', {
      position: 'top-center',
    })
    console.error(e)
    setPending(false)
  }

  return (
    <div className={'account-change-password-pane'}>
      <h1 className={'text-3xl mx-[-5px] pb-6'}>
        Change password
      </h1>
      <AccountSettings.ChangePassword
        onSuccess={handleSuccess}
        onError={handleError}
        validators={[minLength, maxLength]}
        components={changePasswordComponents}
      />
    </div>
  )
}

export function AccountDeleteUserPane ({ close, userInfo }: {
  close: () => void,
  userInfo: IAppUserInfo
}) {
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSuccess = async () => {
    await userInfo.signOut()
    close()
  }

  const handleError = (e: any) => {
    toast.error(`Delete failed: ${e}`, {
      position: 'top-center',
    })
    setPending(false)
  }

  const handleDelete = async () => {
    if (pending) return
    setPending(true)

    if (inputRef.current?.value?.trim() !== userInfo.username) {
      inputRef.current.select()
      throw new Error('Incorrect username!')
    }

    await Auth.deleteUser()
  }

  return (
    <div className="account-delete-user-pane">
      <h1 className={'text-xl font-semibold mt-2'}>Confirm delete account</h1>
      <div className="flex flex-col pt-2">
        <p className={'flex flex-col space-y-2 pb-4'}>
          <label htmlFor="{'delete-user-input-username'}"
                 className={'select-none'}>
            Please input your username <i>({userInfo.username})</i>
          </label>
          <input id={'delete-user-input-username'}
                 autoFocus={true}
                 autoComplete={'off'}
                 ref={inputRef}
                 className={'p-2 bg-transparent border border-gray-400 rounded outline-0'}/>
        </p>
        {pending ?
          <p className={'flex justify-center'}><LSSpinner size={8}/></p> :
          <AccountSettings.DeleteUser
            onSuccess={handleSuccess}
            handleDelete={handleDelete}
            onError={handleError}
          />}
      </div>
    </div>
  )
}

export function AccountUserInfoPane ({ userInfo }: { userInfo: IAppUserInfo }) {
  const { proState } = useProState()
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
            (<UserInfoContent userInfo={userInfo}/>)
          }
        </div>
      </RowOfPaneContent>

      <RowOfPaneContent label={'Authentication'}>
        <div className="px-6 flex items-center space-x-5">
          <Button
            className={'!py-2 !bg-logseq-600 !px-6'}
            leftIcon={<ArrowSquareOut/>}
            href={`logseq://x-callback-url/auth?t=${encodeURIComponent(
              JSON.stringify(userInfo.signInUserSession))}`}
          >
            Open in Desktop
          </Button>

          <Button
            className={'!py-2 !bg-logseq-700 !px-6'} leftIcon={<LockOpen/>}
            onClick={() => {
              const m = modalFacade.create(
                (x) => <AccountChangePasswordPane close={x}/>,
                { ['data-account-change-pw']: true })
              m.show()
            }}
          >
            Change password
          </Button>

          <Button
            className={'!py-2 !bg-red-900 !px-6'}
            onClick={() => {
              const m = modalFacade.create((c) => {
                return (<AccountDeleteUserPane close={c} userInfo={userInfo}/>)
              }, {
                ['data-account-delete-user']: true,
              })

              m.show()
            }}
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
                (<span
                  className={'pro-flag relative top-[-3px] left-[3px] opacity-80'}>PRO</span>)}
            </h2>
            <h3 className={'px-2 text-sm text-gray-400/80'}>
              {userInfo.attributes?.email}
            </h3>
          </div>
        </div>
        <Button
          className={'!text-[20px] bg-logseq-600 scale-75 !px-6 !rounded-xl !py-4'}
          disabled={userInfo.pending}
          rightIcon={userInfo.pending ? <LSSpinner size={8}/> : <SignOut/>}
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
