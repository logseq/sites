import './index.css'
import { ReactElement } from 'react'
import cx from 'classnames'
import { FileCloud, LockKeyOpen } from 'phosphor-react'

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
      <div className={'flex pt-14 space-x-6 z-10'}>
        <ProCard className={'plans-card flex-col flex-1'}>
          <i><FileCloud size={38} weight={'duotone'}/></i>
          <h1 className={'text-4xl'}>
            <b>Enjoy</b> advanced <br/> syncing options.
          </h1>
          <h2 className={'text-xl'}>
            <b>Benefit from our</b> smart merging system for seamless syncing,
            <b className={'ml-2'}>as well as</b> expanded storage and larger <br/>asset support
            <b className={'ml-2'}>across all devices</b>.
          </h2>
        </ProCard>

        <ProCard className={'plans-card flex-1'}>
          <i><LockKeyOpen size={38} weight={'duotone'}/></i>
          <h1 className={'text-4xl'}>
            <b>Get</b> early access to <br/>cutting-edge features.
          </h1>
          <h2 className={'text-xl'}>
            <b>Be the first to upgrade your workflows with</b> exclusive <br/>access to beta features,
            <b className={'ml-2'}>helping shape the future of <br/>Logseq</b>.
          </h2>
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