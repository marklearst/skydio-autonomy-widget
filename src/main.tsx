import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AutonomyWidget, AutonomyWidgetProvider } from './components/AutonomyWidget'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="min-h-dvh flex items-center justify-center bg-surface p-6">
      <AutonomyWidgetProvider
        initialState={{
          action: 'waypoint-mission',
          time: 90,
        }}>
        <AutonomyWidget />
      </AutonomyWidgetProvider>
    </main>
  </StrictMode>,
)
