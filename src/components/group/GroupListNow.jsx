import React from 'react'
import { useNavigate } from 'react-router-dom'
import List from './List'

const GroupListNow = () => {
  const navigate = useNavigate()
  const handleItemClick = () => {
    // 해당 그룹 페이지로 이동
    navigate('/group/home')
  }
  return (
    <>
      <List onClick={handleItemClick} />
    </>
  )
}

export default GroupListNow
