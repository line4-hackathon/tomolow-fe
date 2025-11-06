import styled from 'styled-components'
import NewsCard from './NewsCard'
import NewsIcon from '@/assets/icons/icon-news.svg?react'

export default function EtcNews() {
  const isNews = 0

  return (
    <>
      {isNews ? (
        <NewsCardBox>
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </NewsCardBox>
      ) : (
        <NothingBox>
          <NewsIcon />
          <a>관련 뉴스가 없어요</a>
        </NothingBox>
      )}
    </>
  )
}

const NewsCardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const NothingBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 130px;

  color: var(--Neutral-300, #b0b0b0);
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
