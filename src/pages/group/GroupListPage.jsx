import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import * as S from '@/pages/group/GroupListPage.styled'
import Header from '@/components/common/Header'
import GroupMiniButton from '@/components/group/GroupMiniButton'
import pinkSquare from '@/assets/images/img-pink-square.svg'
import yellowSquare from '@/assets/images/img-yellow-square.svg'
import Tab from '@/components/group/Tab'
import GroupListNow from '@/components/group/GroupListNow'
import GroupListFinished from '@/components/group/GroupListFinished'
import GroupListRecruting from '@/components/group/GroupListRecruting'
import Modal from '@/components/group/Modal'
import MenuBar from '@/components/common/MenuBar'

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
  const modal = useModal()

  const handleButtonClick = () => {
    modal.open()
  }

  const handleClose = () => {
    modal.close()
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
  }

  const handleRetry = () => {
    modal.retry()
  }
  return (
    <>
      <Scrollable>
        <Header title='그룹' />
        <S.Container>
          <S.MiniButtonContainer>
            <GroupMiniButton
              img={pinkSquare}
              label={'그룹 생성'}
              onClick={() => navigate('/group/create')}
            />
            <GroupMiniButton img={yellowSquare} label={'그룹 참가'} onClick={handleButtonClick} />
          </S.MiniButtonContainer>

          {/* Tab 바 */}
          <Tab items={ITEMS} activeTab={activeTab} onChange={setActiveTab} />
          {/* 활성화 된 버튼에 따른 Content    */}
          {activeTab === 'now' && <GroupListNow />}
          {activeTab === 'finished' && <GroupListFinished />}
          {activeTab === 'recruiting' && <GroupListRecruting />}
        </S.Container>
        {/* 모달 창 */}
        {modal.isOpen && modal.step === 1 && (
          <Modal
            isOpen={modal.isOpen}
            title='그룹 찾기'
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
            title='멋쟁이사자처럼투자소모임'
            text={`만든 사람: 멋쟁이사자처럼기디1\n참가비 : 1,000,000\n참가 인원 : 3명 / 4명`}
            leftButtonLabel='닫기'
            rightButtonLabel='참가하기'
            onLeftClick={handleClose}
            onRightClick={handleNavigate}
          />
        )}
        {modal.isOpen && modal.step === 3 && (
          <Modal
            isOpen={modal.isOpen}
            title={'찾으시는 그룹이 없어요.\n입장코드를 확인해주세요.'}
            leftButtonLabel='닫기'
            rightButtonLabel='다시 입력하기'
            onLeftClick={handleClose}
            onRightClick={handleRetry}
          />
        )}
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupListPage
