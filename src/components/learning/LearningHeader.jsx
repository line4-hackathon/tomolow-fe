// src/components/common/Header.jsx
import React from 'react'
import styled from 'styled-components'
import backIcon from '@/assets/icons/icon-back.svg'
import SaveIcon from '@/assets/icons/icon-save.svg?react'
import { useNavigate } from 'react-router-dom'

function Header({
  title,
  icon = backIcon,
  showIcon = false,        // 아이콘 보여줄지 여부
  showSave = true,
  savePath = '/learning/save',
}) {

  const navigate = useNavigate()

  const handleSaveClick = () => {
    if (!savePath) return
    navigate(savePath)
  }

  return (
    <HeaderBar>
      {/* 🔥 뒤로가기 클릭해도 아무 동작 없음 */}
      {showIcon ? (
        <Icon src={icon} alt="뒤로가기" />
      ) : (
        <Spacer />
      )}

      <Title>{title}</Title>

      {/* Save 버튼 정상 동작 */}
      {showSave ? (
        <SaveButton type="button" onClick={handleSaveClick}>
          <SaveIcon />
        </SaveButton>
      ) : (
        <Spacer />
      )}
    </HeaderBar>
  )
}

export default Header


const HeaderBar = styled.header`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  width: 100%;
  max-width: 343px;
  z-index: 100;
  position: fixed;
  padding: 18px 16px;
  background: #fff;
  border-bottom: 0.5px solid #e7e7e7;
`

const Icon = styled.img`
  cursor: default; // 클릭 불가 느낌
  width: 24px;
  height: 24px;
`

const Title = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #333;
`

const Spacer = styled.div`
  width: 24px;
  height: 24px;
`

const SaveButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 0.8;
  }
`