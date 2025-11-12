import React, { useState } from 'react'
import styled from 'styled-components'
import DateChip from './DateChip'

function DateRow({ value, onChange }) {
  // 넘어온 날짜값 분해
  const { y, m, d } = value

  // 연도 배열 생성
  const startYear = 2025
  const currentYear = new Date().getFullYear()
  const length = currentYear - startYear + 1
  const yearOptions = []
  for (let i = 0; i < length; i++) {
    yearOptions.push(startYear + i)
  }

  // 월별 마지막 날짜 계산
  const daysInMonth = new Date(y, m, 0).getDate()
  const dayOptions = []
  for (let i = 1; i <= daysInMonth; i++) {
    dayOptions.push(i)
  }
  const [openChip, setOpenChip] = useState(null)
  const handleChipClick = (type) => {
    setOpenChip((prev) => (prev === type ? null : type))
  }

  const handleSelect = (newValue) => {
    onChange(newValue)
    setOpenChip(null) // 항목을 선택하면 무조건 칩을 닫음
  }

  return (
    <Row>
      <DateChip
        type='year'
        value={y}
        options={yearOptions}
        isOpen={openChip === 'year'}
        onClick={() => handleChipClick('year')}
        onSelect={(yy) => handleSelect({ y: yy, m, d })}
      />
      <Span>년</Span>
      <DateChip
        type='month'
        value={m}
        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        isOpen={openChip === 'month'}
        onClick={() => handleChipClick('month')}
        onSelect={(mm) => handleSelect({ y, m: mm, d })}
      />
      <Span>월</Span>
      <DateChip
        type='day'
        value={d}
        options={dayOptions}
        isOpen={openChip === 'day'}
        onClick={() => handleChipClick('day')}
        onSelect={(dd) => handleSelect({ y, m, d: dd })}
      />
      <Span>일</Span>
    </Row>
  )
}

export default DateRow

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

const Span = styled.span`
  color: var(--Neutral-900, #333);

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
