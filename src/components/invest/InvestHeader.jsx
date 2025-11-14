import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

import BackButton from '@/assets/icons/icon-back.svg?react'
import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'
import useStockStore from '@/stores/stockStores'
import { APIService } from '@/pages/invest/api'

// 환경값
const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

const toSockJsUrl = (base) => {
  try {
    const u = new URL(base)
    if (u.pathname.endsWith('/ws')) {
      u.pathname = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    }
    if (u.protocol === 'wss:') u.protocol = 'https:'
    if (u.protocol === 'ws:') u.protocol = 'http:'
    return u.toString()
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}

const safeSym = (s) => (s || '').trim().toUpperCase()

export default function InvestHeader({ path = -1 }) {
  const { stockData } = useStockStore()
  const [isInterest, setIsInterest] = useState(stockData.interested)
  const [livePrice, setLivePrice] = useState(stockData.price ?? 0)
  const [liveRate, setLiveRate] = useState(stockData.changeRate ?? 0)

  const navigate = useNavigate()
  const stompRef = useRef(null)

  // stockData 바뀔 때 기본값 동기화
  useEffect(() => {
    setIsInterest(stockData.interested)
    setLivePrice(stockData.price ?? 0)
    setLiveRate(stockData.changeRate ?? 0)
  }, [stockData.price, stockData.changeRate, stockData.interested, stockData.symbol])

  // 웹소켓으로 현재 종목 실시간 시세 구독
  useEffect(() => {
    const symbol = safeSym(stockData.symbol || stockData.market)
    if (!symbol || !WS_BASE_URL) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 3000,
      debug: () => {},
    })
    stompRef.current = client

    client.onConnect = () => {
      const topic = `/topic/ticker/${symbol}`

      client.subscribe(topic, (frame) => {
        try {
          const msg = JSON.parse(frame.body || '{}')

          const rawPrice = msg.tradePrice ?? msg.currentPrice ?? msg.price ?? msg.lastPrice
          const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice)

          const rawRate = msg.changeRate ?? msg.pnlRate
          const rate = typeof rawRate === 'number' ? rawRate : Number(rawRate)

          if (Number.isFinite(price)) setLivePrice(price)
          if (Number.isFinite(rate)) setLiveRate(rate)
        } catch (e) {
          console.error('ticker parse error in InvestHeader >>>', e)
        }
      })
    }

    client.onStompError = (f) => {
      console.error('STOMP error (InvestHeader) >>>', f)
    }

    client.activate()

    return () => {
      try {
        client.deactivate()
      } catch {}
    }
  }, [stockData.symbol, stockData.market])

  const interest = async () => {
    try {
      await APIService.private.post(`/api/interests/markets/${stockData.marketId}/toggle`)
      setIsInterest((prev) => !prev)
    } catch (error) {
      console.log('관심 등록/취소 실패', error)
    }
  }

  const priceToShow = livePrice ?? 0
  const rateToShow = typeof liveRate === 'number' && !Number.isNaN(liveRate) ? liveRate : 0
  const rateText = (rateToShow * 100).toFixed(2)

  return (
    <HeaderBar>
      <BackButton onClick={() => navigate(path)} />
      <HeaderInfo>
        <HeadName>{stockData.name}</HeadName>
        <HeadPrice isNegative={rateToShow < 0}>
          {priceToShow.toLocaleString('ko-KR')}원({rateText}%)
        </HeadPrice>
      </HeaderInfo>
      {isInterest ? <RedHeart onClick={interest} /> : <GrayHeart onClick={interest} />}
    </HeaderBar>
  )
}

// styled-components 그대로
const HeaderBar = styled.header`
  display: flex;
  width: 343px;
  padding: 10px 16px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid var(--Neutral-100, #e7e7e7);
  background: var(--Neutral-0, #fff);
`
const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const HeadName = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
const HeadPrice = styled.div`
  color: ${({ isNegative }) => (isNegative ? '#0084FE' : 'var(--Alert-Red, #ff2e4e)')};
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
