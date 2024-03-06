// @ts-ignore
import termsHTML from './terms.md'
import { LandingFooterNav } from '../Landing'

export function TermsContent() {
  return (
    <div className="logseq-terms-content page-inner"
         dangerouslySetInnerHTML={{ __html: termsHTML }}
    ></div>)
}

export function TermsPage() {
  return (
    <div className="app-page app-terms">
      {TermsContent()}

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