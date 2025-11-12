import InvestHeader from '@/components/invest/InvestHeader'
import Numpad from '@/components/invest/NumPad'
import PurchasePrice from '@/components/invest/PurchasePrice'
import styled from 'styled-components'
import BlackButton from '@/components/invest/BlackButton'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CorrectionModal from '@/components/invest/CorrectionModal'
import useStockStore from '@/stores/stockStores'
import useGroupStore from '@/stores/groupStores'

export default function InvestCorrectionPage() {
  const [isModal, setIsModal] = useState(false)
  const { stockData } = useStockStore()
  const { groupData } = useGroupStore()
  const [price, setPrice] = useState(stockData.price)
  const [myCash,setMyCash]=useState(0);
  const location=useLocation();
  const {state}=location
  const orderId=sessionStorage.getItem('orderId')


  useEffect(() => {
    let purchaseUrl
    if (type == 'group') {
      purchaseUrl = `/api/group/${groupData.groupId}/buy/limit/${stockData.marketId}?price=1000`
    } else {
      purchaseUrl = `/api/buy/limit/${stockData.marketId}?price=1000`
    }
    const purchaseGet = async () => {
      try {
        const res = await APIService.private.get(purchaseUrl)

        setMyCash(res.data.userCashBalance)
      } catch (error) {
        console.log('현금 조회 실패')
      }
    }
    purchaseGet()
    sessionStorage.setItem('orderId', state.orderId)
  }, [])

  return (
    <Page>
      <InvestHeader />
      <PurchaseBox>
        <PurchasePrice price={price} setPrice={setPrice} />
        <a>보유 현금 : {myCash.toLocaleString()}원</a>
      </PurchaseBox>
      <Numpad isFocus={true} currentValue={price} setPrice={setPrice} price={price} />
      <Bar>
        <BlackButton name='정정하기' width='343px' height='56px' onClick={() => setIsModal(true)} />
      </Bar>
      {isModal && <CorrectionModal setIsModal={setIsModal} price={price} orderId={orderId}/>}
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
  gap: 5px;
  padding-top: 32px;
  padding-left: 16px;
  background-color: #f6f6f6;
  width: 359px;
  height: 318px;

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
