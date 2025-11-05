import React from 'react'
import * as S from './Modal.styled'
import ModalButton from './ModalButton'
function Modal({
  isOpen = false,
  title,
  text,
  hasInput = false,
  inputValue,
  setInputValue,
  placeholder,
  leftButtonLabel = '다음',
  rightButtonLabel = '닫기',
  onLeftClick,
  onRightClick,
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
