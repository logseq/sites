import React, { ReactElement } from 'react'
import cx from 'classnames'

type MenuDataItem = {
  key: string | number
  text?: string | ReactElement
  type?: string
  props?: Record<string, any>

  render?: ((e?: any) => ReactElement) | ReactElement
}

export const Dropdown = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { className, children, wrapItems, items, ...rest } = props
  const wrapSubItems = (children: ReactElement) => (
    (wrapItems === false ? children :
      <div className="sub-items flex flex-col absolute top-5 right-0 w-full pt-6">
        <div className="sub-items-inner">
          {children}
        </div>
      </div>))

  return (
    <div className={cx('ui-dropdown', className)}
         ref={ref}
         {...rest}
    >
      <span className="trigger">
        {children}
      </span>

      {React.isValidElement(items) ? wrapSubItems(items) :
        (items?.length > 0 &&
          wrapSubItems(
            items.map((it: MenuDataItem, idx: number) => {
              const { className, ...rest } = it.props

              if (it.render) return (
                <span key={it.key || idx} className={cx('ui-menu-item', className)} {...rest}>
                  {typeof it.render === 'function' ? (it.render(it)) : it.render}
                </span>)

              return (
                <a key={it.key || idx} className={cx('block ui-menu-item', className)} {...rest}>
                  {it.text}
                </a>
              )
            })))}
    </div>
  )
})