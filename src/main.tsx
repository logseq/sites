import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { AuthenticatorProvider } from '@aws-amplify/ui-react-core'

const root = createRoot(document.querySelector('#root')!)

root.render(
  <BrowserRouter>
    <AuthenticatorProvider>
      <App/>
    </AuthenticatorProvider>
  </BrowserRouter>,
)
