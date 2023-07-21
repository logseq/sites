import './index.css'
import { GithubLogo } from 'phosphor-react'

export function ProPage () {
  return (
    <div className={'app-page logseq-pro'}>
      <h1 className={'pt-40 text-3xl flex space-x-3 items-center'}>
        <strong> Hello, Logseq Pro </strong>
        <GithubLogo weight={'duotone'} size={30}/>
      </h1>
    </div>
  )
}