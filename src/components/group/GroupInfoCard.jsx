import React from 'react'
import styled from 'styled-components'

function GroupInfoCard({
  money = '1,000,000원',
  code = '3A4rs3',
  leftDuration = '3일 12시간 14분 12초',
  member = '4명 / 4명',
}) {
  return (
    <CardGrid>
      <Text>시드머니: {`${money}`}</Text>
      <RightText>입장 코드: {`${code}`}</RightText>
      <Text>남은 기간: {`${leftDuration}`}</Text>
      <RightText>참가 인원: {`${member}`}</RightText>
    </CardGrid>
  )
}

export default GroupInfoCard

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 8px;
  padding: 16px;
  background: var(--Neutral-0, #fff);
`

const Text = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`

const RightText = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
  padding-left: 32px;
`
