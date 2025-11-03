import React, { useState } from 'react'
import List from './List'
import Modal from './Modal'

const GroupListRecruting = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [code, setCode] = useState('')

  const handleItemClick = (item) => {
    setIsOpen(true)
    setSelectedItem(item)
  }
  const handleClose = () => {
    setIsOpen(false)
    setCode('')
    setSelectedItem(null)
  }

  const handleNext = (item) => {
    console.log('다음 모달')
  }
  return (
    <>
      <List onClick={handleItemClick} />
      {isOpen && (
        <Modal
          isOpen={isOpen}
          title='입장코드 입력'
          hasInput={true}
          inputValue={code}
          setInputValue={setCode}
          placeholder='전달 받은 입장코드 입력'
          leftButtonLabel='닫기'
          rightButtonLabel='다음'
          onLeftClick={handleClose}
          onRightClick={handleNext}
        />
      )}
    </>
  )
}

export default GroupListRecruting
