import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStockStore from '@/stores/stockStores'
import axios from 'axios'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import Modal from '@/components/common/Modal'
import Toast from '@/components/common/Toast'
import Loading from '@/components/common/Loading'
import ListEmpty from '@/components/group/ListEmpty'

const GroupWaitingOrdersPage = () => {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const modal = useModal()
  const [toastMessage, setToastMessage] = useState('')
  const [cancelItem, setCancelItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [waitingList, setWaitingList] = useState([])
  const { setStockData } = useStockStore()
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    const getWaitingLists = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${apiUrl}/api/group/${groupId}/pending/list`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setWaitingList(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getWaitingLists()
  }, [groupId])

  // 정정 버튼 클릭시
  const handleEditClick = (item) => {
    setStockData({
      marketId: item.marketId,
    })

    navigate(`/group/invest/correction`, {
      state: { orderId: item.orderId },
    })
  }

  // 취소 버튼 클릭시
  const handleCancelClick = (item) => {
    setCancelItem(item)
    modal.open()
  }
  const handleClose = () => {
    modal.close()
  }

  const handleCancelConfirm = async () => {
    try {
      if (!cancelItem) return

      const res = await axios.delete(`${apiUrl}/api/group/${groupId}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { orderId: cancelItem.orderId },
      })

      if (res.data.success) {
        setWaitingList((prev) => prev.filter((item) => item.orderId !== cancelItem.orderId))
        setToastMessage('주문이 취소됐어요')
      } else {
        console.error(res.data.message)
      }
    } catch (err) {
      console.log(err)
    } finally {
      modal.close()
      setCancelItem(null)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      <Scrollable>
        <Header title='대기주문' showIcon={true} path={`/group/home/${groupId}`} />
        <Container>
          <List>
            {waitingList.length > 0 ? (
              waitingList.map((item) => (
                <Item key={item.orderId}>
                  <Left>
                    <Img src={item.imageUrl} />
                    <LeftText>
                      <Name>{item.marketName}</Name>
                      <Quantity>{`${item.quantity}주`}</Quantity>
                    </LeftText>
                  </Left>
                  <Right>
                    <CancelButton onClick={() => handleCancelClick(item)}>취소</CancelButton>
                    <EditButton onClick={() => handleEditClick(item)}>정정</EditButton>
                  </Right>
                </Item>
              ))
            ) : (
              <ListEmpty emptyMessage={'보유한 자산이 없어요.'} />
            )}
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
        onRightClick={handleCancelConfirm}
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
  flex: 1;
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
const Img = styled.img`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 33px;
`
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
  margin: 4px 0;
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
