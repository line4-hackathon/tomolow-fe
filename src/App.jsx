import './App.css'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { TypeProvider } from './contexts/TypeContext.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedPath() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn && !['/login', '/signup/1', '/signup/2'].includes(location.pathname)) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
function App() {
  return (
    <AuthProvider>
      <TypeProvider>
        <ProtectedPath />
      </TypeProvider>
    </AuthProvider>
  )
}

export default App
