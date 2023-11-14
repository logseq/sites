import { LandingFooterNav } from '../Landing'

export function PrivacyPolicyPage() {
  const privacyPolicyUrl = '/public/privacy_policy.html'

  return (
    <div className="app-page app-terms">
      <div className="logseq-iframe-content page-inner">
        <iframe src={privacyPolicyUrl}/>
      </div>
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