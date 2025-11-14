import styled from 'styled-components'
import NewsCard from './NewsCard'
import RobotIcon from '@/assets/icons/icon-robot.svg?react'
import LoadingIcon from "@/assets/images/image-loading-gray.svg?react"

export default function EctAI({data}) {
  return (
    <Box>
      {data ? (
        <>
        {data && data.analysis.length>0 ? 
        <>
          <AIBox>
            <AIMessage>
              <RobotIcon />
              최신 뉴스 기반으로 AI가 작성한 보고서예요
            </AIMessage>
            <AIMessageCard>
              {data.analysis}
            </AIMessageCard>
          </AIBox>
          <NewsCardBox>
            <a>출처 뉴스</a>
            {data.sources && data.sources.length>0 ? <>{data.sources.map((data,index)=><NewsCard key={index} data={data}/>) }</>:<LoadingIcon/>}
            
          </NewsCardBox>
          </>
        :<NothingBox>
          <RobotIcon />
          관련 정보가 부족해 분석에 실패했어요
        </NothingBox>}
       </>): (
        <LoadingIcon/>
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
