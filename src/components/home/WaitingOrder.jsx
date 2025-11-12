import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PENDING_LIST_URL = `${API_BASE_URL}/api/orders/pending`
const PENDING_CANCEL_URL = `${API_BASE_URL}/api/orders/pending` // DELETE

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
    const t = getAccessToken()
    return t ? { Authorization: `Bearer ${t}` } : {}
}

function WaitingOrder() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [targetOrderId, setTargetOrderId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [toast, setToast] = useState({ open: false, msg: '' })

    // 토스트 자동 닫기
    useEffect(() => {
        if (!toast.open) return
        const t = setTimeout(() => setToast({ open: false, msg: '' }), 2500)
        return () => clearTimeout(t)
    }, [toast])

    // 대기주문 목록 불러오기
    useEffect(() => {
        const fetchPending = async () => {
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
            const res = await fetch(PENDING_LIST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            })

            const text = await res.text()
            let json
            try {
            json = text ? JSON.parse(text) : {}
            } catch {
            json = { success: false, message: '응답 파싱 실패', data: null }
            }

            if (!res.ok || !json.success) {
            setError(json.message || '대기주문을 불러오지 못했습니다.')
            setOrders([])
            return
            }

            const items = Array.isArray(json.data?.items)
            ? json.data.items
            : json.data || [] // 서버가 items 배열 안줄 수도 있으므로 fallback

            const mapped = items.map((it, idx) => ({
            id: it.orderId || String(idx),
            orderId: it.orderId || String(idx),
            name: it.name || it.symbol || '종목',
            symbol: it.symbol,
            quantity: it.quantity ?? 0,
            type: it.tradeType === 'SELL' ? '매도' : '매수',
            _raw: it,
            }))

            setOrders(mapped)
        } catch (e) {
            console.error('대기주문 fetch 오류:', e)
            setError('서버 통신 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
        }

        fetchPending()
    }, [])

    const openModal = (orderId) => {
        setTargetOrderId(orderId)
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
        setTargetOrderId(null)
    }

    // ✅ 취소 API (DELETE /api/orders/pending)
    const handleConfirmCancel = async () => {
        if (!targetOrderId) return

        try {
        const res = await fetch(PENDING_CANCEL_URL, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            },
            body: JSON.stringify({ orderId: targetOrderId }),
        })

        const text = await res.text()
        let json
        try {
            json = text ? JSON.parse(text) : {}
        } catch {
            json = { success: false, message: '응답 파싱 실패', data: null }
        }

        if (!res.ok || !json.success) {
            setToast({
            open: true,
            msg: json.message || '주문 취소에 실패했습니다.',
            })
            closeModal()
            return
        }

        setOrders((prev) =>
            prev.filter(
            (o) => o.orderId !== targetOrderId && o.id !== targetOrderId,
            ),
        )
        setToast({ open: true, msg: '주문이 취소됐어요' })
        closeModal()
        } catch (e) {
        console.error('취소 요청 에러:', e)
        setToast({ open: true, msg: '네트워크 오류로 취소 실패' })
        closeModal()
        }
    }

    const goCorrection = (order) => {
        navigate('/invest/correction', { state: { order } })
    }

    if (loading)
        return (
        <Section>
            <Title>대기주문</Title>
            <Message>불러오는 중...</Message>
        </Section>
        )

    if (error)
        return (
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
            {orders.map((order) => (
            <Card key={order.id}>
                <Thumbnail />
                <Content>
                <Left>
                    <LeftText>
                    <StockName>{order.name}</StockName>
                    <StockSub>
                        {order.quantity}주 {order.type}
                    </StockSub>
                    </LeftText>
                </Left>

                <Right>
                    <CancelButton onClick={() => openModal(order.orderId)}>
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

        {isModalOpen && (
            <ModalOverlay>
            <ModalBox>
                <ModalText>주문을 취소할까요?</ModalText>
                <ModalButtonRow>
                <ModalSecondary onClick={closeModal}>닫기</ModalSecondary>
                <ModalPrimary onClick={handleConfirmCancel}>
                    취소하기
                </ModalPrimary>
                </ModalButtonRow>
            </ModalBox>
            </ModalOverlay>
        )}

        {toast.open && <Toast>{toast.msg}</Toast>}
        </Section>
    )
    }

    export default WaitingOrder



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