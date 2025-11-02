import React from 'react'
import * as S from './Header.styled'
import backIcon from '@/assets/icons/icon-back.svg'
import { useNavigate } from 'react-router-dom'

function Header({ title, icon = backIcon, showIcon = false, path = '/' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
  }
  return (
    <S.HeaderBar>
      {showIcon ? <S.Icon src={icon} alt='뒤로가기' onClick={handleClick} /> : <S.Spacer />}
      <S.Title>{title}</S.Title>
      <S.Spacer />
    </S.HeaderBar>
  )
}

export default Header
