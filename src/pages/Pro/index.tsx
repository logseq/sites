import './index.css'
import cx from 'classnames'
import {
  ArrowSquareOut, Check, CheckSquare,
  CircleWavyQuestion, Cube,
  Database,
  FileCloud,
  Files, HandPointing,
  LockKeyOpen, Minus,
  Notebook, Plus,
  ShieldStar, SignIn,
  Stack,
  Student, Tag, TwitterLogo, UserCirclePlus, Wallet
} from 'phosphor-react'
import { Button } from '../../components/Buttons'
import { LandingFooterDesc, LandingFooterNav } from '../Landing'
import { useMemo, useState } from 'react'
import { useAppState } from '../../state'

function ProCard ({ children, className, ...rest }: any) {
  return (
    <div className={cx('as-pro-card', className)} {...rest}>
      {children}
    </div>
  )
}

function ProInfoSection () {
  const appState = useAppState()

  return (
    <section className={'pro-info'}>
      {/*head text*/}
      <div className={'flex flex-col sm:items-center z-10 font-bold pt-10 sm:pt-12'}>
        <h1 className={'text-3xl sm:flex items-center sm:text-6xl tracking-wide leading-[2.5rem]'}>
          <span>Experience</span>
          <b className={'ml-2 sm:ml-4'}>
            the {appState.sm.get() ? <br/> : ''} benefits of</b>
          <strong className={'pro-flag'}>PRO</strong>
          <b>.</b>
        </h1>

        <h2 className={'hidden sm:block text-4xl font-medium'}>
          <b>Boost your</b> workflows and creativity across all devices.
        </h2>

        <h2 className={'sm:hidden text-2xl font-medium pt-2'}>
          <b className={'thin'}>Collect your thoughts and get inspired.</b> Your train-of-thought is waiting for you!
        </h2>
      </div>

      {/*price card*/}
      <div className={'block space-y-6 sm:space-y-0 sm:flex pt-14 sm:space-x-6 z-10 relative pb-[418px] sm:pb-[190px]'}>
        <ProCard className={'plans-card as-pro-border a sm:flex-1'}>
          <i><FileCloud size={38} weight={'duotone'}/></i>
          <h1>
            <b>Enjoy</b> advanced <br/> syncing options.
          </h1>
          <h2 className={'hidden sm:block text-xl'}>
            <b>Benefit from our</b> smart merging system for seamless syncing,
            <b className={'ml-2'}>as well as</b> expanded storage and larger <br/>asset support
            <b className={'ml-2'}>across all devices.</b>
          </h2>
          <h3
            className={'px-2 flex items-center bg-pro-900/90 rounded-lg mt-4 py-2 sm:px-4 leading-none tracking-normal'}>
            <ShieldStar weight={'duotone'} size={appState.sm.get() ? 22 : 32}/>
            <span className={'text-sm sm:text-xl ml-2 font-medium'}>
              Always end-to-end encrypted
              <b className={'font-normal ml-2'}>on all plans.</b>
            </span>
          </h3>
        </ProCard>

        <ProCard className={'plans-card as-pro-border b sm:flex-1'}>
          <i><LockKeyOpen size={38} weight={'duotone'}/></i>
          <h1>
            <b>Get</b> early access to <br/>cutting-edge features.
          </h1>
          <h2 className={'hidden sm:block text-xl'}>
            <b>Be the first to upgrade your workflows with</b> exclusive <br/>access to beta features,
            <b className={'ml-2'}>helping shape the future of <br/>Logseq.</b>
          </h2>
          <section className="big-things">
            <h4>NEXT BIG THINGS</h4>
            <ul>
              <li>
                <strong>UX/UI Refresh</strong>
                <span>Enhanced Navigation & Design: <b>Intuitive and visually appealing.</b></span>
              </li>
              <li>
                <strong>Logseq Publish</strong>
                <span>Effortless Note Sharing: <b>Publish your thoughts with ease.</b></span>
              </li>
              <li>
                <strong>Real-time collaboration</strong>
                <span>Empower Teamwork: <b>Work simultaneously and boost productivity.</b></span>
              </li>
            </ul>
          </section>
        </ProCard>

        <ProCard className={'plans-card c'}>
          <span>
            <Stack size={36} weight={'duotone'} color={'#3cbaf3'}/>
            <strong>100GB</strong>
            <small>total storage</small>
          </span>
          <span>
            <Notebook size={36} weight={'duotone'} color={'#3cbaf3'}/>
            <strong>10GB</strong>
            <small>per graph</small>
          </span>
          <span>
            <Files size={36} weight={'duotone'} color={'#3cbaf3'}/>
            <strong>100MB</strong>
            <small>per asset</small>
          </span>
          <span>
            <Student size={40} weight={'duotone'} color={'#3cbaf3'}/>
            <p className={'flex flex-col pl-2'}>
              <strong className={'flex text-xl font-medium items-center'}>Student pricing
                <i className={'ml-1 text-pro-200'}><CircleWavyQuestion/></i></strong>
              <small>Contact us</small>
            </p>
          </span>
        </ProCard>

        {/*compare button*/}
        <a
          onClick={() => {
            const el = document.getElementById('choose-the-plan-for-you')
            if (el) {
              document.documentElement.scrollTo({
                top: el.getBoundingClientRect().top - 50,
                behavior: 'smooth'
              })
            }
          }}
          className="compare-btn">
          <Database size={20}/>
          <span>Compare plans</span>
        </a>
      </div>

      <i className="bg"></i>
    </section>
  )
}

function TweetsSection () {
  return (
    <section className={'tweets-section'}>
      <div className="inner relative z-10">
        <h1>
          Unlock your ideas with <b className={'ls'}>ease.</b>
        </h1>
        <h2>
          <b className={'ls'}>Join users who rely on</b> Logseq's <br/>
          seamless syncing and powerful toolbox.
        </h2>

        {/*tweet cards*/}
        <div className="tweet-cards">
          <div className="c1">
            {/* item */}
            <div className="tweet-card">
              <p>
                <b className={'ls'}>
                  “I have always suffered from loosing information from
                  consuming a lot of information which can be somehow stressful,
                  but now </b>
                <strong>
                  i can manage my personal knowledge, link and connect
                  information physically and also capture more information.
                </strong>
                <b className={'bg'}>It is the perfect digital brain.</b>”
              </p>
              <p>
                <span>Remy Oreo</span>
                <span>
                  <b className={'ls'}>Via</b>
                  <TwitterLogo weight={'duotone'} size={28}/>
                  <label>Twitter </label>
                  <a href={'javascript:;'}
                     className={'link'}><ArrowSquareOut weight={'duotone'} size={20}/></a>
                </span>
              </p>
            </div>

            {/*item*/}
            <div className="tweet-card">
              <p>
                <b className={'ls'}>“Thinking of a note title before writing an idea is usually enough
                  for me to completely forget what I was going to write or make me
                  feel overwhelmed enough that I don't want to write it down. </b>
                <b className={'bg'}>After discovering Logseq's "do everything in the journal"
                  mindset and the lack of friction in capturing new ideas,
                  I'm in love. </b>
                <strong className={'pl-0.5'}>
                  The ability to just write and go off on whatever
                  tangent I want just by pressing Tab and Shift Tab is a dream.”
                </strong>
              </p>
              <p>
                <span>chadly</span>
                <span>
                  <b className={'ls'}>Via</b>
                  <TwitterLogo weight={'duotone'} size={28}/>
                  <label>Twitter </label>
                  <a href={'javascript:;'}
                     className={'link'}><ArrowSquareOut weight={'duotone'} size={20}/></a>
                </span>
              </p>
            </div>
          </div>
          <div className="c2">
            {/*item*/}
            <div className="tweet-card">
              <p>
                <b className={'ls'}>“Logseq has been the biggest game changer for me since I moved from
                  written ink notebooks to Evernote.</b>
                <strong>I'm constantly in meetings all day,
                  learning and tracking knowledge and losing information.</strong>
                <b className={'ls'}> I personally am not interested in trying out
                  new plugins, so </b>
                <b className={'bg'}> I really love the fact that the core capabilities
                  of Logseq are so powerful, and the app is useful out of the box.
                </b><b className={'ls'}>”</b></p>
              <p>
                <span>GeneralChaos</span>
                <span>
                  <b className={'ls'}>Via</b>
                  <TwitterLogo weight={'duotone'} size={28}/>
                  <label>Twitter </label>
                  <a href={'javascript:;'}
                     className={'link'}><ArrowSquareOut weight={'duotone'} size={20}/></a>
                </span>
              </p>
            </div>

            {/*item*/}
            <div className="tweet-card">
              <p>
                <b className={'ls'}>
                  “So, I completely switched to Logseq and I don't see myself
                  coming back to Obsidian, even if it's a great tool. </b>
                <strong>With Logseq, I took to journaling,</strong>
                <b className={'bg'}>
                  it feels so freeing to just jot down ideas
                  and thoughts in the journal. And I'm managing my creative
                  projects
                </b>
                <b className={'ls'}>in Logseq too. So, thanks for that very useful tool.”</b>
              </p>
              <p>
                <span>Kris</span>
                <span>
                  <b className={'ls'}>Via</b>
                  <TwitterLogo weight={'duotone'} size={28}/>
                  <label>Twitter </label>
                  <a href={'javascript:;'}
                     className={'link'}><ArrowSquareOut weight={'duotone'} size={20}/></a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChoosePlanSection () {
  const items = useMemo(() => {
    return [
      {
        title: 'Can I switch between plans? ',
        desc: 'Yes, you can upgrade or downgrade your plan at any time.' +
          'If you choose to downgrade, you\'ll maintain access to Pro features' +
          ' until the end of your billing cycle.'
      }, {
        title: 'What happens to my synced graphs if I downgrade from Pro to Free?',
        desc: 'Upon downgrading, you\'ll need to select one synced graph to keep ' +
          'within the Free plan and ensure it meets the syncing size limits. If you don\'t make' +
          ' these adjustments, syncing will pause until you modify your plan or reduce the number' +
          ' of graphs and files to fit the free limit. Your remaining previously synced graphs' +
          ' will still be accessible as local files on each synced device. However, once' +
          ' you stop syncing, any changes made to these files will no longer be updated across all devices.'
      }, {
        title: 'Is there a discount for annual subscriptions?',
        desc: 'Yes, we offer a discount for annual subscriptions. ' +
          'Choose the yearly option when subscribing to Logseq Pro for a reduced rate.'
      }, {
        title: 'Do you offer student pricing?',
        desc: 'Yes, we provide a 50% discount for students who can show proof of ' +
          'their university or high school enrollment. To receive the student discount, ' +
          'please send us your enrollment documentation, and we\'ll help you get started ' +
          'with Logseq Pro at the discounted rate.'
      }
    ]
  }, [])
  const [foldedSet, setFoldSet] = useState(new Set())
  const appState = useAppState()

  return (
    <div className={'choose-plan-section-wrap page-inner-full-wrap b'} id={'choose-the-plan-for-you'}>
      <section className={'choose-plan-section as-section'}>
        <h1>
          Choose the plan
          <br/>
          <b>that's right for you.</b>
        </h1>
        <h2>
          <b>Discover the </b>power of Logseq for free<b>, or</b>
          {!appState.sm.get() ? <br/> : ' '}
          <b>unlock</b> advanced features with Logseq
          <span className="pro-flag">PRO</span>.
        </h2>

        <div className="tabs">
          <ul>
            <li className={'active'}>Monthly</li>
            <li><Tag className={'mr-1.5'} weight={'duotone'} color={'#195D6C'}/>
              Yearly<sup className={'text-xs text-pro-400'}>-20%</sup></li>
          </ul>
        </div>

        <div className="cards">
          <div className="free as-pro-card">
            <div className="th">
              <strong>Free</strong>
              <h1>Get started with basic syncing</h1>
            </div>
            <div className="bd">
              <h2>Free</h2>
              <ul>
                <li>
                  <HandPointing weight={'duotone'}/>
                  <span>1 synced graph (up to 50MB)</span>
                </li>
                <li>
                  <HandPointing weight={'duotone'}/>
                  <span>Limited asset syncing</span>
                </li>
                <li>
                  <CheckSquare weight={'duotone'}/>
                  <span>Access to core Logseq features</span>
                </li>
              </ul>

              {/* link button */}
              <div className="flex justify-center pt-6 pb-3">
                <Button className={'w-full !bg-logseq-700/70 !justify-center'}>
                  <div className="flex items-center space-x-2">
                    <UserCirclePlus weight={'duotone'} size={20}/>
                    <span>Create a Logseq account</span>
                    <strong className="dark-flag">Free</strong>
                    <SignIn size={20} className={'opacity-50'}/>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="pro as-pro-card as-pro-border">
            <div className="th">
              <strong className={'pro-flag'}>PRO</strong>
              <h1>Unlock advanced syncing and more</h1>
            </div>
            <div className="bd">
              <h2 className={'flex items-baseline'}>
                $10 <small className={'pl-1 font-normal text-2xl text-pro-200'}>/ month</small>
              </h2>
              <ul className={'text-pro-200'}>
                <li>
                  <CheckSquare weight={'duotone'}/>
                  <span>10 synced graphs (up to 10GB each)</span>
                </li>
                <li>
                  <CheckSquare weight={'duotone'}/>
                  <span>Sync assets up to 100MB per file</span>
                </li>
                <li>
                  <Cube weight={'duotone'}/>
                  <span>Early access to beta features</span>
                </li>
              </ul>

              <div className="flex justify-center pt-6 pb-3">
                <Button className={'w-full !bg-pro-500/60 !justify-center'}>
                  <div className="flex items-center space-x-2">
                    <Wallet weight={'duotone'} size={20}/>
                    <span>Subscribe to Logseq</span>
                    <strong className="light-flag">Pro</strong>
                    <SignIn size={20} className={'opacity-50'}/>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!appState.sm.get() &&
        (<section className={'qa-plan-section as-section'}>
          <h1>
            <b className={'ls'}>Get answers to</b>
            <strong>
              Frequently Asked Questions.
            </strong>
          </h1>

          <ul>
            {items.map(it => {
              return (
                <li key={it.title}>
                  <a onClick={() => {
                    if (foldedSet.has(it.title)) {
                      foldedSet.delete(it.title)
                    } else {
                      foldedSet.add(it.title)
                    }

                    setFoldSet(new Set(foldedSet))
                  }}>
                    {foldedSet.has(it.title) ?
                      (<Plus weight={'bold'} size={26}/>) :
                      (<Minus weight={'bold'} size={26}/>)
                    }

                  </a>
                  <h1>{it.title}</h1>
                  {!foldedSet.has(it.title) && (<h2>{it.desc}</h2>)}
                </li>
              )
            })}
          </ul>
        </section>)}

      <div className="page-inner footer-desc">
        <section className="app-landing-footer-desc">
          <LandingFooterDesc hideFeaturesSection={true}/>
        </section>
      </div>
    </div>
  )
}

function FooterSection () {
  return (
    <div className="page-inner-full-wrap relative pt-30">
      <div className="page-inner footer-nav">
        <div className="page-inner">
          <LandingFooterNav/>
        </div>
      </div>
    </div>
  )
}

export function ProPage () {
  const appState = useAppState()

  return (
    <div className={'app-page logseq-pro'}>
      <ProInfoSection/>
      {!appState.sm.get() && <TweetsSection/>}
      <ChoosePlanSection/>
      <FooterSection/>
    </div>
  )
}