import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Authenticator } from '@aws-amplify/ui-react'

const root = createRoot(document.querySelector('#root')!)

root.render(
  <BrowserRouter>
    <Authenticator.Provider>
      <App/>
    </Authenticator.Provider>
  </BrowserRouter>,
)
