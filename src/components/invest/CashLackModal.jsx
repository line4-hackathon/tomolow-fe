// src/components/~~/CashLackModal.jsx
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import GrayButton from '../common/GrayButton'
import NavyButton from '../common/NavyButton'

export default function CashLackModal({ setIsModal }) {
  const navigate = useNavigate()

  const handleChargeClick = () => {
    setIsModal(false)        
    navigate('/mypage/charge') // 충전 페이지로 이동
  }

  return (
    <BackGround>
      <Modal>
        <a>현금이 부족해요</a>
        <ButtonBox>
          <GrayButton
            name="닫기"
            width="120px"
            height="40px"
            onClick={() => setIsModal(false)}
          />
          <NavyButton
            name="충전하기"
            width="120px"
            height="40px"
            onClick={handleChargeClick}
          />
        </ButtonBox>
      </Modal>
    </BackGround>
  )
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
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  color: var(--Neutral-900, #333);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

const ButtonBox = styled.div`
  display: flex;
  gap: 12px;
`