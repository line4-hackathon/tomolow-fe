import { createBrowserRouter } from 'react-router-dom'
import App from './App'
// 로그인 페이지
import LoginPage from './pages/signup/LoginPage'
import SignupPage1 from './pages/signup/SignupPage1'
import SignupPage2 from './pages/signup/SignupPage2'
// 홈
import HomePage from './pages/home/HomePage'
// 투자
import InvestSearchPage from './pages/invest/SearchPage'
import InvestTradingPage from './pages/invest/TradingPage'
import InvestPurchasePage from './pages/invest/PurchasePage'
import InvestCorrectionPage from './pages/invest/CorrectionPage'
// 그룹
import GroupListPage from './pages/group/GroupListPage'
import GroupCreatePage from './pages/group/GroupCreatePage'
import GroupHomePage from './pages/group/GroupHomePage'
import GroupTransactionPage from './pages/group/GroupTransactionPage'
import GroupHoldingsPage from './pages/group/GroupHoldingsPage'
import GroupWaitingOrdersPage from './pages/group/GroupWaitingOrdersPage'
// 마이페이지
import MyPage from './pages/my/MyPage'
import SavedChattingPage from './pages/my/SavedChattingPage'
import MoneyChargePage from './pages/my/MoneyChargePage'
import EditInfoPage from './pages/my/EditInfoPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [],
  },
  {
    path: '/login',
    element: <App />,
    children: [{ index: true, element: <LoginPage /> }],
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
    children: [
      { path: 'search', element: <InvestSearchPage /> },
      { path: 'trading', element: <InvestTradingPage /> },
      { path: 'purchase', element: <InvestPurchasePage /> },
      { path: 'correction', element: <InvestCorrectionPage /> },
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
      {
        path: 'home',
        element: <GroupHomePage />,
      },
      {
        path: 'transaction',
        element: <GroupTransactionPage />,
      },
      {
        path: 'holdings',
        element: <GroupHoldingsPage />,
      },
      {
        path: 'waiting',
        element: <GroupWaitingOrdersPage />,
      },
    ],
  },
  {
    path: '/home',
    element: <App />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: '/mypage',
    element: <App />,
    children: [
      { index: true, element: <MyPage /> },
      { path: 'chats', element: <SavedChattingPage /> },
      { path: 'charge', element: <MoneyChargePage /> },
      { path: 'edit', element: <EditInfoPage /> },
    ],
  },
])

export default router
