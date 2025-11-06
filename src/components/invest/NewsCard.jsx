import styled from 'styled-components'

export default function NewsCard() {
  return (
    <Box>
      <NewsBox>
        <NewsTitle>뉴욕증시, 대만 TSMC ‘깜짝 실적'에 AI 낙관론 재점화</NewsTitle>
        <NewsSource>아시아경제</NewsSource>
      </NewsBox>
      <NewsImg/>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  width: 343px;
  height: 112px;

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const NewsBox = styled.div`
  display: flex;
  flex-direction: column;
`
const NewsTitle = styled.div`
  color: var(--Neutral-900, #333);
  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  width: 215px;
`
const NewsSource = styled.div`
  color: var(--Neutral-300, #b0b0b0);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const NewsImg = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-900, #263c54);
`
