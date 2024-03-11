import cx from 'classnames'
import { XCircle } from '@phosphor-icons/react'
import { useRef } from 'react'

export function Modal (props: any) {
  const { id, visible, destroy, className, hasClose, children, onClick, ...rest } = props
  const refInner = useRef<HTMLDivElement>()

  return (
    <div className={cx('ui-modal', className, visible ? '' : 'hidden')}
         onClick={({ target }) => {
           if (target && refInner.current?.contains(target as any)) {
             return
           }

           destroy()
         }}

         {...rest}>
      <div className={'ui-modal-inner'} ref={refInner}>
        <div className={'ui-modal-content'}>
          {children}
        </div>

        {(hasClose !== false) && (
          <a className={'ui-modal-close'}
             onClick={destroy}
          >
            <XCircle size={30} weight={'duotone'}/>
          </a>
        )}
      </div>
    </div>
  )
}