import React, { useState, useEffect } from 'react'
import * as S from '@/components/common/Modal.styled'
import styled from 'styled-components'
import DateRow from './DateRow'
import ModalButton from '../common/ModalButton'

function DateModal({
  isOpen = false,
  value = { start: '', end: '' },
  leftButtonLabel = '닫기',
  rightButtonLabel = '적용',
  onLeftClick,
  onRightClick,
}) {
  // YYYY-MM-DD 형태로 들어오면 객체 형태로 파싱
  const parseYMD = (str) => {
    const [y, m, d] = str.split('-').map(Number)
    return { y, m, d }
  }

  const [start, setStart] = useState(parseYMD(value.start))
  const [end, setEnd] = useState(parseYMD(value.end))

  useEffect(() => {
    if (isOpen) {
      setStart(parseYMD(value.start))
      setEnd(parseYMD(value.end))
    }
  }, [value])

  return (
    <S.Background>
      <S.ModalContainer>
        <Field>
          <Label>시작일</Label>
          <DateRow value={start} onChange={setStart} />
        </Field>
        <Field>
          <Label>종료일</Label>
          <DateRow value={end} onChange={setEnd} />
        </Field>
        <S.ButtonContainer>
          <ModalButton
            label={leftButtonLabel}
            color={'#6D6D6D'}
            backgroundcolor={'#E7E7E7'}
            onClick={onLeftClick}
          />
          <ModalButton
            label={rightButtonLabel}
            color={'#FFF'}
            backgroundcolor={'#4880AF'}
            onClick={() => {
              const format = (v) =>
                `${v.y}-${String(v.m).padStart(2, '0')}-${String(v.d).padStart(2, '0')}`

              const startDate = format(start)
              const endDate = format(end)

              if (new Date(startDate) > new Date(endDate)) {
                alert('시작일은 종료일보다 늦을 수 없습니다.')
                return
              }

              onRightClick({
                start: startDate,
                end: endDate,
              })
            }}
          />
        </S.ButtonContainer>
      </S.ModalContainer>
    </S.Background>
  )
}

export default DateModal

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
