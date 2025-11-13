// src/components/home/WaitingOrder.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import useStockStore from '@/stores/stockStores'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const LIST_URL = `${API_BASE_URL}/api/orders/pending/list`   // GET
const DELETE_URL = `${API_BASE_URL}/api/orders/pending`      // DELETE {orderId}

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const safeJson = async res => {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

export default function WaitingOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const isGroupRoute = location.pathname.startsWith('/group')

  const { setStockData } = useStockStore()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [confirmId, setConfirmId] = useState(null)

  const [toast, setToast] = useState({ open: false, msg: '' })
  useEffect(() => {
    if (!toast.open) return
    const t = setTimeout(() => setToast({ open: false, msg: '' }), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const loadList = async () => {
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
      const res = await fetch(LIST_URL, {
        method: 'GET',
        headers: { Accept: 'application/json', ...getAuthHeader() },
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
        tradeType: it.tradeType,
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

  useEffect(() => {
    loadList()
  }, [])

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

  // 클릭한 주문 기준으로 현재 시세를 조회하고 store를 채우는 함수
  const fillStoreFromOrder = async order => {
    if (!order) return

    let tradePrice = 0
    let changeRate = 0

    // 현재 시세 조회해서 헤더용 데이터 채우기
    if (order.symbol && API_BASE_URL) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/ticker/${encodeURIComponent(order.symbol)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json', ...getAuthHeader() },
          },
        )
        const json = await safeJson(res)

        if (res.ok && json?.success) {
          const d = json.data || {}
          tradePrice = d.currentPrice ?? d.price ?? d.tradePrice ?? 0
          changeRate  = d.pnlRate ?? d.changeRate ?? 0
        }
      } catch (e) {
        console.error('ticker load error >>>', e)
      }
    }

    // 헤더에서 사용할 현재가/변동률을 store에 넣는다.
    // price: 현재가, changeRate: 변동률
    setStockData({
      market: '',
      symbol: order.symbol || '',
      marketId: order.marketId || '',
      marketName: '',
      name: order.name || '',
      price: tradePrice,       // 헤더가 보는 현재가
      tradePrice: tradePrice,  // 혹시 다른 컴포넌트가 쓰고 있다면 대비
      changeRate: changeRate,
      changePrice: 0,
      prevClose: '',
      accVolume: '',
      accTradePrice24h: '',
      tradeTimestamp: '',
      interested: '',
    })
  }

  // 차트(트레이딩) 페이지로 이동
  const goChart = async order => {
    if (!order?.symbol) return

    await fillStoreFromOrder(order)

    const path = isGroupRoute ? '/group/invest/trading' : '/invest/trading'
    navigate(path)
  }

  // 정정 페이지로 이동
  const goCorrection = async order => {
    if (!order) return

    await fillStoreFromOrder(order)

    // CorrectionPage 쪽에서 orderId 를 세션에서 쓰고 있으니 같이 넣어준다
    sessionStorage.setItem('orderId', order.orderId)

    const path = isGroupRoute ? '/group/invest/correction' : '/invest/correction'
    navigate(path, {
      state: {
        orderId: order.orderId,
        symbol: order.symbol,
        marketId: order.marketId,
        name: order.name,
        tradeType: order.tradeType,
        quantity: order.quantity,
        limitPrice: order.limitPrice,  // 정정 입력 박스 초기값으로 사용할 값
        order: {
          orderId: order.orderId,
          symbol: order.symbol,
          marketId: order.marketId,
          name: order.name,
          tradeType: order.tradeType,
          quantity: order.quantity,
          limitPrice: order.limitPrice,
        },
      },
    })
  }

  if (loading) {
    return (
      <Section>
        <Title>대기주문</Title>
        <Message>불러오는 중…</Message>
      </Section>
    )
  }

  if (error) {
    return (
      <Section>
        <Title>대기주문</Title>
        <Message>{error}</Message>
      </Section>
    )
  }

  if (!orders.length) return null

  return (
    <Section>
      <Title>대기주문</Title>
      <CardList>
        {orders.map(order => (
          <Card key={order.id}>
            <Thumbnail onClick={() => goChart(order)} role="button" />
            <Content>
              <Left onClick={() => goChart(order)} role="button">
                <LeftText>
                  <StockName>{order.name}</StockName>
                  <StockSub>
                    {order.quantity}주 {order.typeLabel}
                  </StockSub>
                </LeftText>
              </Left>

              <Right>
                <CancelButton onClick={() => setConfirmId(order.orderId)}>
                  취소
                </CancelButton>
                <EditButton onClick={() => goCorrection(order)}>
                  정정
                </EditButton>
              </Right>
            </Content>
          </Card>
        ))}
      </CardList>

      {confirmId && (
        <ModalOverlay>
          <ModalBox>
            <ModalText>주문을 취소할까요?</ModalText>
            <ModalButtonRow>
              <ModalSecondary onClick={() => setConfirmId(null)}>
                닫기
              </ModalSecondary>
              <ModalPrimary onClick={doCancel}>취소하기</ModalPrimary>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}

      {toast.open && <Toast>{toast.msg}</Toast>}
    </Section>
  )
}

// 스타일은 그대로
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