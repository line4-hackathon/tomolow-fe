import React from 'react'
import styled from 'styled-components'
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
    <HeaderBar>
      {showIcon ? <Icon src={icon} alt='뒤로가기' onClick={handleClick} /> : <Spacer />}
      <Title>{title}</Title>
      <Spacer />
    </HeaderBar>
  )
}

export default Header

const HeaderBar = styled.header`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  width: 343px;
  padding: 18px 16px;
  background: var(--Neutral-0, #fff);
  border-bottom: 0.5px solid var(--Neutral-100, #e7e7e7);
`

const Icon = styled.img`
  cursor: pointer;
`

const Title = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #333333;
`

const Spacer = styled.div`
  width: 24px;
  height: 24px;
`
