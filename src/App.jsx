import './App.css'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { TypeProvider } from './contexts/TypeContext.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <TypeProvider>
        <Outlet />
      </TypeProvider>
    </AuthProvider>
  )
}

export default App
