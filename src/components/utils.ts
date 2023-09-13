import React from 'react'
import cx from 'classnames'
import Cookie from 'js-cookie'

export type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;

export type Dict<T = any> = Record<string, T>;

export type StringOrNumber = string | number;

export function isNumber (value: any): value is number {
  return typeof value === 'number'
}

export function isArray<T> (value: any): value is Array<T> {
  return Array.isArray(value)
}

export function isFunction (value: any): value is Function {
  return typeof value === 'function'
}

export const isObject = (value: any): value is Dict => {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function') && !isArray(value)
}

export const isNull = (value: any): value is null => value == null

export function isDateValid (value: number | string | Date) {
  // @ts-ignore
  return !isNaN(new Date(value))
}

export function callAll (...fns: any[]) {
  return function mergedFn (...args: any[]) {
    fns.forEach((fn) => {
      if (isFunction(fn)) {
        fn?.(...args)
      }
    })
  }
}

export function mergeProps<T extends Dict[]> (...args: T) {
  const result: Dict = {}

  for (const props of args) {
    for (const key in result) {
      if (/^on[A-Z]/.test(key) && typeof result[key] === 'function' && typeof props[key] === 'function') {
        result[key] = callAll(result[key], props[key])
      } else if (key === 'className' && typeof result.className === 'string' && typeof props.className === 'string') {
        result[key] = cx(result.className, props.className)
      } else {
        result[key] = props[key] !== undefined ? props[key] : result[key]
      }
    }

    // Add props from b that are not in a
    for (const key in props) {
      if (result[key] === undefined) {
        result[key] = props[key]
      }
    }
  }

  return result
}

export const openLiveDemo = () => {
  Cookie.set(`spa`, '1', { expires: 7 })
  setTimeout(() => window.location.reload(), 500)
}

export function slugify (input: string | undefined) {
  return input?.replace(/\W/g, '_')
}

export function navigateTabs (event: React.KeyboardEvent) {
  const target = event.target as HTMLElement
  const key = event.key
  const tabs = Array.prototype.slice.call(target?.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]'))
  let index = tabs.indexOf(target)

  if (key.includes('Arrow')) {
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        index = index > 0 ? index - 1 : tabs.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        index = index < tabs.length - 1 ? index + 1 : 0
        break
    }

    tabs[index].click()
    tabs[index].focus()
    event.preventDefault()
  }
}

export function scrollToTop () {
  document.documentElement.scrollTop = 0
}