import './index.css'
import cx from 'classnames'
import { CircleWavyQuestion, FileCloud, Files, LockKeyOpen, Notebook, ShieldStar, Stack, Student } from 'phosphor-react'

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
      </div>

      <i className="bg"></i>
    </section>
  )
}

export function ProPage () {
  return (
    <div className={'app-page logseq-pro'}>
      <ProInfoSection/>
    </div>
  )
}
