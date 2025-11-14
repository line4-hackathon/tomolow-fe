import styled , {css} from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'


export default function HoldingStock({ stock }) {
  const navigate = useNavigate()

  if (!stock) return null

  const {
    name,
    symbol,
    price,
    changeRate,
    interested = false,
  } = stock

  const [isInterest, setIsInterest] = useState(!!interested)

  const formattedPrice = price?.toLocaleString?.() ?? price ?? '-'
  const formattedRate =
    changeRate !== undefined && changeRate !== null
      ? `${changeRate > 0 ? '+' : ''}${changeRate}%`
      : '-'

  const isUp = typeof changeRate === 'number' ? changeRate >= 0 : true

  // 보유 주식 카드 클릭 시 학습 > 기간 선택 페이지로 이동
  const handleCardClick = () => {
    navigate('/learning/select-date', {
      state: { stock }, // 기간 선택 페이지에서 useLocation().state.stock 으로 사용
    })
  }

  return (
    <Card onClick={handleCardClick}>
      <Logo $src={stock.imageUrl} />
      <TextBox>
        <Name>{name}</Name>
        <Detail>
          <Number>{symbol}</Number>
          <Price $up={isUp}>
            {formattedPrice}원({formattedRate})
          </Price>
        </Detail>
      </TextBox>
      <Interest
        onClick={(e) => {
          e.stopPropagation() // 카드 클릭으로 인한 이동 막기
          setIsInterest(!isInterest)
          // TODO: 관심 토글 API 붙이면 여기서 호출
        }}
      >
        {isInterest ? <RedHeart /> : <GrayHeart />}
      </Interest>
    </Card>
  )
}

/* styled */

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--Spacing-XL, 24px);
  align-self: stretch;
  width: 320px;

  &:hover {
    cursor: pointer;
  }
`

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: var(--Primary-900, #263c54);  /* 기본 원형 색 */

  ${({ $src }) =>
    $src &&
    css`
      background-image: url(${$src});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `}
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`

const Detail = styled.div`
  display: flex;
  gap: 12px;
`

const Name = styled.div`
  color: var(--Neutral-900, #333);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  align-self: stretch;
  margin-bottom: 8px;
`

const Number = styled.div`
  color: var(--Neutral-300, #b0b0b0);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`

const Price = styled.div`
  color: ${({ $up }) => ($up ? '#FF2E4E' : '#0084FE')};
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`

const Interest = styled.div`
  display: flex;
  margin-left: auto;
`