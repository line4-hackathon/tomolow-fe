import { PriceTypes } from '@/pages/invest/selectType'
import styled from 'styled-components'
import useSelect from '@/hooks/select'
import { useEffect } from 'react'
import useStockStore from '@/stores/stockStores'

export default function PurchasePrice({ onClick, price, setPrice }) {
  const { selectedMenu, handleSelect } = useSelect('CUSTOM')
  const {stockData,setStockData}=useStockStore();
  useEffect(() => {
    if (selectedMenu === 'MARKET') {
      setPrice(stockData.price)
    }
  }, [selectedMenu])
  return (
    <Box>
      <ButtonBox>
        {Object.keys(PriceTypes).map((key) => (
          <PriceButton
            key={key}
            onClick={() => handleSelect(key)}
            // 3. 현재 선택된 메뉴 감지 및 스타일 적용
            $isSelected={selectedMenu === key ? true : false}
          >
            {PriceTypes[key]} {/* 사용자에게 보이는 메뉴 이름 */}
          </PriceButton>
        ))}
      </ButtonBox>
      {selectedMenu === 'CUSTOM' ? (
        <Price>
          <PriceInput value={price} readOnly onClick={onClick} />원
        </Price>
      ) : (
        <MarketPrice>최대한 빠른 가격</MarketPrice>
      )}
    </Box>
  )
}
const Box = styled.div`
  display: flex;
  width: 343px;
  height: 112px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
  width: 310px;
  justify-content: flex-start;
`
const PriceButton = styled.div`
  border-bottom: ${({ $isSelected }) =>
    $isSelected ? '1px solid var(--Clicked-P_600, #2b5276)' : 'none'};
  color: ${({ $isSelected }) => ($isSelected ? '#2B5276' : '#B0B0B0')};
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  &:hover {
    cursor: pointer;
  }
`
const PriceInput = styled.input`
  max-width: 300px;
  color: var(--Neutral-900, #333);

  /* Title-Semi Bold */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
  border: none;
  &:focus {
    outline: none;
  }
`
const Price = styled.div`
  display: flex;
  color: var(--Neutral-900, #333);

  /* Title-Semi Bold */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
  border: none;
`
const MarketPrice = styled.div`
  width: 310px;
  color: var(--Neutral-900, #333);

  /* Title-Semi Bold */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
`
