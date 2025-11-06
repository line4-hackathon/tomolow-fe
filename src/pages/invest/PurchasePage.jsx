import InvestHeader from '@/components/invest/InvestHeader'
import Numpad from '@/components/invest/NumPad'
import PurchasCount from '@/components/invest/PurchaseCount'
import PurchasePrice from '@/components/invest/PurchasePrice'
import styled from 'styled-components'
import RedButton from '@/components/invest/RedButton'
import { useState } from 'react'
import CancelModal from '@/components/common/CancelModal'
import CashLackModal from '@/components/invest/CashLackModal'
import ReceiptModal from '@/components/invest/ReceiptModal'

export default function InvestPurchasePage() {
  const [isFocus, setIsFocus] = useState(true)
  const [price, setPrice] = useState('')
  const [count, setCount] = useState('')
  const [isModal, setIsModal] = useState(false)
  const myCash = 20000
  let modal
  const purchase = () => {
    console.log('모달')
    if (price * count > myCash) {
      modal = <CashLackModal />
    } else {
      modal = <ReceiptModal />
    }

    setIsModal(true)
  }
  const maxCount = () => {
    setCount(parseInt(myCash / price))
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
        <a>보유 현금 : 1,000,000,000원</a>
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
        <RedButton width='343px' height='56px' onClick={() => purchase()} />
      </Bar>
      {isModal ? (
        <>
          {price * count > myCash ? (
            <CashLackModal setIsModal={setIsModal} />
          ) : (
            <ReceiptModal setIsModal={setIsModal} />
          )}
        </>
      ) : (
        <></>
      )}
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
