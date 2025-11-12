import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import Modal from '@/components/common/Modal'
import Toast from '@/components/common/Toast'

// 더미데이터
const dummyData = [
  {
    id: 1,
    src: '/src/assets/images/logo-company.svg',
    name: '신한은행',
    quantity: 3,
    type: '매수',
  },
  { id: 2, src: '/src/assets/images/logo-company.svg', name: 'LG 전자', quantity: 5, type: '매수' },
  {
    id: 3,
    src: '/src/assets/images/logo-company.svg',
    name: '삼성전자',
    quantity: 20,
    type: '매수',
  },
]

const GroupWaitingOrdersPage = () => {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const modal = useModal()
  const [toastMessage, setToastMessage] = useState('')

  const handleButtonClick = () => {
    modal.open()
  }

  const handleClose = () => {
    modal.close()
  }

  const handleToast = () => {
    modal.close()
    setToastMessage('주문이 취소됐어요')
  }

  return (
    <>
      <Scrollable>
        <Header title='대기주문' showIcon={true} path={`/group/home/${groupId}`} />
        <Container>
          <List>
            {dummyData.map((item) => (
              <Item key={item.id}>
                <Left>
                  <Img src={item.src} />
                  <LeftText>
                    <Name>{item.name}</Name>
                    <Quantity>{`${item.quantity.toLocaleString()}주`}</Quantity>
                  </LeftText>
                </Left>
                <Right>
                  <CancelButton onClick={handleButtonClick}>취소</CancelButton>
                  <EditButton onClick={() => navigate('/group/invest/correction')}>정정</EditButton>
                </Right>
              </Item>
            ))}
          </List>
        </Container>
      </Scrollable>
      <MenuBar />
      <Modal
        isOpen={modal.isOpen}
        title={'주문을 취소할까요?'}
        leftButtonLabel='닫기'
        rightButtonLabel='취소하기'
        onLeftClick={handleClose}
        onRightClick={handleToast}
      />
      {toastMessage && <Toast msg={toastMessage} onClose={() => setToastMessage('')} />}{' '}
    </>
  )
}

export default GroupWaitingOrdersPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
`
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const Img = styled.img``
const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Name = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Quantity = styled.p`
  color: var(--Neutral-500, #6d6d6d);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const Right = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

const CancelButton = styled.button`
  padding: 12px;
  color: var(--Neutral-500, #6d6d6d);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  border: none;
  border-radius: var(--Radius-S, 8px);
  background: var(--Neutral-100, #e7e7e7);
  cursor: pointer;
`

const EditButton = styled.button`
  padding: 12px;
  color: var(--Neutral-500, #fff);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  border: none;
  border-radius: var(--Radius-S, 8px);
  background: var(--Primary-500, #4880af);
  cursor: pointer;
`
