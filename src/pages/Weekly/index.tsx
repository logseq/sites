import { ArrowSquareOut } from '@phosphor-icons/react'
import { LandingFooterNav } from '../Landing'
import weeklyData from './weekly.json'

const MAX_ITEMS = 10

type WeeklyItem = {
  title?: string
  summary?: string
  link?: string
  tags?: string[]
  category?: string
  priority?: number
}

type WeeklyFile = {
  _note?: string
  weekStart?: string
  weekEnd?: string
  updatedAt?: string
  items?: WeeklyItem[]
}

const data = weeklyData as WeeklyFile

function parseYmd (value?: string): Date | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) return null
  return date
}

function formatWeekRange (startIso?: string, endIso?: string): string {
  const start = parseYmd(startIso)
  const end = parseYmd(endIso)
  const monthDay = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' })
  const monthDayYear = new Intl.DateTimeFormat('en', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  if (start && end) {
    const sameYear = start.getFullYear() === end.getFullYear()
    const sameMonth = sameYear && start.getMonth() === end.getMonth()
    if (sameMonth) {
      return `${monthDay.format(start)}–${end.getDate()}, ${end.getFullYear()}`
    }
    if (sameYear) {
      return `${monthDay.format(start)} – ${monthDayYear.format(end)}`
    }
    return `${monthDayYear.format(start)} – ${monthDayYear.format(end)}`
  }

  if (start) return monthDayYear.format(start)
  if (end) return monthDayYear.format(end)
  return ''
}

function formatUpdated (iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function visibleHref (link?: string): string | null {
  if (!link) return null
  const href = link.trim()
  if (!href || href === '#') return null
  return href
}

function labelsFor (item: WeeklyItem): string[] {
  const labels: string[] = []
  if (item.category?.trim()) labels.push(item.category.trim())
  for (const tag of item.tags || []) {
    const text = tag?.trim()
    if (text && !labels.includes(text)) labels.push(text)
  }
  return labels
}

function WeeklyItemRow (props: { item: WeeklyItem }) {
  const { item } = props
  const href = visibleHref(item.link)
  const external = !!href && /^https?:\/\//i.test(href)
  const labels = labelsFor(item)
  const title = item.title?.trim() || ''

  const titleNode = href ? (
    <a
      href={href}
      className="inline-flex items-center gap-2 hover:text-white"
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {title}
      {external && (
        <>
          <ArrowSquareOut size={16} className="opacity-50" aria-hidden="true"/>
          <span className="sr-only"> (opens a new window)</span>
        </>
      )}
    </a>
  ) : title

  return (
    <li className="py-8 first:pt-0">
      {labels.length > 0 && (
        <p className="text-xs tracking-wide text-logseq-100/80">
          {labels.join(' · ')}
        </p>
      )}
      <h2 className="mt-2 text-xl font-medium tracking-wide text-gray-100 sm:text-2xl">
        {titleNode}
      </h2>
      {item.summary?.trim() && (
        <p className="mt-2 max-w-xl text-base leading-relaxed text-logseq-50/80">
          {item.summary.trim()}
        </p>
      )}
    </li>
  )
}

export function WeeklyPage () {
  const items = (Array.isArray(data.items) ? data.items : [])
    .filter(item => item && typeof item.title === 'string' && item.title.trim())
    .slice(0, MAX_ITEMS)
  const range = formatWeekRange(data.weekStart, data.weekEnd)
  const updated = formatUpdated(data.updatedAt)

  return (
    <div className="app-page pt-20">
      <article className="page-inner w-full px-6 pb-4 sm:px-10">
        <div className="mx-auto max-w-2xl pb-16 pt-10 sm:pb-24 sm:pt-20">
          <p className="text-sm tracking-wide text-logseq-100/80">Weekly</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-wide text-logseq-50 sm:text-5xl sm:leading-tight">
            What we worked on
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-logseq-50/80">
            A short list from the Logseq team. Not everything — just the few things worth knowing.
          </p>

          {(range || updated) && (
            <p className="mt-8 text-sm text-logseq-100/80">
              {range && <span>{range}</span>}
              {range && updated && <span className="px-2 opacity-50">·</span>}
              {updated && <span>Updated {updated}</span>}
            </p>
          )}

          {data._note && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-logseq-100/70">
              Sample page. These notes are placeholders, not a real week of work.
            </p>
          )}

          {items.length > 0 ? (
            <ul className="mt-12 divide-y divide-logseq-600/60">
              {items.map((item, index) => (
                <WeeklyItemRow item={item} key={`${item.title}-${index}`}/>
              ))}
            </ul>
          ) : (
            <p className="mt-14 text-base text-logseq-50/70">
              Nothing highlighted this week. Check back after the next update.
            </p>
          )}
        </div>
      </article>

      <div className="page-inner-full-wrap b relative">
        <div className="page-inner footer-nav">
          <div className="page-inner">
            <LandingFooterNav/>
          </div>
        </div>
      </div>
    </div>
  )
}
