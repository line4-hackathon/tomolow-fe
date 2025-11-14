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
  const { stockData, setStockData } = useStockStore()
  const { groupData } = useGroupStore()
  const type = useType()
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const { selectedMenu: selectedDate, handleSelect: setSelectedDate } = useSelect('DAY')
  const { selectedMenu: selectedEtc, handleSelect: setSelectedEtc } = useSelect('ORDER')
  const [chartData, setChartData] = useState([])
  const [etcData, setEtcData] = useState([])
  const [orderData, setOrderData] = useState([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isHold, setIsHold] = useState(false)
  const [isCandle, setIsCandle] = useState(true)

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

  //웹소켓 코드 삭제

  //차트 데이터 얻기
  useEffect(() => {
    if (!stockData.symbol) {
      console.log('심볼 없음')
      return
    }
    const chartDataGet = async () => {
      let param
      let apiUrl
      if (isCandle) {
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
        apiUrl = `/api/candles/${stockData.symbol}?tf=${param}`
      } else {
        switch (selectedDate) {
          case 'WEEK':
            param = await 7
            break
          case 'MONTH':
            param = await 30
            break
          case 'THREEMONTH':
            param = await 90
            break
          case 'SIXMONTH':
            param = await 180
            break
          case 'YEAR':
            param = await 365
            break
        }
        apiUrl = `/api/candles/${stockData.symbol}?tf=D1&limit=${param}`
      }

      try {
        const res = await APIService.private.get(apiUrl)
        setChartData(res.data)
      } catch (error) {
        console.log('차트 조회 실패')
      }
    }
    chartDataGet()
  }, [selectedDate, stockData.symbol, isCandle])

  //스톡 인포 얻기
  useEffect(() => {
    if (!stockData.symbol) {
      console.log('symbol 없음 → ticker API 호출 안 함')
      return
    }

    const stockInfoGet = async () => {
      try {
        const res = await APIService.private.get(`/api/ticker/${stockData.symbol}`)

        setStockData((prev) => ({
          ...prev,
          tradePrice: res.data.tradePrice,
          changeRate: res.data.changeRate,
          changePrice: res.data.changePrice,
          prevClose: res.data.prevClose,
          accVolume: res.data.accVolume,
          accTradePrice24h: res.data.accTradePrice24h,
          tradeTimestamp: res.data.tradeTimestamp,
        }))
      } catch (error) {
        console.log('스톡 인포 얻기 실패')
      }
    }

    stockInfoGet()
  }, [stockData.symbol])
  //주식 보유 여부 조회
  useEffect(() => {
    if (!stockData.marketId) return
    const holdingDataGet = async () => {
      try {
        const res = await APIService.private.get(`/api/market/${stockData.marketId}/holding`)
        setIsHold(res.data.holding)
      } catch (error) {
        console.log('보유 여부 조회 실패')
      }
    }
    holdingDataGet()
  }, [stockData.marketId])

  //기타 데이터 얻기
  useEffect(() => {
    if (!stockData.marketId) return
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
              currentPrice: stockData.price,
              previousClosePrice: stockData.changePrice,
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
          isCandle={isCandle}
          setIsCandle={setIsCandle}
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
