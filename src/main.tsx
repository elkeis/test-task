import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { MoviePostersProvider } from './movie-posters/context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoviePostersProvider>
      {() =>
        <App />
      }
    </MoviePostersProvider>
  </React.StrictMode>,
)
