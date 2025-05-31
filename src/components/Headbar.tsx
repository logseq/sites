import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { ArrowSquareOut, List, X } from '@phosphor-icons/react'
import { ReactElement, useEffect, useState } from 'react'
import { WrapGlobalDownloadButton } from '../pages/Downloads'
import cx from 'classnames'

const logo: any = new URL('/assets/logo-with-border.png', import.meta.url)

export function LinksGroup(
  props: {
    items: Array<{ link: string, label: string | ReactElement, icon?: ReactElement }>,

    [k: string]: any
  },
) {
  const { items, className, ...rest } = props

  return (
    <ul className={cx('links-group sm:ml-6 h-full', className)}
        {...rest}
    >
      {items.map(it => {
        const inner = (
          <>
            {it.label}
            {it.icon && <>
              <span className={'pl-2 opacity-40 group-hover:opacity-80'}>{it.icon}</span>
              <span className="sr-only"> (opens a new window)</span>
            </>}
          </>)

        return (
          <li className={'flex items-center'}
              key={it.label.toString()}
              data-link={it.link?.toString().toLowerCase()}
          >
            {it.link.startsWith('http')
              ?
              <a href={it.link} target={'_blank'}
                 className={'h-full flex items-center group transition-colors'}>{inner}</a>
              :
              <NavLink
                to={it.link}
                className={({ isActive }) => {
                  return cx('h-full flex items-center group transition-colors',
                    isActive && 'app-link-active')
                }}>{inner}</NavLink>
            }

          </li>
        )
      })}
    </ul>
  )
}

export function Headbar() {
  const [rightActive, setRightActive] = useState(false)
  const [urlParams] = useSearchParams()

  // without header
  if (urlParams.has('x')) return

  useEffect(() => {
    const outsideHandler = (e: MouseEvent) => {
      const target = e.target as any
      const isToggle = !!target.closest('a.nav-toggle')

      if (isToggle) {
        return setRightActive(!rightActive)
      }

      rightActive && setRightActive(false)
    }

    document.body.addEventListener('click', outsideHandler)

    return () => {
      document.body.removeEventListener('click', outsideHandler)
    }
  }, [rightActive])

  useEffect(() => {
    if (rightActive) {
      document.body.classList.add('is-nav-open')
    } else {
      document.body.classList.remove('is-nav-open')
    }
  }, [rightActive])

  const leftLinks = [
    { label: 'Home', link: '/' },
    // {
    //   label: (<>
    //     <span>Pro</span>
    //     <sup className={'pl-1 opacity-90 group-hover:opacity-100 text-xs font-medium text-pro-500'}>New</sup>
    //   </>), link: '/pro'
    // },
    { label: 'Downloads', link: '/downloads' },
  ]

  const rightLinks = [
    {
      label: 'Forum',
      link: 'https://discuss.logseq.com',
      icon: <ArrowSquareOut size={15} weight={'bold'}/>,
    },
    {
      label: 'Docs',
      link: 'https://docs.logseq.com/',
      icon: <ArrowSquareOut size={15} weight={'bold'}/>,
    },
    {
      label: 'Github',
      link: 'https://github.com/logseq',
      icon: <ArrowSquareOut size={15} weight={'bold'}/>,
    },
    {
      label: 'Blog',
      link: 'https://blog.logseq.com',
      icon: <ArrowSquareOut size={15} weight={'bold'}/>,
    },
  ]

  return (
    <div className={'app-headbar h-14 flex justify-center'}>
      <div className={'flex items-center justify-between w-full'}>
        <div className={'flex items-center h-full flex-1'}>
          <Link to={'/'} className={'app-logo-link mr-2'} aria-label={`Home`}>
            <img src={logo} alt={'Logseq'}/>
          </Link>

          <LinksGroup
            className={'justify-center sm:justify-start'}
            items={leftLinks}/>
        </div>

        <div className={cx('right-group flex items-center h-full', {
          ['is-active']: rightActive
        })}>
          <a className={'nav-toggle flex h-full items-center sm:hidden'}>
            {rightActive ?
              <X size={24} weight={'bold'}></X> :
              <List size={24} weight={'bold'}></List>}
          </a>

          <div className={'right-group-inner'}>
            <LinksGroup
              className={'justify-center space-x-2 py-6 w-full mx-1 border-t border-t-logseq-500 sm:mr-0'}
              items={rightLinks}
            />

            {/*Downloads select*/}
            <div className="downloads-select mt-2 sm:ml-8 sm:mt-0">
              <WrapGlobalDownloadButton>
                {({ active, rightIconFn, leftIconFn }: any) => {

                  return (
                    <button
                      className={'flex items-center bg-sky-700 px-2 py-1 rounded text-sm hover:opacity-80 select-none cursor-pointer'}>
                      {typeof leftIconFn === 'function'
                        ? leftIconFn({ weight: 'bold' })
                        : leftIconFn}
                      <span className={'pl-2'}>Download for {active?.[0]}</span>
                      {rightIconFn?.()}
                    </button>
                  )
                }}
              </WrapGlobalDownloadButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
