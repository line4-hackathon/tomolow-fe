import React from 'react'
import List from './List'

const GroupListNow = () => {
  const handleItemClick = () => {
    // 해당 그룹 페이지로 이동
    console.log('페이지 이동')
  }
  return (
    <>
      <List onClick={handleItemClick} />
    </>
  )
}

export default GroupListNow
