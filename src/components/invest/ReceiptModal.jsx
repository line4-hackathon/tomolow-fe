import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import GrayButton from '../common/GrayButton'
import NavyButton from '../common/NavyButton'
import RedButton from './RedButton'
import BlueButton from './BlueButton'
import { APIService } from '@/pages/invest/api'
import useStockStore from '@/stores/stockStores'
import { useType } from '@/contexts/TypeContext'
import useGroupStore from '@/stores/groupStores'

export default function ReceiptModal({ setIsModal, isPurchase, count, price }) {
  const navigate = useNavigate()
  const { stockData, setStockData } = useStockStore()
  const type = useType()
  const { groupData } = useGroupStore()

  const purchaseOrsell = (p) => {
    let purchaseUrl
    let sellUrl
    if (type == 'group') {
      purchaseUrl = `/api/group/${groupData.groupId}/buy/limit/${stockData.marketId}`
      sellUrl = `/api/group/${groupData.groupId}/sell/limit/${stockData.marketId}`
    } else {
      purchaseUrl = `/api/buy/limit/${stockData.marketId}`
      sellUrl = `/api/sell/limit/${stockData.marketId}`
    }
    if (p) {
      const purchase = async () => {
        try {
          const res = await APIService.private.post(purchaseUrl, {
            quantity: parseInt(count),
            price: parseInt(price),
          })
          navigate('/invest/trading', {
            state: {
              toastMessage: '매수 주문이 완료됐어요',
            },
          })
        } catch (error) {
          console.log('매수 실패')
          return
        }
      }
      purchase()
    } else {
      const sell = async () => {
        try {
          const res = await APIService.private.post(sellUrl, {
            quantity: parseInt(count),
            price: parseInt(price),
          })
          navigate('/invest/trading', {
            state: {
              toastMessage: '매도 주문이 완료됐어요',
            },
          })
        } catch (error) {
          console.log('매도 실패')
          return
        }
      }
      sell()
    }
  }
  return (
    <BackGround>
      <Modal>
        <StockInfoBox>
          <StockName>{stockData.name}</StockName>
          <StockCount>
            {count}주{' '}
            {isPurchase ? (
              <a style={{ color: '#FF2E4E' }}>매수</a>
            ) : (
              <a style={{ color: '#0084FE' }}>매도</a>
            )}
          </StockCount>
        </StockInfoBox>
        <RecieptBox>
          <RecieptText>
            <Title>1주 희망 가격</Title>
            <Price>{parseInt(price).toLocaleString()}원</Price>
          </RecieptText>
          <RecieptText>
            <Title>총 주문 금액</Title>
            <Price>{(price * count).toLocaleString()}원</Price>
          </RecieptText>
        </RecieptBox>
        <ButtonBox>
          <GrayButton name='닫기' width='120px' height='40px' onClick={() => setIsModal(false)} />
          {isPurchase ? (
            <RedButton width='120px' height='40px' onClick={() => purchaseOrsell(true)} />
          ) : (
            <BlueButton width='120px' height='40px' onClick={() => purchaseOrsell(false)} />
          )}
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
  height: 244px;
  gap: var(--Spacing-XL, 24px);
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const StockInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const StockName = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;
  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
const StockCount = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;
  /* Head-Medium */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
`
const RecieptBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const RecieptText = styled.div`
  display: flex;
  justify-content: space-between;
  width: 252px;
`
const Title = styled.div`
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const Price = styled.div`
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
