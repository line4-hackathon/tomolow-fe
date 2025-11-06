import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const dummyOrders = [
    { id: 1, name: '신한은행', quantity: 3, type: '매수' },
    { id: 2, name: '신한은행', quantity: 3, type: '매수' },
]

function WaitingOrder() {
    const [orders, setOrders] = useState(dummyOrders)
    const [targetOrderId, setTargetOrderId] = useState(null) // 어떤 주문을 취소할지
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isToastOpen, setIsToastOpen] = useState(false)

    const openModal = (orderId) => {
        setTargetOrderId(orderId)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTargetOrderId(null)
    }

    const handleConfirmCancel = () => {
        // 실제로는 여기서 API 호출 + 성공 시 상태 갱신
        setOrders((prev) => prev.filter((o) => o.id !== targetOrderId))
        setIsModalOpen(false)
        setTargetOrderId(null)
        setIsToastOpen(true)
    }

    // 토스트 2.5초 뒤 자동 닫기
    useEffect(() => {
        if (!isToastOpen) return
        const timer = setTimeout(() => setIsToastOpen(false), 2500)
        return () => clearTimeout(timer)
    }, [isToastOpen])

    if (orders.length === 0) {
        return null
    }

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
                        <CancelButton onClick={() => openModal(order.id)}>취소</CancelButton>
                        <EditButton>정정</EditButton>
                        </Right>
                </Content>
            </Card>
            ))}
        </CardList>

        {/* 주문 취소 모달 */}
        {isModalOpen && (
            <ModalOverlay>
            <ModalBox>
                <ModalText>주문을 취소할까요?</ModalText>
                <ModalButtonRow>
                <ModalSecondary onClick={closeModal}>닫기</ModalSecondary>
                <ModalPrimary onClick={handleConfirmCancel}>취소하기</ModalPrimary>
                </ModalButtonRow>
            </ModalBox>
            </ModalOverlay>
        )}
        {/* 토스트 메시지 */}
        {isToastOpen && (
            <Toast>
            주문이 취소됐어요
            </Toast>
        )}
        </Section>
    )
    }

export default WaitingOrder


const Section = styled.section`
    padding: 0px 16px 32px;
    background-color: #F6F6F6;
    position: relative;
    gap: var(--Spacing-M, 12px);
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    color: var(--Neutral-900, #2B5276);
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px; /* 140% */
`

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--Spacing-XL, 24px);
    align-self: stretch;
`

const Card = styled.div`
    display: flex;
    padding: var(--Spacing-L, 16px);
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    border-radius: var(--Radius-L, 16px);
    background: var(--Neutral-0, #FFF);
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
    background: var(--Primary-900, #263C54);
`

const Left = styled.div`
    display: flex;
    width: 79px;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--Spacing-S, 8px);
    flex-shrink: 0;
`

const LeftText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
`

const StockName = styled.div`
    color: var(--Neutral-900, #333);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
`

const StockSub = styled.div`
    color: var(--Neutral-500, #6D6D6D);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
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
    color: #6D6D6D;
    background: var(--Neutral-100, #E7E7E7);
`

const EditButton = styled(BaseButton)`
    background: var(--Primary-500, #4880AF);
    color: #ffffff;
`

/* 모달 */
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
    padding: var(--Spacing-XL, 24px) var(--Spacing-L, 16px) var(--Spacing-L, 16px) var(--Spacing-L, 16px);
    flex-direction: column;
    justify-content: center;
    gap: var(--Spacing-XL, 24px);
    border-radius: var(--Radius-M, 12px);
    background: var(--Neutral-0, #FFF);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const ModalText = styled.div`
    font-size: 16px;
    text-align: center;
    color: #333333;
`

const ModalButtonRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

const ModalSecondary = styled(BaseButton)`
    background-color: #e5e5e5;
    color: #555555;
    flex: 1;
`

const ModalPrimary = styled(BaseButton)`
    background-color: #4880af;
    color: #ffffff;
    flex: 1;
`

/* 토스트 */
const Toast = styled.div`
    position: fixed;
    left: 50%;
    bottom: 346px;
    transform: translateX(-50%);
    padding: var(--Spacing-XL, 24px) var(--Spacing-L, 16px);
    border-radius: var(--Radius-M, 12px);
    background: var(--Neutral-0, #FFF);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
    font-size: 14px;
    color: #333333;
    z-index: 1000;
`