import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/signup/LoginPage'
import SignupPage1 from './pages/signup/SignupPage1'
import SignupPage2 from './pages/signup/SignupPage2'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        path: 'signup/1',
        element: <SignupPage1 />,
      },
      {
        path: 'signup/2',
        element: <SignupPage2 />,
      },
    ],
  },
])

export default router
