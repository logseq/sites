import React, { ReactNode } from 'react'
import cx from 'classnames'

export interface ILSButtonProps extends Omit<React.ComponentPropsWithRef<'button'>, 'type'> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  href?: string
  asAnchor?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ILSButtonProps>((
  props, ref
) => {
  const { asAnchor, href, leftIcon, rightIcon, children, className, ...rest } = props
  const rootProps: any = {
    ref: ref,
    className: cx(
      'flex items-center justify-between text-base space-x-1 bg-logseq-400 rounded-lg py-3 px-4',
      'transition-opacity hover:opacity-80 active:opacity-100 disabled:hover:opacity-100',
      className),
  }

  if (href && !asAnchor) {
    rootProps.onClick = () => {
      window?.open(
        href, '_blank'
      )
    }
  }

  const inner = (
    <>
      <div className={'l flex items-center'}>
        {leftIcon && <i className={'pr-1.5'}>{leftIcon}</i>}
        <span>{children}</span>
      </div>

      {rightIcon && <i className={'pl-1'}>{rightIcon}</i>}
    </>
  )

  if (asAnchor) {
    return (
      <a href={href} {...(Object.assign(rootProps, rest))}>
        {inner}
      </a>)
  }

  return (
    <button {...(Object.assign(rootProps, rest))}>
      {inner}
    </button>
  )
})
