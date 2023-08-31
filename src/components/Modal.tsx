import cx from 'classnames'
import { XCircle } from 'phosphor-react'
import { useRef } from 'react'

export function Modal (props: any) {
  const { id, visible, destroy, className, children, onClick, ...rest } = props
  const refInner = useRef<HTMLDivElement>()

  return (
    <div className={cx('ls-modal', className, visible ? '' : 'hidden')}
         onClick={({ target }) => {
           if (target && refInner.current?.contains(target as any)) {
             return
           }

           destroy()
         }}

         {...rest}>
      <div className={'ls-modal-inner'} ref={refInner}>
        <div className={'ls-modal-content'}>
          {children}
        </div>
        <a className={'ls-modal-close'}
           onClick={destroy}
        >
          <XCircle size={30} weight={'duotone'}/>
        </a>
      </div>
    </div>
  )
}