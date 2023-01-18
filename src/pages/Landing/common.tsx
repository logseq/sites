import cx from 'classnames'

// @ts-ignore
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js'

export const imageS1: any = new URL('./assets/tutorials-1.png', import.meta.url)
export const imageLogo: any = new URL('./assets/logo2.png', import.meta.url)
export const imageLogoDots: any = new URL('./assets/logo-dots.svg', import.meta.url)
export const imageProductHuntLogo: any = new URL('./assets/product_hunt_logo.png', import.meta.url)

export function FloatGlassButton (
  props: any,
) {
  const { href, children, className, ...rest } = props

  if (href) {
    rest.onClick = () => {
      window?.open(
        href, '_blank'
      )
    }
  }

  return (
    <div className={cx('glass-btn', className)} {...rest}>
      {children}
    </div>
  )
}

export function AppLogo (
  props: any
) {
  const { className, ...rest } = props

  return (
    <span className={cx('app-logo', className)} {...rest}>
      <img src={imageLogo} alt="Logseq"/>
    </span>
  )
}

export function AppLogoEmbossed (
  props: any
) {
  const { className, ...rest } = props

  return (
    <span className={cx('app-logo-embossed', className)} {...rest}>
      <svg width="49" height="46" viewBox="0 0 49 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse rx="7.02369" ry="4.42793" transform="matrix(0.988865 -0.148815 0.0688008 0.99763 27.0473 6.96687)" fill="#85C8C8"/>
        <ellipse rx="6.30029" ry="7.20225" transform="matrix(-0.495846 0.86841 -0.825718 -0.564084 9.07103 10.4006)" fill="#85C8C8"/>
        <ellipse rx="16.609" ry="13.0775" transform="matrix(0.987073 0.160274 -0.239143 0.970984 28.5105 29.9736)" fill="#85C8C8"/>
      </svg>
    </span>
  )
}
  

export function openLightbox (
  sources: Array<{ src: string, width: number, height: number }>,
  index: number = 0,
) {
  const lightbox = new PhotoSwipeLightbox({
    dataSource: sources,
    wheelToZoom: true,
    pswpModule: () => import('photoswipe'),
  })

  lightbox.init()
  lightbox.loadAndOpen(index)
}
