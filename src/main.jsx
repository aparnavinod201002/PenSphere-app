import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'
import TokenAuth from './ContextAPI/TokenAuth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <TokenAuth>
    <App />
    </TokenAuth>
  
    </BrowserRouter>
  </StrictMode>,
)
