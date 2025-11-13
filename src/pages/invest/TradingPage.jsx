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
import { APIService, WS_ENDPOINT } from './api'
import { Client } from '@stomp/stompjs'
import { DateTypes } from './selectType'
import useSelect from '@/hooks/select'
import useStockStore from '@/stores/stockStores'
import { useType } from '@/contexts/TypeContext'
import useGroupStore from '@/stores/groupStores'

export default function InvestTradingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const { selectedMenu: selectedDate, handleSelect: setSelectedDate } = useSelect('DAY')
  const [chartData, setChartData] = useState([])
  const { selectedMenu: selectedEtc, handleSelect: setSelectedEtc } = useSelect('ORDER')
  const [etcData, setEtcData] = useState([])
  const [orderData, setOrderData] = useState([])
  const { stockData, setStockData } = useStockStore()
  const [isHold, setIsHold] = useState(false)
  const type = useType()
  const { groupData } = useGroupStore()

  // 토스트 닫기 핸들러: 토스트를 숨기도록 상태 변경
  const handleCloseToast = () => {
    setToastVisible(false)
  }
  //토스트 값 확인
  useEffect(() => {
    // 라우팅 state를 통해 메시지가 전달되었는지 확인
    if (state && state.toastMessage) {
      setToastMessage(state.toastMessage)
      setToastVisible(true)

      const { toastMessage, ...restState } = state
      navigate(location.pathname, { replace: true, state: restState })
    }
  }, [state])

  // // 데이터 업데이트 핸들러
  // const updateStockData = useCallback((message) => {
  //   try {
  //     const data = JSON.parse(message.body)
  //     // 여기서 수신된 데이터를 기반으로 stockData 상태를 업데이트합니다.
  //     setStockData(data)
  //     // console.log("실시간 데이터 수신:", data);
  //   } catch (e) {
  //     console.error('STOMP 메시지 파싱 에러:', e)
  //   }
  // }, [])

  // // 구독 함수
  // const subscribeToTicker = useCallback(
  //   (client, currentSymbol) => {
  //     // 이전 구독이 있다면 해제 (재구독 시 필요)
  //     if (subscriptionRef.current) {
  //       subscriptionRef.current.unsubscribe()
  //     }

  //     if (currentSymbol) {
  //       const destination = `/api/ticker/${currentSymbol}`
  //       // 1. 로컬 스토리지에서 토큰 가져오기
  //       const token = localStorage.getItem('accessToken')
  //       // 2. 헤더 객체 생성
  //       const headers = {}
  //       // 3. 토큰이 존재하면 Authorization 헤더에 추가 (예: Bearer 토큰)
  //       if (token) {
  //         headers.Authorization = `Bearer ${token}` // 백엔드 요구 사항에 따라 "Bearer "를 생략할 수도 있습니다.
  //       }
  //       subscriptionRef.current = client.subscribe(destination, updateStockData, headers)
  //       console.log(`✅ STOMP 구독 시작: ${destination}`)
  //     }
  //   },
  //   [updateStockData],
  // )

  // useEffect(() => {
  //   // 렌더링 시 단 한 번만 실행 (의존성 배열: [])

  //   // 심볼이 없을 경우 연결 시도하지 않음
  //   if (!stockData.symbol) {
  //     console.warn('Symbol not found in stockData, cannot connect to ticker.')
  //     return
  //   }
  //   const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  //   const wsURL = protocol + window.location.host + WS_ENDPOINT
  //   const token = localStorage.getItem('accessToken')

  //   const client = new Client({
  //     brokerURL: wsURL,
  //     // SockJS를 사용하려면 webSocketFactory: () => new SockJS(wsURL)로 설정
  //     reconnectDelay: 5000,
  //     connectHeaders: token
  //       ? {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       : {},

  //     onConnect: () => {
  //       console.log('✅ STOMP 연결 성공')
  //       // 연결 성공 시 구독 시작
  //       subscribeToTicker(client, stockData.symbol)
  //     },
  //     onStompError: (frame) => {
  //       console.error('❌ STOMP 에러:', frame)
  //     },
  //   })

  //   clientRef.current = client
  //   client.activate() // 컴포넌트 마운트 시 연결 즉시 시작

  //   // 클린업 함수: 컴포넌트 언마운트 시 무조건 연결 해제 및 구독 해제
  //   return () => {
  //     // 구독 해제
  //     if (subscriptionRef.current) {
  //       subscriptionRef.current.unsubscribe()
  //       subscriptionRef.current = null
  //     }
  //     // 클라이언트 연결 해제
  //     client.deactivate()
  //     console.log('🔻 STOMP 연결 해제 (언마운트 클린업)')
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []) // 의존성 배열이 빈 배열이므로 마운트 시 한 번만 실행

  //주식 데이터 얻기
  useEffect(() => {
    if (!stockData.symbol) {
      console.log('심볼 없음')
      return
    }
    const stockInfoGet = async () => {
      try {
        const res = await APIService.private.get(`store/api/ticker/${stockData.symbol}`)
        setStockData(res.data)
      } catch (error) {
        console.log('스톡 인포 얻기 실패')
      }
    }
    const chartDataGet = async () => {
      let param
      switch (selectedDate) {
        case 'DAY':
          param = await 'D1'
          break
        case 'WEEK':
          param = await 'W1'
          break
        case 'MONTH':
          param = await 'M1'
          break
        case 'THREEMONTH':
          param = await 'M3'
          break
        case 'YEAR':
          param = await 'Y1'
          break
      }
      try {
        const res = await APIService.private.get(`/api/candles/${stockData.symbol}?tf=${param}`)
        setChartData(res.data)
      } catch (error) {
        console.log('차트 조회 실패')
      }
    }
    const holdingDataGet = async () => {
      try {
        const res = await APIService.private.get(`/api/market/${stockData.marketId}/holding`)
        setIsHold(res.data.holding)
      } catch (error) {
        console.log('보유 여부 조회 실패')
      }
    }
    stockInfoGet()
    chartDataGet()
    holdingDataGet()
  }, [selectedDate, stockData.symbol, stockData.marketId])

  //기타 데이터 얻기
  useEffect(() => {
    const etcGet = async () => {
      try {
        let res
        switch (selectedEtc) {
          case 'ORDER':
            if (type == 'group') {
              res = await APIService.private.get(
                `/api/market/${stockData.marketId}/pending/group/${groupData.groupId}`,
              )
            } else {
              res = await APIService.private.get(`/api/market/${stockData.marketId}/pending`)
            }
            break
          case 'NEWS':
            res = await APIService.private.get(`/api/market/${stockData.marketId}/news`)
            break
          case 'AI':
            res = await APIService.private.post(`/api/market/${stockData.marketId}/analysis`, {
              data: { currentPrice: stockData.price, previousClosePrice: stockData.prevClose },
            })
            break
        }
        if (selectedEtc == 'ORDER') {
          setOrderData(res.data)
        } else {
          setEtcData(res.data)
        }
      } catch (error) {
        console.log('기타 불러오기 실패')
      }
    }
    etcGet()
  }, [selectedEtc])

  const isPurchase = (p) => {
    if (type == 'group') {
      navigate('/group/invest/purchase', {
        state: {
          purchase: p,
        },
      })
    } else {
      navigate('/invest/purchase', {
        state: {
          purchase: p,
        },
      })
    }
  }

  return (
    <Page>
      <InvestHeader
        path={type === 'group' ? `/group/home/${groupData.groupId}` : `/invest/search`}
      />
      <Contents>
        <StockInfo />
        <Chart
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          symbol={stockData.symbol}
          chartData={chartData}
        />
        <Etc
          selectedMenu={selectedEtc}
          handleSelect={setSelectedEtc}
          etcData={etcData}
          orderData={orderData}
        />
      </Contents>
      <Bar>
        {isHold ? (
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
  height: 582px;
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
