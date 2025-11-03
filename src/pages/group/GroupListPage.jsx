import React, { useState } from 'react'
import Header from '@/components/common/Header'
import * as S from '@/pages/group/GroupListPage.styled'
import GroupMiniButton from '@/components/group/GroupMiniButton'
import pinkSquare from '@/assets/images/img-pink-square.svg'
import yellowSqaure from '@/assets/images/img-yellow-square.svg'
import Tab from '@/components/group/Tab'
import GroupListNow from '@/components/group/GroupListNow'
import GroupListFinished from '@/components/group/GroupListFinished'
import GroupListRecruting from '@/components/group/GroupListRecruting'
import Modal from '@/components/group/Modal'
import { useNavigate } from 'react-router-dom'

const ITEMS = [
  { key: 'now', label: '진행 중인 그룹' },
  { key: 'finished', label: '종료된 그룹' },
  { key: 'recruiting', label: '모집 중인 그룹' },
]

const GroupListPage = () => {
  const navigate = useNavigate()
  // 활성화 탭
  const [activeTab, setActiveTab] = useState('now')
  // 모달 관리
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) //모달 총 3단계 (코드 입력, 코드 제대로 입력, 코드 오류)
  const [code, setCode] = useState('')

  const handleButtonClick = () => {
    setIsOpen(true)
    setStep(1)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCode('')
    setStep(1)
  }

  const handleNext = () => {
    // 연동 -> 검증
    if (code === 'aaaa') {
      setStep(2)
    } else {
      setStep(3)
    }
  }

  const handleNavigate = () => {
    setStep(1)
    setIsOpen(false)
    navigate('/')
  }

  const handleMove = () => {
    setStep(1)
  }
  return (
    <>
      <Header title='그룹' />
      <S.Container>
        <S.MiniButtonContainer>
          <GroupMiniButton
            img={pinkSquare}
            label={'그룹 생성'}
            onClick={() => console.log('그룹 생성')}
          />
          <GroupMiniButton img={yellowSqaure} label={'그룹 참가'} onClick={handleButtonClick} />
        </S.MiniButtonContainer>

        {/* Tab 바 */}
        <Tab items={ITEMS} activeTab={activeTab} onChange={setActiveTab} />
        {/* 활성화 된 버튼에 따른 Content    */}
        {activeTab === 'now' && <GroupListNow />}
        {activeTab === 'finished' && <GroupListFinished />}
        {activeTab === 'recruiting' && <GroupListRecruting />}
      </S.Container>
      {/* 모달 창 */}
      {isOpen && step === 1 && (
        <Modal
          isOpen={isOpen}
          title='그룹 찾기'
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

      {isOpen && step === 2 && (
        <Modal
          isOpen={isOpen}
          title='멋쟁이사자처럼투자소모임'
          text={`만든 사람: 멋쟁이사자처럼기디1\n참가비 : 1,000,000\n참가 인원 : 3명 / 4명`}
          leftButtonLabel='닫기'
          rightButtonLabel='참가하기'
          onLeftClick={handleClose}
          onRightClick={handleNavigate}
        />
      )}
      {isOpen && step === 3 && (
        <Modal
          isOpen={isOpen}
          title={'찾으시는 그룹이 없어요.\n입장코드를 확인해주세요.'}
          leftButtonLabel='닫기'
          rightButtonLabel='다시 입력하기'
          onLeftClick={handleClose}
          onRightClick={handleMove}
        />
      )}
    </>
  )
}

export default GroupListPage
