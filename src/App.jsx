import './App.css'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { TypeProvider } from './contexts/TypeContext.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GlobalButtonStyles } from './components/common/GlobalButtonMotion'

function App() {
  return (
    <AuthProvider>
      <TypeProvider>
        <GlobalButtonStyles/>
        <Outlet />
      </TypeProvider>
    </AuthProvider>
  )
}

export default App
