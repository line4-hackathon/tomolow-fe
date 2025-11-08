import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/useModal'
import List from './List'
import Modal from '../common/Modal'

const GroupListRecruting = () => {
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState(null)
  // 모달 관리
  const modal = useModal()

  const handleItemClick = (item) => {
    setSelectedItem(item)
    modal.open()
  }
  const handleClose = () => {
    modal.close()
    setSelectedItem(null)
  }

  const handleCheckCode = () => {
    // 연동 필요
    if (modal.code === 'aaaa') {
      modal.goSuccess()
    } else {
      modal.goFail()
    }
  }

  const handleNavigate = () => {
    navigate('/')
    modal.close()
    setSelectedItem(null)
  }

  const handleRetry = () => {
    modal.retry()
  }

  return (
    <>
      <List onClick={handleItemClick} />
      {modal.isOpen && modal.step === 1 && (
        <Modal
          isOpen={modal.isOpen}
          title='입장코드 입력'
          hasInput={true}
          inputValue={modal.code}
          setInputValue={modal.setCode}
          placeholder='전달 받은 입장코드 입력'
          leftButtonLabel='닫기'
          rightButtonLabel='다음'
          onLeftClick={handleClose}
          onRightClick={handleCheckCode}
        />
      )}
      {modal.isOpen && modal.step === 2 && (
        <Modal
          isOpen={modal.isOpen}
          title={`${selectedItem?.title}`}
          text={`만든 사람: \n참가비 : \n참가 인원 :`}
          leftButtonLabel='닫기'
          rightButtonLabel='참가하기'
          onLeftClick={handleClose}
          onRightClick={handleNavigate}
        />
      )}
      {modal.isOpen && modal.step === 3 && (
        <Modal
          isOpen={modal.isOpen}
          title={'입장코드를 다시 확인해주세요.'}
          leftButtonLabel='닫기'
          rightButtonLabel='다시 입력하기'
          onLeftClick={handleClose}
          onRightClick={handleRetry}
        />
      )}
    </>
  )
}

export default GroupListRecruting
