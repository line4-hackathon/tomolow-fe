// src/components/home/WaitingOrder.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const LIST_URL   = `${API_BASE_URL}/api/orders/pending/list`   // GET
const DELETE_URL = `${API_BASE_URL}/api/orders/pending`        // DELETE {orderId}

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const safeJson = async (res) => {
  const text = await res.text()
  try { return text ? JSON.parse(text) : null } catch { return null }
}

export default function WaitingOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const isGroupRoute = location.pathname.startsWith('/group')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 취소 모달
  const [confirmId, setConfirmId] = useState(null)

  // 토스트
  const [toast, setToast] = useState({ open: false, msg: '' })
  useEffect(() => {
    if (!toast.open) return
    const t = setTimeout(() => setToast({ open: false, msg: '' }), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const loadList = async () => {
    if (!API_BASE_URL) { setError('서버 주소가 설정되어 있지 않습니다.'); setLoading(false); return }
    if (!getAccessToken()) { setError('로그인 후 이용 가능한 서비스입니다.'); setLoading(false); return }

    try {
      const res = await fetch(LIST_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json', ...getAuthHeader() },
      })
      const json = await safeJson(res)
      if (!res.ok || !json?.success) {
        setError(json?.message || '대기주문을 불러오지 못했습니다.')
        setOrders([])
        return
      }

      const items = Array.isArray(json.data) ? json.data : []
      const mapped = items.map((it, i) => ({
        id: it.orderId || String(i),
        orderId: it.orderId || String(i),
        name: it.name || it.symbol || '종목',
        symbol: it.symbol,                    
        marketId: it.marketId || it.symbol,   
        quantity: it.quantity ?? 0,
        limitPrice: it.limitPrice ?? 0,
        tradeType: it.tradeType,              // 'BUY' | 'SELL'
        typeLabel: it.tradeType === 'SELL' ? '매도' : '매수',
        imageUrl: it.imageUrl || null,
      }))

      setOrders(mapped)
      setError('')
    } catch (e) {
      console.error('pending/list error >>>', e)
      setError('서버 통신 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadList() }, [])

  const doCancel = async () => {
    if (!confirmId) return
    try {
      const res = await fetch(DELETE_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ orderId: confirmId }),
      })
      const json = await safeJson(res)
      if (!res.ok || !json?.success) {
        setToast({ open: true, msg: json?.message || '주문 취소에 실패했습니다.' })
      } else {
        setOrders(prev => prev.filter(o => o.orderId !== confirmId))
        setToast({ open: true, msg: '주문이 취소됐어요' })
      }
    } catch (e) {
      console.error('cancel error >>>', e)
      setToast({ open: true, msg: '네트워크 오류로 취소 실패' })
    } finally {
      setConfirmId(null)
    }
  }

  const goChart = (symbol) => {
    if (!symbol) return
    const path = isGroupRoute ? '/group/invest/trading' : '/invest/trading'
    navigate(path, { state: { symbol } })
  }

  // 정정 페이지로 이동 
  const goCorrection = (order) => {
    // CorrectionPage에서 세션을 읽는 구조를 대비
    sessionStorage.setItem('orderId', order.orderId)
    sessionStorage.setItem('investType', isGroupRoute ? 'group' : 'personal')
    if (order.marketId) sessionStorage.setItem('marketId', order.marketId)
    if (order.symbol)   sessionStorage.setItem('symbol', order.symbol)
    // 필요시 초기 지정가를 참고하려면(페이지에서 사용한다면)
    sessionStorage.setItem('limitPrice', String(order.limitPrice ?? ''))

    const path = isGroupRoute ? '/group/invest/correction' : '/invest/correction'
    navigate(path)
  }

  if (loading) return (
    <Section>
      <Title>대기주문</Title>
      <Message>불러오는 중…</Message>
    </Section>
  )

  if (error) return (
    <Section>
      <Title>대기주문</Title>
      <Message>{error}</Message>
    </Section>
  )

  if (!orders.length) return null

  return (
    <Section>
      <Title>대기주문</Title>

      <CardList>
        {orders.map(order => (
          <Card key={order.id}>
            <Thumbnail onClick={() => goChart(order.symbol)} role="button" />
            <Content>
              <Left onClick={() => goChart(order.symbol)} role="button">
                <LeftText>
                  <StockName>{order.name}</StockName>
                  <StockSub>
                    {order.quantity}주 {order.typeLabel}
                  </StockSub>
                </LeftText>
              </Left>

              <Right>
                <CancelButton onClick={() => setConfirmId(order.orderId)}>취소</CancelButton>
                {/* 정정 버튼: 세션 저장 후 경로 이동 */}
                <EditButton onClick={() => goCorrection(order)}>정정</EditButton>
              </Right>
            </Content>
          </Card>
        ))}
      </CardList>

      {/* 취소 모달 */}
      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalText>주문을 취소할까요?</ModalText>
            <ModalButtonRow>
              <ModalSecondary onClick={() => setConfirmId(null)}>닫기</ModalSecondary>
              <ModalPrimary onClick={doCancel}>취소하기</ModalPrimary>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}

      {toast.open && <Toast>{toast.msg}</Toast>}
    </Section>
  )
}

const Section = styled.section`
  padding: 0px 16px 32px;
  background-color: #f6f6f6;
  position: relative;
  gap: var(--Spacing-M, 12px);
  display: flex;
  flex-direction: column;
`
const Title = styled.h2`
  color: var(--Neutral-900, #2b5276);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
const Message = styled.p`
  color: #9aa0a6;
  font-size: 14px;
  margin-top: 8px;
`
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--Spacing-XL, 24px);
`
const Card = styled.div`
  display: flex;
  padding: var(--Spacing-L, 16px);
  align-items: flex-start;
  gap: 10px;
  border-radius: var(--Radius-L, 16px);
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const Content = styled.div`
  display: flex;
  width: 247px;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`
const Thumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: var(--Primary-900, #263c54);
`
const Left = styled.div`
  display: flex;
  width: 79px;
  flex-direction: column;
  gap: var(--Spacing-S, 8px);
  flex-shrink: 0;
`
const LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const StockName = styled.div`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
const StockSub = styled.div`
  color: #6d6d6d;
  font-size: 12px;
  line-height: 16px;
`
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: var(--Spacing-S, 8px);
`
const BaseButton = styled.button`
  display: flex;
  padding: 12px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  border-radius: var(--Radius-S, 8px);
`
const CancelButton = styled(BaseButton)`
  color: #6d6d6d;
  background: #e7e7e7;
`
const EditButton = styled(BaseButton)`
  background: #4880af;
  color: #fff;
`
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
const ModalBox = styled.div`
  width: 250px;
  display: flex;
  padding: 24px 16px 16px;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`
const ModalText = styled.div`
  font-size: 16px;
  text-align: center;
  color: #333;
`
const ModalButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
const ModalSecondary = styled(BaseButton)`
  background: #e5e5e5;
  color: #555;
  flex: 1;
`
const ModalPrimary = styled(BaseButton)`
  background: #4880af;
  color: #fff;
  flex: 1;
`
const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 346px;
  transform: translateX(-50%);
  padding: 24px 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  color: #333;
  z-index: 1000;
`