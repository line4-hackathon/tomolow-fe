import InvestHeader from '@/components/invest/InvestHeader'
import Numpad from '@/components/invest/NumPad'
import PurchasCount from '@/components/invest/PurchaseCount'
import PurchasePrice from '@/components/invest/PurchasePrice'
import styled from 'styled-components'
import RedButton from '@/components/invest/RedButton'
import CancelModal from '@/components/common/CancelModal'
import CashLackModal from '@/components/invest/CashLackModal'
import ReceiptModal from '@/components/invest/ReceiptModal'
import BlueButton from '@/components/invest/BlueButton'
import Toast from '@/components/invest/ToastMessage'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export default function InvestPurchasePage({ myCash, myStockCount }) {
  const [isFocus, setIsFocus] = useState(true)
  const [price, setPrice] = useState('')
  const [count, setCount] = useState('')
  const [isModal, setIsModal] = useState(false)
  const location = useLocation()
  const { state } = location
  myCash = 20000 //임의 지정
  myStockCount = 30
  const purchase = () => {
    if(price && count){
    if (price * count > myCash) {
      setIsModal(<CashLackModal setIsModal={setIsModal}/>)
    } else {
      setIsModal(<ReceiptModal setIsModal={setIsModal} isPurchase={true}/>)
    }
  }
  }
  const sell = () => {
    if(price && count){
    if (count > myStockCount) {
      setToastVisible(true)
    } else {
      setIsModal(<ReceiptModal setIsModal={setIsModal} isPurchase={false}/>)
    }
  }
  }
  const [toastVisible, setToastVisible] = useState(false)

  // 토스트 닫기 핸들러: 토스트를 숨기도록 상태 변경
  const handleCloseToast = () => {
    setToastVisible(false)
  }
  const maxCount = () => {
    if(state.purchase){
      setCount(parseInt(myCash / price))
    } else {
      setCount(myStockCount)
    }
    
  }

  return (
    <Page>
      <InvestHeader />
      <PurchaseBox>
        <PurchasePrice onClick={() => setIsFocus(true)} price={price} />
        <PurchasCount
          onClick={() => setIsFocus(false)}
          count={count}
          price={price}
          maxCount={maxCount}
        />
        {state.purchase ? <a>보유 현금 : 1,000,000,000원</a> : ''}
      </PurchaseBox>
      <Numpad
        isFocus={isFocus}
        currentValue={isFocus ? price : count}
        setPrice={setPrice}
        setCount={setCount}
        price={price}
        count={count}
      />
      <Bar>
        {state.purchase ? (
          <RedButton width='343px' height='56px' onClick={() => purchase()} />
        ) : (
          <BlueButton width='343px' height='56px' onClick={() => sell()} />
        )}
      </Bar>
      {isModal}
      <AnimatePresence>
        {toastVisible && (
          <Toast
            message="최대 판매가능 수량은 34주입니다"
            onClose={handleCloseToast}
            // duration을 props로 전달할 수 있으나, Toast.jsx 내부에서 기본값 2500ms를 사용합니다.
          />
        )}
      </AnimatePresence>
    </Page>
  )
}
const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 27px;
`
const PurchaseBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  color: var(--Neutral-400, #888);
  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const Bar = styled.footer`
  display: flex;
  width: 375px;
  align-items: center;
  justify-content: center;
  height: 88px;
  gap: 21px;
`
