import { Authenticator, CheckboxField, useAuthenticator, AccountSettings } from '@aws-amplify/ui-react'
import { useAppState, useProState } from '../../state'
import { Auth } from 'aws-amplify'

function LSAuthenticator ({ termsLink, children }: any) {
  return (<div>
    <Authenticator
      formFields={{
        signUp: {
          email: { order: 1 },
          username: { order: 2 },
          password: { order: 3 },
          confirm_password: { order: 4 },
        }
      }}
      loginMechanisms={['username']}
      socialProviders={['google']}
      components={{
        SignUp: {
          FormFields () {
            const { validationErrors } = useAuthenticator()

            return (
              <>
                {/* Re-use default `Authenticator.SignUp.FormFields` */}
                <Authenticator.SignUp.FormFields/>

                {/* Append & require Terms & Conditions field to sign up  */}
                <CheckboxField
                  errorMessage={validationErrors.acknowledgement as string}
                  hasError={!!validationErrors.acknowledgement}
                  name="acknowledgement"
                  value="yes"
                  label={(<a href={termsLink}>I agree with the Terms & Conditions</a>)}
                />
              </>
            )
          },
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
    </Authenticator>
  </div>)
}

function LSAuthenticatorChangePassword (
  { onSuccess, onError }: any
) {
  return (
    <AccountSettings.ChangePassword onSuccess={onSuccess} onError={onError}/>
  )
}

export function LoginPane () {
  const appState = useAppState()

  return (
    <div className={'login-pane'}>
      <LSAuthenticator>
        {({ user }: any) => {
          if (user?.username && user?.pool) {
            appState.userInfo.set({
              signOut: async () => {
                console.time()
                appState.userInfo.pending.set(true)
                await Auth.signOut()
                appState.userInfo.pending.set(false)
                console.timeEnd()
                appState.userInfo.set({} as any)
              }, username: user.username,
              signInUserSession: user.signInUserSession,
              attributes: user.attributes,
              pending: false
            })
          }
        }}
      </LSAuthenticator>
    </div>)
}