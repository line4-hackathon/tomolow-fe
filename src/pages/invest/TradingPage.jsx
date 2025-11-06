import styled from 'styled-components'

import StockInfo from '@/components/invest/stockInfo'
import Chart from '@/components/invest/chart'
import Etc from '@/components/invest/etc'
import InvestHeader from '@/components/invest/InvestHeader'
import RedButton from '@/components/invest/RedButton'
import BlueButton from '@/components/invest/BlueButton'
import Toast from '@/components/invest/ToastMessage'
import { useState,useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';

export default function InvestTradingPage() {
  const isOrder = 1
  const navigate=useNavigate();
  const location = useLocation();
  const { state } = location;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 토스트 닫기 핸들러: 토스트를 숨기도록 상태 변경
  const handleCloseToast = () => {
    setToastVisible(false);
  };

  useEffect(() => {
    // 라우팅 state를 통해 메시지가 전달되었는지 확인
    if (state && state.toastMessage) {
      setToastMessage(state.toastMessage);
      setToastVisible(true);
      
      // 토스트를 띄운 후 state를 제거하여 새로고침/뒤로가기 시 재실행 방지 (선택 사항)
      window.history.replaceState({}, document.title); // state 제거 (라우터 버전에 따라 다름)
    }
  }, [state]);
  return (
    <Page>
      <InvestHeader />
      <Contents>
        <StockInfo />
        <Chart />
        <Etc />
      </Contents>
      <Bar>
        {isOrder ? (
          <>
            <BlueButton width='161px' height='56px' />
            <RedButton width='161px' height='56px' onClick={()=>navigate("/invest/purchase")}/>
          </>
        ) : (
          <RedButton width='343px' height='56px' onClick={()=>navigate("/invest/purchase")}/>
        )}
      </Bar>
      <AnimatePresence>
        {toastVisible && (
          <Toast 
            message={toastMessage} 
            onClose={handleCloseToast} 
            // duration을 props로 전달할 수 있으나, Toast.jsx 내부에서 기본값 2500ms를 사용합니다.
          />
        )}
      </AnimatePresence>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Contents = styled.div`
  width: 375px;
  height: 590px;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
`
const Bar = styled.footer`
  display: flex;
  width: 375px;
  align-items: center;
  justify-content: center;
  height: 88px;
  gap: 21px;
`
