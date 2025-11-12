import styled from 'styled-components'
import OrderCard from '../common/OrderCard'

import Document from '@/assets/icons/icon-document.svg?react'

export default function ({data}) {
  return (
    <Box>
      <WaitingOrder>대기 중인 주문</WaitingOrder>
      <OrderCardBox>
        {data && data.length>0 ? (
          <>
          {data.map((data)=><OrderCard data={data}/>)}
          </>
        ) : (
          <NothingBox>
            <Document />
            <a>주문한 내역이 없어요</a>
          </NothingBox>
        )}
      </OrderCardBox>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  width: 343px;
`
const WaitingOrder = styled.div`
  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const OrderCardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const NothingBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--Neutral-300, #b0b0b0);
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
