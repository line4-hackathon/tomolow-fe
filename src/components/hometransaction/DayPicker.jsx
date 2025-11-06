import React, { useState } from 'react'
import useModal from '@/hooks/useModal'
import styled from 'styled-components'
import DateModal from './DateModal'
import DownArrow from '@/assets/icons/icon-down-arrow.svg?react'

const DayPicker = ({ value, onApply }) => {
  // 날짜 모달 관리
  const { isOpen, open, close } = useModal()

  // DayPicker에 보여줄 형식(yyyy.mm.dd)
  const formatDate = (str) => {
    const [y, m, d] = str.split('-').map(Number)
    const local = new Date(y, m - 1, d)
    return `${y}. ${m}. ${d}`
  }

  const handleModal = () => {
    open()
  }

  const handleClose = () => {
    close()
  }

  const handleApply = (newRange) => {
    if (newRange.start !== value.start || newRange.end !== value.end) {
      onApply(newRange)
    }
    close()
  }

  return (
    <>
      <Container onClick={handleModal}>
        <DateText>{`${formatDate(value.start)} ~ ${formatDate(value.end)}`}</DateText>
        <Icon />
      </Container>
      {isOpen && (
        <DateModal
          isOpen={isOpen}
          value={value}
          onLeftClick={handleClose}
          onRightClick={handleApply}
        />
      )}
    </>
  )
}

export default DayPicker

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  cursor: pointer;
`
const DateText = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
const Icon = styled(DownArrow)`
  position: absolute;
  right: 16px;
`
