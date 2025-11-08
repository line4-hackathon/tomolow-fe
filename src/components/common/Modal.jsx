import React from 'react'
import * as S from './Modal.styled'
import ModalButton from './ModalButton'
function Modal({
  isOpen = false, // 모달 오픈 여부
  title, // 모달 내 진한 글씨
  text, // 모달 연한 글씨
  hasInput = false, // input field 존재하는지
  inputValue,
  setInputValue,
  placeholder,
  leftButtonLabel = '다음', // 왼쪽 버튼
  rightButtonLabel = '닫기', // 오른쪽 버튼
  onLeftClick, // 왼쪽 버튼 클릭 이벤트
  onRightClick, // 오른쪽 버튼 클릭 이벤트
}) {
  if (!isOpen) return null
  return (
    <S.Background>
      <S.ModalContainer>
        {title && <S.Title>{title}</S.Title>}
        {text && <S.Text>{text}</S.Text>}

        {hasInput && (
          <S.Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
          />
        )}
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
            onClick={onRightClick}
          />
        </S.ButtonContainer>
      </S.ModalContainer>
    </S.Background>
  )
}

export default Modal
