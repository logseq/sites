import './index.css'
import cx from 'classnames'
import {
  ArrowSquareOut,
  CircleWavyQuestion,
  Database,
  FileCloud,
  Files,
  LockKeyOpen,
  Notebook,
  ShieldStar,
  Stack,
  Student, TwitterLogo
} from 'phosphor-react'

function ProCard ({ children, className, ...rest }: any) {
  return (
    <div className={cx('ui-pro-card', className)} {...rest}>
      {children}
    </div>
  )
}

function ProInfoSection () {
  return (
    <section className={'pro-info'}>
      {/*head text*/}
      <div className={'flex flex-col items-center pt-12 z-10 font-bold'}>
        <h1 className={'text-6xl flex items-center'}>
          Experience <b className={'ml-4'}>the benefits of</b>
          <strong className={'pro-flag'}>PRO</strong>
          <b>.</b></h1>
        <h2 className={'text-4xl font-medium'}>
          <b>Boost your</b> workflows and creativity across all devices.</h2>
      </div>

      {/*price card*/}
      <div className={'flex pt-14 space-x-6 z-10 relative pb-[190px]'}>
        <ProCard className={'plans-card a flex-col flex-1'}>
          <i><FileCloud size={38} weight={'duotone'}/></i>
          <h1 className={'text-4xl'}>
            <b>Enjoy</b> advanced <br/> syncing options.
          </h1>
          <h2 className={'text-xl'}>
            <b>Benefit from our</b> smart merging system for seamless syncing,
            <b className={'ml-2'}>as well as</b> expanded storage and larger <br/>asset support
            <b className={'ml-2'}>across all devices.</b>
          </h2>
          <h3 className={'flex items-center bg-pro-900/90 rounded-lg mt-4 py-2 px-4 leading-none'}>
            <ShieldStar weight={'duotone'} size={32}/>
            <span className={'text-xl ml-2 font-medium'}>
              Always end-to-end encrypted
              <b className={'font-normal ml-2'}>on all plans.</b>
            </span>
          </h3>
        </ProCard>

        <ProCard className={'plans-card b flex-1'}>
          <i><LockKeyOpen size={38} weight={'duotone'}/></i>
          <h1 className={'text-4xl'}>
            <b>Get</b> early access to <br/>cutting-edge features.
          </h1>
          <h2 className={'text-xl'}>
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
        <a className="compare-btn">
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

export function ProPage () {
  return (
    <div className={'app-page logseq-pro'}>
      <ProInfoSection/>
      <TweetsSection/>
    </div>
  )
}
