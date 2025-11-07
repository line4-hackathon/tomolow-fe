import './App.css'
import { Outlet } from 'react-router-dom'
import { TypeProvider } from './contexts/TypeContext.jsx'

function App() {
  return (
    <TypeProvider>
      <Outlet />
    </TypeProvider>
  )
}

export default App
