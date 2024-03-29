import { Authenticator, CheckboxField, useAuthenticator, AccountSettings } from '@aws-amplify/ui-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { applyLoginUser } from '../../state'

function LSAuthenticator ({ termsLink, children }: any) {
  return (
    <Authenticator
      loginMechanisms={['username']}
      initialState={location.href.includes('t=create') ? 'signUp' : 'signIn'}
      socialProviders={['google']}
      components={{
        SignUp: {
          FormFields () {
            const { validationErrors } = useAuthenticator()

            return (
              <div>
                {/*Re-use default `Authenticator.SignUp.FormFields` */}
                <Authenticator.SignUp.FormFields/>

                {/*Append & require Terms & Conditions field to sign up  */}
                <CheckboxField
                  errorMessage={validationErrors.acknowledgement as string}
                  hasError={!!validationErrors.acknowledgement}
                  name="acknowledgement"
                  value="yes"
                  label={(<a href={termsLink}>I agree with the Terms & Conditions</a>)}
                />
              </div>
            )
          }
        },
      }}
      services={{
        async validateCustomSignUp (formData) {
          if (!formData.acknowledgement) {
            return {
              acknowledgement: '',
            }
          }
        }
      }}
    >
      {children}
    </Authenticator>)
}

function LSAuthenticatorChangePassword (
  { onSuccess, onError }: any
) {
  return (
    <AccountSettings.ChangePassword onSuccess={onSuccess} onError={onError}/>
  )
}

export function LoginContent () {
  const routeLocation = useLocation()
  const navigate = useNavigate()

  return (
    <div className={'login-pane'}>
      <LSAuthenticator>
        {({ user }: any) => {
          setTimeout(() => {
            applyLoginUser(user, { navigate, routeLocation, inComponent: true })
          }, 50)
        }}
      </LSAuthenticator>
    </div>)
}
