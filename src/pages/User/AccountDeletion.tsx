import { Link } from 'react-router-dom'

export function AccountDeletionPage() {
  return (
    <div className="app-page app-terms">
      <div className="logseq-terms-content page-inner">
        <h1>Request deletion of your Logseq account</h1>
        <p>You can request that Logseq, Inc. delete your account and its associated data.</p>
        <ol>
          <li>Email <a href="mailto:support@logseq.com?subject=Logseq%20account%20deletion">support@logseq.com</a> from the address you use to sign in to Logseq.</li>
          <li>Ask us to delete your Logseq account and the data associated with it. Please do not include your password or any verification codes.</li>
          <li>Our support team will verify your account ownership and confirm your request before processing it.</li>
        </ol>
        <h2>What happens to your data</h2>
        <p>Account deletion removes your Logseq sign-in and associated data stored by Logseq. Any data we must retain is handled as described in our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
      </div>
    </div>
  )
}
