import { useSearchParams } from 'react-router-dom'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { LandingFooterNav } from '../Landing'
import weeklyData from './weekly.json'

const MAX_ITEMS = 10
const MAX_WEEKS = 14

type WeeklyItem = {
  title?: string
  summary?: string
  link?: string
  tags?: string[]
  category?: string
  priority?: number
}

type WeeklyWeek = {
  weekStart?: string
  weekEnd?: string
  updatedAt?: string
  items?: WeeklyItem[]
}

type WeeklyFile = {
  weeks?: WeeklyWeek[]
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
  return 'Unknown week'
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

function weekKey (week: WeeklyWeek): string {
  return (week.weekStart || week.weekEnd || '').slice(0, 10)
}

function weeksFromFile (file: WeeklyFile): WeeklyWeek[] {
  const source = Array.isArray(file.weeks)
    ? file.weeks
    : (file.weekStart || file.weekEnd || file.items)
      ? [file]
      : []

  return source
    .filter(week => week && (week.weekStart || week.weekEnd))
    .slice()
    .sort((a, b) => weekKey(b).localeCompare(weekKey(a)))
    .slice(0, MAX_WEEKS)
}

function visibleHref (link?: string): string | null {
  if (!link) return null
  const href = link.trim()
  if (!href || href === '#') return null
  return href
}

function itemsFor (week?: WeeklyWeek): WeeklyItem[] {
  if (!week || !Array.isArray(week.items)) return []
  return week.items
    .filter(item => item && typeof item.title === 'string' && item.title.trim())
    .slice(0, MAX_ITEMS)
}

function WeeklyItemRow (props: { item: WeeklyItem }) {
  const title = props.item.title?.trim() || ''
  const summary = props.item.summary?.trim()
  const href = visibleHref(props.item.link)
  const external = !!href && /^https?:\/\//i.test(href)

  const body = (
    <>
      <span className="block text-lg font-medium leading-snug text-gray-100">
        {title}
        {external && (
          <ArrowSquareOut
            size={15}
            weight="bold"
            className="ml-1.5 inline-block translate-y-px opacity-40"
            aria-hidden="true"
          />
        )}
      </span>
      {summary && (
        <span className="mt-1.5 block text-base font-normal leading-relaxed text-logseq-50/80">
          {summary}
        </span>
      )}
    </>
  )

  if (!href) {
    return <li className="border-t border-white/10 py-5">{body}</li>
  }

  return (
    <li className="border-t border-white/10">
      <a
        href={href}
        className="block py-5 hover:text-white"
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {body}
        {external && <span className="sr-only"> (opens a new window)</span>}
      </a>
    </li>
  )
}

export function WeeklyPage () {
  const [searchParams, setSearchParams] = useSearchParams()
  const weeks = weeksFromFile(data)
  const requested = searchParams.get('week') || ''
  const selected = weeks.find(week => weekKey(week) === requested) || weeks[0]
  const items = itemsFor(selected)
  const range = selected ? formatWeekRange(selected.weekStart, selected.weekEnd) : ''
  const updated = formatUpdated(selected?.updatedAt)

  const onWeekChange = (key: string) => {
    const next = new URLSearchParams(searchParams)
    if (!key || key === weekKey(weeks[0] || {})) next.delete('week')
    else next.set('week', key)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="app-page pt-20">
      <article className="page-inner w-full px-5 pb-8 sm:px-10">
        <div className="mx-auto max-w-2xl pb-12 pt-8 sm:pb-20 sm:pt-16">
          <h1 className="text-3xl font-semibold tracking-wide text-logseq-50">
            Weekly
          </h1>

          {weeks.length > 0 && (
            <div className="mt-8">
              <label className="block text-sm text-logseq-100/80" htmlFor="weekly-week">
                Week
              </label>
              <select
                id="weekly-week"
                className="mt-2 w-full max-w-full rounded-md border border-logseq-500/70 bg-logseq-800 px-3 py-3 text-base text-gray-100 sm:max-w-sm [color-scheme:dark]"
                value={selected ? weekKey(selected) : ''}
                onChange={(event) => onWeekChange(event.target.value)}
              >
                {weeks.map(week => {
                  const key = weekKey(week)
                  return (
                    <option key={key} value={key}>
                      {formatWeekRange(week.weekStart, week.weekEnd)}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {updated && (
            <p className="mt-4 text-sm text-logseq-100/70">
              Updated {updated}
            </p>
          )}

          {items.length > 0 ? (
            <ul className="mt-8 border-b border-white/10">
              {items.map((item, index) => (
                <WeeklyItemRow item={item} key={`${item.title}-${index}`}/>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-base text-logseq-50/75">
              {range ? `Nothing from ${range}.` : 'Nothing here yet.'}
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
