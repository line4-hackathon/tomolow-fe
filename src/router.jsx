import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/signup/LoginPage'
import InvestSearchPage from './pages/invest/SearchPage'
import InvestTradingPage from './pages/invest/TradingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
  {
    path: '/invest',
    element: <App />,
    children: [{ path: 'search', element: <InvestSearchPage/> },
      { path: 'trading', element: <InvestTradingPage/> },
    ],
  },
])

export default router
