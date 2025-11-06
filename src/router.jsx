import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/signup/LoginPage'
import SignupPage1 from './pages/signup/SignupPage1'
import SignupPage2 from './pages/signup/SignupPage2'
import InvestSearchPage from './pages/invest/SearchPage'
import InvestTradingPage from './pages/invest/TradingPage'
import GroupListPage from './pages/group/GroupListPage'
import GroupCreatePage from './pages/group/GroupCreatePage'
import InvestPurchasePage from './pages/invest/PurchasePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
  {
    path: '/signup',
    element: <App />,
    children: [
      { path: '1', element: <SignupPage1 /> },
      { path: '2', element: <SignupPage2 /> },
    ],
  },
  {
    path: '/invest',
    element: <App />,
    children: [{ path: 'search', element: <InvestSearchPage/> },
      { path: 'trading', element: <InvestTradingPage/> },
      { path: 'purchase', element: <InvestPurchasePage/> },
    ],
  },
  {
    path: '/group',
    element: <App />,
    children: [
      { path: 'list', element: <GroupListPage /> },
      {
        path: 'create',
        element: <GroupCreatePage />,
      },
    ],
  },
])

export default router
