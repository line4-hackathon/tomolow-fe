import styled from 'styled-components'

import StockInfo from '@/components/invest/stockInfo'
import Chart from '@/components/invest/chart'
import Etc from '@/components/invest/etc'
import InvestHeader from '@/components/invest/InvestHeader'
import RedButton from '@/components/invest/RedButton'
import BlueButton from '@/components/invest/BlueButton'
import Toast from '@/components/invest/ToastMessage'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { APIService } from './api'

export default function InvestTradingPage() {
  const isOrder = 1
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [stockData, setStockData] = useState()
  const symbol = state.symbol
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)

  // 토스트 닫기 핸들러: 토스트를 숨기도록 상태 변경
  const handleCloseToast = () => {
    setToastVisible(false)
  }

  useEffect(() => {
    // 라우팅 state를 통해 메시지가 전달되었는지 확인
    if (state && state.toastMessage) {
      setToastMessage(state.toastMessage)
      setToastVisible(true)

      // 토스트를 띄운 후 state를 제거하여 새로고침/뒤로가기 시 재실행 방지 (선택 사항)
      window.history.replaceState({}, document.title) // state 제거 (라우터 버전에 따라 다름)
    }
  }, [state])

  // 데이터 업데이트 핸들러
  const updateStockData = useCallback((message) => {
    try {
      const data = JSON.parse(message.body)
      // 여기서 수신된 데이터를 기반으로 stockData 상태를 업데이트합니다.
      setStockData(data)
      // console.log("실시간 데이터 수신:", data);
    } catch (e) {
      console.error('STOMP 메시지 파싱 에러:', e)
    }
  }, [])

  // 구독 함수
  const subscribeToTicker = useCallback(
    (client, currentSymbol) => {
      // 이전 구독이 있다면 해제 (재구독 시 필요)
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }

      if (currentSymbol) {
        const destination = `/api/rank/${currentSymbol}`
        subscriptionRef.current = client.subscribe(
          destination,
          updateStockData,
          // STOMP 헤더 (필요 시 인증 토큰 등 추가)
          {},
        )
        console.log(`✅ STOMP 구독 시작: ${destination}`)
      }
    },
    [updateStockData],
  )

  useEffect(() => {
    // 렌더링 시 단 한 번만 실행 (의존성 배열: [])

    // 심볼이 없을 경우 연결 시도하지 않음
    if (!symbol) {
      console.warn('Symbol not found in state, cannot connect to ticker.')
      return
    }

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    const wsURL = protocol + window.location.host + WS_ENDPOINT

    const client = new Client({
      brokerURL: wsURL,
      // SockJS를 사용하려면 webSocketFactory: () => new SockJS(wsURL)로 설정
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ STOMP 연결 성공')
        // 연결 성공 시 구독 시작
        subscribeToTicker(client, symbol)
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame)
      },
    })

    clientRef.current = client
    client.activate() // 컴포넌트 마운트 시 연결 즉시 시작

    // 클린업 함수: 컴포넌트 언마운트 시 무조건 연결 해제 및 구독 해제
    return () => {
      // 구독 해제
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
      // 클라이언트 연결 해제
      client.deactivate()
      console.log('🔻 STOMP 연결 해제 (언마운트 클린업)')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 의존성 배열이 빈 배열이므로 마운트 시 한 번만 실행

  const isPurchase = (p) => {
    navigate('/invest/purchase', {
      state: {
        purchase: p,
      },
    })
  }

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
            <BlueButton width='161px' height='56px' onClick={() => isPurchase(false)} />
            <RedButton width='161px' height='56px' onClick={() => isPurchase(true)} />
          </>
        ) : (
          <RedButton width='343px' height='56px' onClick={() => isPurchase(true)} />
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
