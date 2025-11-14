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
import { useType } from '@/contexts/TypeContext'
import { APIService } from './api'
import useStockStore from '@/stores/stockStores'
import useGroupStore from '@/stores/groupStores'
export default function InvestPurchasePage() {
  const type = useType()
  const { stockData, setStockData } = useStockStore()
  const { groupData } = useGroupStore()
  const location = useLocation()
  const { state } = location
  const [isFocus, setIsFocus] = useState(true)
  const [price, setPrice] = useState(stockData.price)
  const [count, setCount] = useState('')
  const [isModal, setIsModal] = useState(false)
  const [myCash, setMyCash] = useState(0)
  const [myStockCount, setStockCount] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [marketPrice, setMarketPrice] = useState(0)
  let toastMessage = '최대 매도 가능 수량 초과입니다'

  const purchase = async () => {
    if (price && count) {
      if (price * count > myCash) {
        setIsModal(<CashLackModal setIsModal={setIsModal} />)
      } else {
        setIsModal(
          <ReceiptModal
            setIsModal={setIsModal}
            isPurchase={true}
            count={count}
            price={price}
            marketPrice={marketPrice}
          />,
        )
      }
    }
  }
  const sell = () => {
    if (price && count) {
      if (count > myStockCount) {
        toastMessage = `최대 판매가능 수량은 ${myStockCount}주입니다`
        setToastVisible(true)
      } else {
        setIsModal(
          <ReceiptModal setIsModal={setIsModal} isPurchase={false} count={count} price={price} />,
        )
      }
    }
  }

  // 토스트 닫기 핸들러: 토스트를 숨기도록 상태 변경
  const handleCloseToast = () => {
    setToastVisible(false)
  }
  const maxCount = () => {
    if (state.purchase) {
      setCount(parseInt(myCash / price))
    } else {
      setCount(myStockCount)
    }
  }

  useEffect(() => {
    let purchaseUrl
    let sellUrl
    if (type == 'group') {
      purchaseUrl = `/api/group/${groupData.groupId}/buy/market/${stockData.marketId}`
      sellUrl = `/api/group/${groupData.groupId}/sell/${stockData.marketId}`
    } else {
      purchaseUrl = `/api/buy/market/${stockData.marketId}`
      sellUrl = `/api/sell/${stockData.marketId}`
    }
    if (state.purchase) {
      const purchaseGet = async () => {
        try {
          const res = await APIService.private.get(purchaseUrl)
          setMyCash(type === 'group' ? res.data.userGroupCashBalance : res.data.userCashBalance)
          setMarketPrice(res.data.marketPrice)
        } catch (error) {
          console.log('현금 조회 실패')
        }
      }
      purchaseGet()
    } else {
      const sellGet = async () => {
        try {
          const res = await APIService.private.get(sellUrl)
          setStockCount(res.data.maxQuantity)
          setMarketPrice(res.data.marketPrice)
        } catch (error) {
          console.log('수량 조회 실패')
        }
      }
      sellGet()
    }
  }, [])

  return (
    <Page>
      <InvestHeader />
      <PurchaseBox>
        <PurchasePrice onClick={() => setIsFocus(true)} price={price} setPrice={setPrice} setIsFocus={setIsFocus}/>
        <PurchasCount
          onClick={() => setIsFocus(false)}
          count={count}
          price={price}
          maxCount={maxCount}
        />
        {state.purchase ? (
          <a style={{ marginRight: 'auto', marginLeft: '20px' }}>
            보유 현금 : {myCash.toLocaleString()}원
          </a>
        ) : (
          ''
        )}
      </PurchaseBox>
      <Numpad
        isFocus={isFocus}
        currentValue={isFocus ? String(price) : String(count)}
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
        {toastVisible && <Toast message={toastMessage} onClose={handleCloseToast} />}
      </AnimatePresence>
    </Page>
  )
}
const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PurchaseBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background-color: #f6f6f6;
  width: 375px;
  height: 350px;

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
