import styled from 'styled-components'
import GrayButton from '../common/GrayButton'
import BlackButton from './BlackButton'
import { useNavigate } from 'react-router-dom'
import { APIService } from '@/pages/invest/api'
import { useType } from '@/contexts/TypeContext'
import useGroupStore from '@/stores/groupStores'

export default function CorrectionModal({ setIsModal, price, orderId }) {
  const navigate = useNavigate()
  const type = useType()
  const { groupData } = useGroupStore()

  const correction = async () => {
    try {
      let url

      if (type === 'group') {
        // 그룹 API 경로
        url = `/api/group/${groupData.groupId}/pending`
      } else {
        // 개인 API 경로
        url = `/api/orders/pending`
      }

      const res = await APIService.private.put(url, {
        orderId,
        price: parseInt(price),
      })

      // 성공 후 이동
      if (type === 'group') {
        navigate('/group/invest/trading', {
          state: { toastMessage: '주문 정정이 완료됐어요' },
        })
      } else {
        navigate('/invest/trading', {
          state: { toastMessage: '주문 정정이 완료됐어요' },
        })
      }
    } catch (error) {
      console.log('주문 정정 실패:', error)
    }
  }

  return (
    <BackGround>
      <Modal>
        <a>주문을 정정하시겠어요?</a>
        <ButtonBox>
          <GrayButton name='닫기' width='120px' height='40px' onClick={() => setIsModal(false)} />
          <BlackButton name='정정하기' width='120px' height='40px' onClick={() => correction()} />
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
