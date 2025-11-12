import styled from 'styled-components'

import GrayButton from './GrayButton'
import NavyButton from './NavyButton'
import { useState } from 'react'
import CancelModal from './CancelModal'
import { useNavigate } from 'react-router-dom'

export default function OrderCard({ data }) {
  const [isModal,setIsModal]=useState(false);
  const navigate=useNavigate()

  return (
    <Card>
      {data.imageUrl ? <img src={data.imageUrl}/>:  <Logo />}
      <InfoBox>
        <Amount>{data.quantity}주 {data.tradeType==="BUY" ? "매수":"매도"}</Amount>
        <Price>주당 {data.limitPrice.toLocaleString()}원</Price>
      </InfoBox>
      <GrayButton name='취소' width='47px' height='47px' onClick={()=>setIsModal(true)}/>
      <NavyButton name='정정' width='47px' height='47px' onClick={()=>navigate("/invest/correction",{state:{orderId:data.orderId}})}/>
      {isModal ? <CancelModal setIsModal={setIsModal} orderId={data.orderId}/>:<></>}
    </Card> 
  )
}

const Card = styled.div`
  display: flex;
  padding: var(--Spacing-L, 16px);
  justify-content: center;
  gap: 10px;
  align-self: stretch;
  width: 311px;

  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: var(--Primary-900, #263c54);
`
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: auto;
`
const Amount = styled.div`
  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const Price = styled.div`
  color: var(--Neutral-500, #6d6d6d);
  text-align: center;

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`

