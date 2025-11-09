// src/components/common/BottomNav.jsx
import React from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

// 활성 아이콘
import HomeOn from '@/assets/icons/menubar-icon/home.svg'
import InvestOn from '@/assets/icons/menubar-icon/invest.svg'
import learningOn from '@/assets/icons/menubar-icon/learning.svg'
import GroupOn from '@/assets/icons/menubar-icon/group.svg'
import MyOn from '@/assets/icons/menubar-icon/my.svg'

// 비활성 아이콘
import HomeOff from '@/assets/icons/menubar-icon/home-off.svg'
import InvestOff from '@/assets/icons/menubar-icon/invest-off.svg'
import learningOff from '@/assets/icons/menubar-icon/learning-off.svg'
import GroupOff from '@/assets/icons/menubar-icon/group-off.svg'
import MyOff from '@/assets/icons/menubar-icon/my-off.svg'

const MENUS = [
  { key: 'home', label: '홈', onIcon: HomeOn, offIcon: HomeOff, path: '/home' },
  { key: 'invest', label: '투자', onIcon: InvestOn, offIcon: InvestOff, path: '/invest/search' },
  { key: 'learning', label: '학습', onIcon: learningOn, offIcon: learningOff, path: '/learning' },
  { key: 'group', label: '그룹', onIcon: GroupOn, offIcon: GroupOff, path: '/group' },
  { key: 'my', label: 'MY', onIcon: MyOn, offIcon: MyOff, path: '/mypage' },
]

function MenuBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (path) => {
    if (!path) return
    navigate(path)
  }

  const isActive = (path) => {
    if (!path) return false
    return location.pathname.startsWith(path)
  }

  return (
    <Bar>
      {MENUS.map((item) => {
        const active = isActive(item.path)
        const iconSrc = active ? item.onIcon : item.offIcon
        return (
          <NavButton key={item.key} onClick={() => handleClick(item.path)}>
            <Icon src={iconSrc} alt={item.label} />
            <Label $active={active}>{item.label}</Label>
          </NavButton>
        )
      })}
    </Bar>
  )
}

export default MenuBar

const Bar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  height: 64px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.06);
  z-index: 100;
  overflow: hidden;
`

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 4px;
`

const Icon = styled.img`
  width: 26px;
  height: 26px;
`

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#4880AF' : '#D1D1D1')};
`
