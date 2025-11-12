import styled from 'styled-components'
import GrayButton from './GrayButton'
import NavyButton from './NavyButton'
import { APIService } from '@/pages/invest/api'

export default function CancelModal({setIsModal,orderId}) {
  const orderCancel=async ()=>{
    try{
      const res=await APIService.private.delete(`/api/orders/pending`,{ orderId:{orderId}})
    }catch(error){
      console.log("주문 취소 실패");
    }
  }
  return (
  <BackGround>
    <Modal>
        <a>주문을 취소할까요?</a>
        <ButtonBox>
            <GrayButton name="닫기" width="120px" height="40px" onClick={()=>setIsModal(false)}/>
            <NavyButton name="취소하기" width="120px" height="40px" onClick={()=>orderCancel()}/>
        </ButtonBox>
    </Modal>
  </BackGround>)
}

const BackGround = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  height: 100dvh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`
const Modal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 284px;
  height: 136px;
  gap: var(--Spacing-XL, 24px);
  border-radius: var(--Radius-M, 12px);
background: var(--Neutral-0, #FFF);

/* Bottom */
box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  color: var(--Neutral-900, #333);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const ButtonBox = styled.div`
  display: flex;
  gap: 12px;
`
