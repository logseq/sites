import { Authenticator, CheckboxField, useAuthenticator, AccountSettings } from '@aws-amplify/ui-react'

function LSAuthenticator ({ termsLink, children }: any) {
  return (
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
          // FormFieldsTODO () {
          //   const { validationErrors } = useAuthenticator()
          //
          //   return (
          //     <div>
          //       {/* Re-use default `Authenticator.SignUp.FormFields` */}
          //       <Authenticator.SignUp.FormFields/>
          //
          //       {/* Append & require Terms & Conditions field to sign up  */}
          //       <CheckboxField
          //         errorMessage={validationErrors.acknowledgement as string}
          //         hasError={!!validationErrors.acknowledgement}
          //         name="acknowledgement"
          //         value="yes"
          //         label={(<a href={termsLink}>I agree with the Terms & Conditions</a>)}
          //       />
          //     </div>
          //   )
          // },
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

export function LoginPane () {
  return (
    <div className={'login-pane'}>
      <LSAuthenticator>
        {({ user }: any) => {}}
      </LSAuthenticator>
    </div>)
}