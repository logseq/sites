import { CaretLeft, Check, IdentificationBadge, Info, Student, UserCirclePlus } from 'phosphor-react'
import { Dropdown } from '../../components/Dropdown'

export function UnlockStudentDiscount () {
  return (
    <div className={'app-unlock-student-discount text-logseq-50 py-4 px-2'}>
      <h1 className={'text-4xl tracking-wide'}>
        <b>Unlock</b> your student discount.
      </h1>

      <h2 className={'text-xl leading-7 py-4 tracking-wide'}>
        <b>Maximize your academic potential with 50% off Logseq Pro. </b>
        If you’re <br/> currently studying at a high school or university,
        here’s how you can take advantage:
      </h2>

      <ul>
        <li>
          <strong>1</strong>
          <p>
            <h3>Create a Logseq account</h3>
            <span className={'text-sm'}>
              <span>Start by setting up your Logseq account at </span>
              <a className={'underline'} href={'https://logseq.com/login'}>Logseq.com/login</a>.
            </span>

            <blockquote
              className={'flex items-center space-x-2 text-sm bg-logseq-900/70 px-2 py-2 mt-2 mb-3 tracking-wide'}>
              <Info/>
              <span>Using a university email during this step speeds up your student discount approval.</span>
            </blockquote>

            <button className={'as-button'}>
              <UserCirclePlus size={18} weight={'duotone'}/>
              <span className={'mx-2'}>Sign up</span>
              <code
                className={'bg-pro-900 text-xs py-1 px-1.5 rounded leading-none opacity-70 font-semibold'}>FREE</code>
            </button>
          </p>
        </li>
        <li>
          <strong>2</strong>
          <p>
            <h3>Request your discount</h3>
            <div className={'flex space-x-6 pt-2'}>
              <div className="as-card flex-1">
                <h3>Already used a school email address for sign-up?</h3>
                <h4>Simply email us directly from that school/university email address to request your discount. Make
                  sure to also mention the username you chose for your Logseq account.</h4>

                <Dropdown
                  items={<h1 className={'text-xl'}>Hello</h1>}
                >
                  <button className="as-button">
                    <Student size={15} weight={'duotone'}/>
                    <span>Email with university address</span>
                    <CaretLeft className={'opacity-60'} weight={'bold'}/>
                  </button>
                </Dropdown>
              </div>

              <div className="as-card flex-1">
                <h3>Signed up with a non-educational email address?</h3>
                <h4>Email us a clear picture or scan of your valid student ID or other proof of student status. Mention
                  both the email address and username you used for your Logseq account.</h4>

                <Dropdown>
                  <button className="as-button logseq">
                    <IdentificationBadge size={15} weight={'duotone'}/>
                    <span>Email with university address</span>
                    <CaretLeft className={'opacity-60'} weight={'bold'}/>
                  </button>
                </Dropdown>
              </div>
            </div>
            <div className="py-2">
              <h4 className={'text-gray-200 pt-4'}>Please note:</h4>
              <ul className={'list-disc ml-1 pt-2 text-sm pl-4'}>
                <li>
                  Ensure your ID displays a visible expiry date.
                </li>
                <li>
                  Feel free to blur out any sensitive information (beside your name and the university name); <br/>
                  we only need to verify your student status.
                </li>
              </ul>
            </div>
          </p>
        </li>
        <li>
          <strong><Check size={24} weight={'bold'}/></strong>
          <p className={'leading-5 tracking-wide pt-1'}>
            <strong className={'text-sm font-semibold text-gray-200'}>
              Once your status is verified, we’ll provide you with a unique discount code.
            </strong> <br/>
            <span
              className={'text-sm opacity-80'}>Use this code when subscribing to Logseq Pro to get the discount.</span>
          </p>
        </li>
      </ul>
    </div>)
}
