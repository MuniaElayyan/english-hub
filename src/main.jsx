import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LangProvider } from './i18n'
import { LibraryProvider } from './library'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
