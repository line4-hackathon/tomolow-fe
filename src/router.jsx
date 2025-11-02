import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/signup/LoginPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
])

export default router
