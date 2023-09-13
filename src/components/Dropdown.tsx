import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

type MenuDataItem = {
  key: string | number
  text?: string | ReactElement
  type?: string
  props?: Record<string, any>

  render?: ((e?: any) => ReactElement) | ReactElement
}

export const Dropdown = React.forwardRef<HTMLDivElement, Partial<{
  items: Array<MenuDataItem>,
  [k: string]: any
}>>((props, ref) => {
  const { className, children, wrapItems, subItemClassName, items, triggerType, ...dropdownProps } = props
  const triggerProps: any = {}
  const [active, setActive] = useState(false)

  ref = ref || useRef<HTMLDivElement>(null)

  if (triggerType === 'click') {
    triggerProps.clickable = true
    triggerProps.onClick = () => setActive(!active)

    const _onClick = dropdownProps.onClick

    dropdownProps.onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target?.closest('.sub-items')) return
      setActive(false)
      _onClick?.(e)
    }
  } else {
    dropdownProps.onMouseEnter = () => setActive(true)
    dropdownProps.onMouseLeave = () => setActive(false)
  }

  // outside click effect
  useEffect(() => {
    const host = document.documentElement
    const handler = (e: MouseEvent) => {
      const target = e.target
      // @ts-ignore
      if (ref?.current?.contains(target)) return
      setActive(false)
    }

    if (triggerProps.clickable) {
      host.addEventListener('mouseup', handler, false)
    } else {
      host.removeEventListener('mouseup', handler)
    }

    return () => host.removeEventListener('mouseup', handler)
  }, [triggerProps.clickable])

  const wrapSubItems = (children: ReactElement) => (
    (wrapItems === false ? children :
      <div
        className={cx('sub-items flex flex-col absolute top-5 right-0 w-full',
          (triggerProps.clickable ? 'mt-6' : 'pt-6'), subItemClassName)}>
        <div className="sub-items-inner">
          {children}
        </div>
      </div>))

  return (
    <div className={cx('ui-dropdown', className, active && 'is-active')}
         ref={ref}
         {...dropdownProps}
    >
      <span className="trigger"
            {...triggerProps}
      >
        {children}
      </span>

      {React.isValidElement(items) ? wrapSubItems(items) :
        (items?.length > 0 &&
          wrapSubItems(
            items.map((it: MenuDataItem, idx: number) => {
              const { className, ...rest } = it.props || {}

              if (it.render) return (
                <span key={it.key || idx} className={cx('ui-menu-item', className)} {...rest}>
                  {typeof it.render === 'function' ? (it.render(it)) : it.render}
                </span>)

              return (
                <a key={it.key || idx} className={cx('block ui-menu-item', className)} {...rest}>
                  {it.text}
                </a>
              )
            }) as any))}
    </div>
  )
})