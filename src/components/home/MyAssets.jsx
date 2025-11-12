// src/components/home/MyAssets.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import AssetDonut from '@/components/home/AssetDonut.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PRICES_WS_URL = import.meta.env.VITE_PRICES_WS || '' // 없으면 실시간 비활성화

// 로그인 토큰
const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 숫자 포맷
const fmt = n => (typeof n === 'number' ? n.toLocaleString('ko-KR') : '0')

// 퍼센트 포맷 (소수 → %)
const pct = n =>
  typeof n === 'number'
    ? (n * 100).toFixed(2)
    : '0.00'

export default function MyAssets({ mode = 'personal', title = '내 자산 현황' }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 포트폴리오(합계) + 보유 종목
  const [portfolio, setPortfolio] = useState({
    totalInvestment: 0,   // 투자자산
    cashBalance: 0,       // 현금자산
    totalCurrentValue: 0, // 전체자산
    totalPnlAmount: 0,    // 총손익(실시간)
    totalPnlRate: 0,      // 총손익률(실시간, 소수)
  })
  const [items, setItems] = useState([]) // 보유 종목 리스트

  // 최초 로드
  useEffect(() => {
    const fetchHome = async () => {
      if (!API_BASE_URL) {
        setError('서버 주소가 설정되어 있지 않습니다.')
        setLoading(false)
        return
      }
      if (!getAccessToken()) {
        setError('로그인 후 이용 가능한 서비스입니다.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/home/assets/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        })
        // 일부 서버는 204/빈바디일 수 있어 보호
        const text = await res.text()
        const json = text ? JSON.parse(text) : { success: false, message: '빈 응답' }
        console.log('/api/home/assets/my response >>>', json)

        if (!res.ok || !json.success) {
          setError(json.message || '자산 정보를 불러오지 못했습니다.')
          return
        }

        const data = json.data || {}
        setItems(Array.isArray(data.items) ? data.items : [])
        setPortfolio({
          totalInvestment: data.portfolio?.totalInvestment ?? 0,
          cashBalance: data.portfolio?.cashBalance ?? 0,
          totalCurrentValue: data.portfolio?.totalCurrentValue ?? 0,
          totalPnlAmount: data.portfolio?.totalPnlAmount ?? 0,
          totalPnlRate: data.portfolio?.totalPnlRate ?? 0,
        })
      } catch (e) {
        console.error('/api/home/assets/my error >>>', e)
        setError('서버 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchHome()
  }, [])

  // 실시간 WebSocket 연결
  const wsRef = useRef(null)
  const symbols = useMemo(() => items.map(i => i.symbol).filter(Boolean), [items])

  useEffect(() => {
    if (!PRICES_WS_URL || symbols.length === 0) return

    let alive = true
    const ws = new WebSocket(PRICES_WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      // 구독 프로토콜은 서버 정의에 맞게 조정
      try {
        ws.send(JSON.stringify({ action: 'subscribe', symbols }))
      } catch {}
    }

    ws.onmessage = evt => {
      if (!alive) return
      try {
        const msg = JSON.parse(evt.data || '{}')

        if (msg.type === 'price' && msg.symbol) {
          setItems(prev =>
            prev.map(it =>
              it.symbol === msg.symbol
                ? {
                    ...it,
                    currentPrice:
                      typeof msg.currentPrice === 'number'
                        ? msg.currentPrice
                        : it.currentPrice,
                    pnlAmount:
                      typeof msg.pnlAmount === 'number'
                        ? msg.pnlAmount
                        : it.pnlAmount,
                    pnlRate:
                      typeof msg.pnlRate === 'number'
                        ? msg.pnlRate
                        : it.pnlRate,
                  }
                : it,
            ),
          )
        } else if (msg.type === 'totals') {
          setPortfolio(prev => ({
            ...prev,
            totalPnlAmount:
              typeof msg.totalPnlAmount === 'number'
                ? msg.totalPnlAmount
                : prev.totalPnlAmount,
            totalPnlRate:
              typeof msg.totalPnlRate === 'number'
                ? msg.totalPnlRate
                : prev.totalPnlRate,
            totalCurrentValue:
              typeof msg.totalCurrentValue === 'number'
                ? msg.totalCurrentValue
                : prev.totalCurrentValue,
          }))
        }
      } catch {}
    }

    ws.onerror = () => {}
    ws.onclose = () => {}

    return () => {
      alive = false
      try {
        ws.close()
      } catch {}
    }
  }, [symbols])

  
  const investAmount = portfolio.totalInvestment
  const cashAmount = portfolio.cashBalance
  const totalAmount = investAmount + cashAmount

  const profitAmount = portfolio.totalPnlAmount
  const profitRate = portfolio.totalPnlRate // 소수
  const profitPositive = profitAmount >= 0
  const profitText = `${profitPositive ? '+' : ''}${fmt(profitAmount)}원(${
    profitPositive ? '+' : ''
  }${pct(profitRate)}%)`

  return (
    <Container mode={mode}>
      <SectionTitle>{title}</SectionTitle>

      {loading ? (
        <LoadingText>자산 정보를 불러오는 중이에요...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <>
          {/* 도넛 + 전체 자산 */}
          <DonutBox>
            <AssetDonut investAmount={investAmount} cashAmount={cashAmount} />
            <CenterLabel>
              <CenterAsset>전체 자산</CenterAsset>
              <CenterValue>{fmt(totalAmount)}원</CenterValue>
            </CenterLabel>
          </DonutBox>

          {/* 투자/현금 */}
          <LegendRow>
            <LegendTop>
              <LegendItem>
                <LegendDot $color="#4880AF" />
                <LegendText>투자</LegendText>
              </LegendItem>
              <LegendValue>{fmt(investAmount)}원</LegendValue>
            </LegendTop>

            <LegendBottom>
              <LegendItem>
                <LegendDot $color="#E8EEF6" />
                <LegendText>현금</LegendText>
              </LegendItem>
              <LegendValue>{fmt(cashAmount)}원</LegendValue>
            </LegendBottom>
          </LegendRow>

          <Divider />

          {/* 투자 손익(실시간) */}
          <ProfitRow>
            <ProfitLabel>투자 손익</ProfitLabel>
            <ProfitValue $positive={profitPositive}>{profitText}</ProfitValue>
          </ProfitRow>

        </>
      )}
    </Container>
  )
}


const Container = styled.section`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-0, #fff);
  align-items: flex-start;
  padding: ${({ mode }) =>
    mode === 'group'
      ? '16px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'
      : '32px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'};
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
`

const SectionTitle = styled.h3`
  color: var(--Neutral-900, #2b5276);
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  align-self: stretch;
`

const LoadingText = styled.p`
  font-size: 14px;
  color: #999;
  margin-top: 16px;
`

const ErrorText = styled.p`
  font-size: 14px;
  color: #ff2e4e;
  margin-top: 16px;
`

// 도넛
const DonutBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
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
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
`
const CenterValue = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`

// 투자/현금
const LegendRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-S, 8px);
  align-self: stretch;
`
const LegendTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--Spacing-S, 8px);
`
const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ $color }) => $color};
`
const LegendText = styled.span`
  font-size: 14px;
  color: #555555;
`
const LegendBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const LegendValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`

const Divider = styled.div`
  display: flex;
  width: 343px;
  height: 1px;
  padding: 0 0.4px;
  justify-content: center;
  align-items: center;
  background-color: var(--Neutral-200, #d1d1d1);
`

const ProfitRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const ProfitLabel = styled.span`
  color: var(--Neutral-600, #5d5d5d);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
const ProfitValue = styled.span`
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

