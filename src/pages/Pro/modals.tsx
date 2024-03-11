import {
  ArrowSquareOut,
  CaretLeft,
  Check, CheckSquareOffset, CopySimple,
  IdentificationBadge,
  Info, PaperPlaneTilt,
  Student,
  UserCirclePlus
} from '@phosphor-icons/react'
import copy from 'copy-to-clipboard'
import { Dropdown } from '../../components/Dropdown'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../state'

export const discountStudentEmailTemplate = {
  subject: 'Logseq Pro Student Discount Request',
  body: `
Instructions from the Logseq Team:

Thank you for wanting to use Logseq Pro! Students and educational professionals can apply for a 50% discount on the monthly or annual Logseq Pro plan. 
To receive a discount coupon, please follow the steps below and answer the questions:
Attach a photo/scan of your school ID. Please hide any personal information, but clearly show both your name and the expiry/validity date of the ID.

1. What is your full name?
2. What is your school's name?
3. What is your Logseq username?
4. What is your email address (the one you used to sign up for Logseq Pro)?
 
Please answer all questions and attach a photo/scan of your school ID.
Talk to you soon!

— The Logseq team
  `
}

export function UnlockStudentDiscount (props: any) {
  const { close } = props || {}
  const navigate = useNavigate()
  const appState = useAppState()
  const supportEmail = 'support@logseq.com'
  const isLogged = !!appState.value.userInfo?.username

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
          <section>
            <h3>Create a Logseq account</h3>
            <span className={'text-sm'}>
              <span>Start by setting up your Logseq account at </span>
              <a className={'underline cursor-pointer'}
                 onClick={() => {
                   close()
                   navigate('/login')
                 }}
              >https://logseq.com/login</a>.
            </span>

            <blockquote
              className={'flex items-center space-x-2 text-sm bg-logseq-900/70 px-2 py-2 mt-2 mb-3 tracking-wide'}>
              <Info size={16}/>
              <span className={'flex-1'}>Using a university email during this step speeds up your student discount approval.</span>
            </blockquote>

            <button className={'as-button'}
                    onClick={() => {
                      if (!isLogged) navigate('/login?t=create')
                      if (isLogged) navigate('/account')
                      close()
                    }}>
              {isLogged ?
                (<>
                  <CheckSquareOffset size={17} weight={'bold'}/>
                  <span className={'mx-2 flex-1'}>Logged as <code>{appState.value.userInfo.attributes?.email}</code></span>
                </>) :
                (
                  <>
                    <UserCirclePlus size={18} weight={'duotone'}/>
                    <span className={'mx-2'}>Sign up</span>
                  </>
                )
              }

              <code
                className={'bg-pro-900 text-xs py-1 px-1.5 rounded leading-none opacity-70 font-semibold'}>FREE</code>
            </button>
          </section>
        </li>

        <li>
          <strong>2</strong>
          <section>
            <h3>Request your discount</h3>
            <div className={'sm:flex sm:space-x-6 pt-2'}>
              <div className="as-card flex-1">
                <h3>Already used a school email address for sign-up?</h3>
                <h4>Simply email us directly from that school/university email address to request your discount. Make
                  sure to also mention the username you chose for your Logseq account.</h4>

                <Dropdown>
                  <button
                    className="as-button !cursor-pointer"
                    onClick={() => window.open(`mailto://${supportEmail}?subject=${encodeURIComponent(discountStudentEmailTemplate.subject)}&body=${encodeURIComponent(discountStudentEmailTemplate.body)}`)}
                  >
                    <Student size={15} weight={'duotone'}/>
                    <span>Email with university address</span>
                    <ArrowSquareOut className={'opacity-60'} weight={'bold'}/>
                  </button>
                </Dropdown>
              </div>

              <div className="as-card flex-1">
                <h3>Signed up with a non-educational email address?</h3>
                <h4>Email us a clear picture or scan of your valid student ID or other proof of student status. Mention
                  both the email address and username you used for your Logseq account.</h4>

                <Dropdown
                  items={[{
                    text: (
                      <div className="flex items-center">
                        <div className="flex pr-2">
                          <span className={'bg-black w-8 h-8 flex items-center justify-center rounded'}>
                            <PaperPlaneTilt size={20} weight={'duotone'}/>
                          </span>
                        </div>

                        <div className={'w-full flex flex-col opacity-80'}>
                          <span className="text-sm">
                            Open email client
                          </span>
                          <span className="text-[11px] opacity-60 leading-[14px]">
                            Use our pre-filled template to request your student discount
                          </span>
                        </div>
                      </div>
                    ),
                    props: {
                      href: `mailto://${supportEmail}?subject=${encodeURIComponent(discountStudentEmailTemplate.subject)}&body=${encodeURIComponent(discountStudentEmailTemplate.body)}`
                    }
                  },
                    {
                      text: (
                        <div className="flex items-center">
                          <div className="flex pr-2">
                            <span className={'bg-black w-8 h-8 flex items-center justify-center rounded'}>
                              <CopySimple size={20} weight={'duotone'}/>
                            </span>
                          </div>

                          <div className={'w-full flex flex-col opacity-80'}>
                          <span className="text-sm">
                            Copy support email address
                          </span>
                            <span className="text-[11px] opacity-60 leading-[14px]">
                             Paste it into your preferred email platform and send your request
                            </span>
                          </div>
                        </div>
                      ),
                      props: {
                        onClick () {
                          copy(supportEmail)
                          toast('copied!')
                        }
                      }
                    }]}
                >
                  <button className="as-button logseq">
                    <IdentificationBadge size={15} weight={'duotone'}/>
                    <span>Email with university address</span>
                    <span className={'icon-caret'}>
                      <CaretLeft className={'opacity-60'} weight={'bold'}/>
                    </span>
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
          </section>
        </li>
        <li>
          <strong><Check size={24} weight={'bold'}/></strong>
          <p className={'leading-5 tracking-wide pt-1 pl-5'}>
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
