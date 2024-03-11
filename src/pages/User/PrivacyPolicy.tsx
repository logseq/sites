// @ts-ignore
import html from './privacy_policy.md'
import { LandingFooterNav } from '../Landing'

export function PrivacyPolicyContent() {
  return (
    <div className="logseq-terms-content page-inner"
         dangerouslySetInnerHTML={{ __html: html }}
    ></div>)
}

export function PrivacyPolicyPage() {
  return (
    <div className="app-page app-terms">
      {PrivacyPolicyContent()}

      {/* global footer */}
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