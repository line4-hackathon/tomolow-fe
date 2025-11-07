import styled from 'styled-components'
import useSelect from '@/hooks/select'

import StockCard from '@/components/invest/stockCard'
import SearchBar from '@/components/common/searchBar'
import { menuTypes } from './selectType'
import NothingIcon from '@/assets/icons/icon-search-not.svg?react'
import NothingHeart from '@/assets/icons/icon-heart-navy.svg?react'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'

export default function InvestSearchPage() {
  const { selectedMenu, handleSelect } = useSelect('TRADING_AMOUNT')
  const isStock = 0

  return (
    <Page>
      <Header title='투자' />
      <Contents>
        <SearchBar explain='주식명 혹은 주식코드를 입력하세요' />
        <ListBox>
          {Object.keys(menuTypes).map((key) => (
            <List
              key={key}
              onClick={() => handleSelect(key)}
              // 3. 현재 선택된 메뉴 감지 및 스타일 적용
              $isMenu={selectedMenu === key ? true : false}
            >
              {menuTypes[key]} {/* 사용자에게 보이는 메뉴 이름 */}
            </List>
          ))}
        </ListBox>
        {isStock ? (
          <StockCardBox>
            <StockCard interest={true} />
            <Line />
            <StockCard interest={false} />
            <Line />
            <StockCard interest={true} />
            <Line />
            <StockCard interest={true} />
          </StockCardBox>
        ) : (
          <Nothing>
            {selectedMenu==="INTEREST" ? (
              <>
                <NothingHeart />
                <p>관심 주식이 없어요</p>
              </>
            ) : (
              <>
                <NothingIcon />
                <p>검색된 주식이 없어요</p>
              </>
            )}
          </Nothing>
        )}
      </Contents>
      <MenuBar/>
    </Page>
  )
}

const Page = styled.div``
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  gap: 12px;
  align-items: center;
  margin-top: 32px;
  gap: 32px;
`
const ListBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`
const List = styled.div`
  color: ${({ $isMenu }) => ($isMenu ? '#2B5276' : '#B0B0B0')};
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  border-bottom: ${({ $isMenu }) => ($isMenu ? '1px solid #2B5276' : '')};
  padding-bottom: var(--Spacing-S, 8px);
  &:hover {
    cursor: pointer;
  }
`
const StockCardBox = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--Neutral-200, #d1d1d1);
  flex-shrink: 0;
`
const Nothing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;

  color: var(--Neutral-300, #b0b0b0);
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
