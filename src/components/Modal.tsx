import cx from 'classnames'
import { XCircle } from 'phosphor-react'

export function Modal (props: any) {
  let { id, visible, destroy, className, children, ...rest } = props

  return (
    <div className={cx('ls-modal', className, visible ? '' : 'hidden')} {...rest}>
      <div className={'ls-modal-inner'}>
        <div className={'ls-modal-content'}>
          {children}
        </div>
        <a className={'ls-modal-close'}
           onClick={destroy}
        >
          <XCircle size={26} weight={'duotone'}/>
        </a>
      </div>
    </div>
  )
}