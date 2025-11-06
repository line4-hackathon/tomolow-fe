import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/signup/LoginPage'
import SignupPage1 from './pages/signup/SignupPage1'
import SignupPage2 from './pages/signup/SignupPage2'
import HomeTransactionPage from './pages/hometransaction/HomeTransactionPage'
import InvestSearchPage from './pages/invest/SearchPage'
import InvestTradingPage from './pages/invest/TradingPage'
import GroupListPage from './pages/group/GroupListPage'
import GroupCreatePage from './pages/group/GroupCreatePage'
import MyPage from './pages/my/MyPage'
import SavedChattingPage from './pages/my/SavedChattingPage'
import MoneyRechargePage from './pages/my/MoneyRechargePage'
import EditInfoPage from './pages/my/EditInfoPage'
import QnaPage from './pages/my/QnaPage'

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
    children: [
      { path: 'search', element: <InvestSearchPage /> },
      { path: 'trading', element: <InvestTradingPage /> },
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
  {
    path: '/home',
    element: <App />,
    children: [{ path: 'transaction', element: <HomeTransactionPage /> }], // 홈과 합칠 예정
  },
  {
    path: '/mypage',
    element: <App />,
    children: [
      { path: '', element: <MyPage /> },
      { path: 'chats', element: <SavedChattingPage /> },
      { path: 'charge', element: <MoneyRechargePage /> },
      { path: 'edit', element: <EditInfoPage /> },
      { path: 'qna', element: <QnaPage /> },
    ],
  },
])

export default router
