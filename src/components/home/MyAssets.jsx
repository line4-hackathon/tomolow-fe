window.global = window

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import AssetDonut from '@/components/home/AssetDonut.jsx'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

// 환경값
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

const safeSym = (s) => (s || '').trim().toUpperCase()

const toSockJsUrl = (base) => {
  try {
    const u = new URL(base)
    if (u.pathname.endsWith('/ws')) u.pathname = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    if (u.protocol === 'wss:') u.protocol = 'https:'
    if (u.protocol === 'ws:') u.protocol = 'http:'
    return u.toString()
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}
const fmt = (n) => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0'
  return Math.round(n).toLocaleString('ko-KR')
}
const pct = (n) => (typeof n === 'number' ? (n * 100).toFixed(2) : '0.00')

export default function MyAssets({ mode = 'personal', title = '내 자산 현황', assetData }) {
  const [loading, setLoading] = useState(mode !== 'group')
  const [error, setError] = useState('')

  const [portfolio, setPortfolio] = useState({
    totalInvestment: 0,
    cashBalance: 0,
    totalCurrentValue: 0,
    totalPnlAmount: 0,
    totalPnlRate: 0,
  })

  const [items, setItems] = useState([])

  // 1) 초기 로딩
  useEffect(() => {
    if (mode === 'group') {
      setPortfolio({
        totalInvestment: assetData.investmentBalance,
        cashBalance: assetData.cashBalance,
        totalCurrentValue: assetData.totalBalance,
        totalPnlAmount: assetData.pnL,
        totalPnlRate: assetData.pnLRate,
      })
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/assets/my`, {
          headers: { ...getAuthHeader() },
        })
        const json = await res.json()

        if (!res.ok || !json.success) {
          setError(json.message || '자산 정보를 불러오지 못했습니다.')
          return
        }

        const data = json.data
        setItems(data.items || [])
        setPortfolio({
          totalInvestment: data.portfolio?.totalInvestment ?? 0,
          cashBalance: data.portfolio?.cashBalance ?? 0,
          totalCurrentValue: data.portfolio?.totalCurrentValue ?? 0,
          totalPnlAmount: data.portfolio?.totalPnlAmount ?? 0,
          totalPnlRate: data.portfolio?.totalPnlRate ?? 0,
        })
      } catch (e) {
        console.error('load error >>>', e)
        setError('서버 통신 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 2) 실시간 구독
  const stompRef = useRef(null)

  const symbols = useMemo(() => items.map((i) => safeSym(i.symbol)).filter(Boolean), [items])

  const userId = useMemo(() => {
    const t = getAccessToken()
    const jwt = t ? parseJwt(t) : null
    return jwt?.sub || jwt?.userId || null
  }, [])

  useEffect(() => {
    if (symbols.length === 0) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 3000,
      debug: () => {},
    })
    stompRef.current = client

    const registerOnline = () => {
      if (!client.active || !userId) return
      client.publish({ destination: '/app/portfolio/online', body: String(userId) })
    }

    client.onConnect = () => {
      // 심볼 별 가격 실시간
      symbols.forEach((sym) => {
        const upper = safeSym(sym)

        client.subscribe(`/topic/ticker/${upper}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body || '{}')

            const rawPrice = msg.tradePrice ?? msg.currentPrice ?? msg.price ?? msg.lastPrice
            const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice)

            const rawAmt = msg.pnlAmount
            const pnlAmount = typeof rawAmt === 'number' ? rawAmt : Number(rawAmt)

            const rawRate = msg.pnlRate ?? msg.changeRate
            const pnlRate = typeof rawRate === 'number' ? rawRate : Number(rawRate)

            setItems((prev) =>
              prev.map((it) =>
                safeSym(it.symbol) === upper
                  ? {
                      ...it,
                      currentPrice: !isNaN(price) ? price : it.currentPrice,
                      pnlAmount: !isNaN(pnlAmount) ? pnlAmount : it.pnlAmount,
                      pnlRate: !isNaN(pnlRate) ? pnlRate : it.pnlRate,
                    }
                  : it,
              ),
            )
          } catch (e) {
            console.error('ticker parse error >>>', e)
          }
        })
      })

      // 온라인 등록
      registerOnline()
    }

    client.activate()

    return () => {
      try {
        client.publish({ destination: '/app/portfolio/offline', body: String(userId) })
      } catch {}
      client.deactivate()
    }
  }, [symbols.join('|'), userId])

  // 3) items 가격 변동에 따라 portfolio 자동 재계산 (보유/관심과 동일한 방식)
  useEffect(() => {
    if (mode === 'group') return
    if (!items || items.length === 0) return

    let totalInvestment = 0
    let totalCurrentValue = 0

    items.forEach((it) => {
      const qty = Number(it.quantity || 0)
      const avg = Number(it.avgPrice || 0)
      const cur = Number(it.currentPrice || avg)

      totalInvestment += avg * qty
      totalCurrentValue += cur * qty
    })

    const totalPnlAmount = totalCurrentValue - totalInvestment
    const totalPnlRate = totalInvestment ? totalPnlAmount / totalInvestment : 0

    setPortfolio((prev) => ({
      ...prev,
      totalInvestment,
      totalCurrentValue,
      totalPnlAmount,
      totalPnlRate,
    }))
  }, [items, mode])

  // 4) 화면 표시용 파생 값
  const investAmount = portfolio.totalInvestment
  const cashAmount = portfolio.cashBalance
  const totalAmount = investAmount + cashAmount
  const profit = portfolio.totalPnlAmount
  const profitRate = portfolio.totalPnlRate
  const profitPositive = profit >= 0

  return (
    <Container mode={mode}>
      <SectionTitle>{title}</SectionTitle>

      {loading ? (
        <LoadingText>자산 정보를 불러오는 중이에요...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <>
          <DonutBox>
            <AssetDonut investAmount={investAmount} cashAmount={cashAmount} />
            <CenterLabel>
              <CenterAsset>전체 자산</CenterAsset>
              <CenterValue>{fmt(totalAmount)}원</CenterValue>
            </CenterLabel>
          </DonutBox>

          <LegendRow>
            <LegendTop>
              <LegendItem>
                <LegendDot $color='#4880AF' />
                <LegendText>투자</LegendText>
              </LegendItem>
              <LegendValue>{fmt(investAmount)}원</LegendValue>
            </LegendTop>

            <LegendBottom>
              <LegendItem>
                <LegendDot $color='#E8EEF6' />
                <LegendText>현금</LegendText>
              </LegendItem>
              <LegendValue>{fmt(cashAmount)}원</LegendValue>
            </LegendBottom>
          </LegendRow>

          <Divider />

          <ProfitRow>
            <ProfitLabel>투자 손익</ProfitLabel>
            <ProfitValue $positive={profitPositive}>
              {profitPositive ? '+' : ''}
              {fmt(profit)}원({profitPositive ? '+' : ''}
              {pct(profitRate)}%)
            </ProfitValue>
          </ProfitRow>
        </>
      )}
    </Container>
  )
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: ${({ mode }) => (mode === 'group' ? '16px 16px 16px 16px' : '32px 16px 16px 16px')};
  gap: 16px;
`
const SectionTitle = styled.p`
  color: var(--Neutral-900, #333);
  /* Head-Medium */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
`
const LoadingText = styled.p`
  font-size: 14px;
  color: #999;
`
const ErrorText = styled.p`
  font-size: 14px;
  color: #ff2e4e;
`
const DonutBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 343px;
  height: 172px;
`
const CenterLabel = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`
const CenterAsset = styled.div`
  color: #333;
  font-size: 20px;
`
const CenterValue = styled.div`
  color: #333;
  font-size: 21px;
  font-weight: 600;
`
const LegendRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const LegendTop = styled.div`
  display: flex;
  justify-content: space-between;
`
const LegendBottom = LegendTop
const LegendItem = styled.div`
  display: flex;
  gap: 8px;
`
const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`
const LegendText = styled.span`
  font-size: 14px;
  color: #555;
`
const LegendValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`
const Divider = styled.div`
  width: 343px;
  height: 1px;
  background: #d1d1d1;
`
const ProfitRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const ProfitLabel = styled.span`
  color: #5d5d5d;
`
const ProfitValue = styled.span`
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
  font-size: 16px;
`
