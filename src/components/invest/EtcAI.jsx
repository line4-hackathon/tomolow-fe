import styled from 'styled-components'
import NewsCard from './NewsCard'
import RobotIcon from '@/assets/icons/icon-robot.svg?react'

export default function EctAI() {
  const isAI = 0
  return (
    <Box>
      {isAI ? (
        <>
          <AIBox>
            <AIMessage>
              <RobotIcon />
              최신 뉴스 기반으로 AI가 작성한 보고서예요
            </AIMessage>
            <AIMessageCard>
              삼성전자는 미국 실리콘밸리에서 ‘2025 테크 포럼’을 개최하며 AI·차세대 기술 전략을
              공개했고, 이는 기술 리더십 강화 신호로 해석됩니다. 가전·AI 홈 시장에서 ‘AI 구독
              페스타’ 등 구독형 모델을 확대해 수익 구조 다각화에도 주력하고 있습니다. 덕분에 현재
              주가 상승 중이라고 판단됩니다.
            </AIMessageCard>
          </AIBox>
          <NewsCardBox>
            <a>출처 뉴스</a>
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </NewsCardBox>
        </>
      ) : (
        <NothingBox>
          <RobotIcon />
          관련 정보가 부족해 분석에 실패했어요
        </NothingBox>
      )}
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`
const AIBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`
const AIMessage = styled.div`
  display: flex;
  gap: 3px;
  padding-left: 20px;
  color: var(--Neutral-400, #888);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const AIMessageCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 311px;
  padding: 24px 16px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Neutral-0, #fff);

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
const NewsCardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
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
