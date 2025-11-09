import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import GroupMiniButton from '@/components/group/GroupMiniButton'
import pinkSquare from '@/assets/images/img-pink-square.svg'
import yellowSquare from '@/assets/images/img-yellow-square.svg'
import Tab from '@/components/group/Tab'
import List from '@/components/group/List'
import Modal from '@/components/common/Modal'
import MenuBar from '@/components/common/MenuBar'

const ITEMS = [
  { key: 'now', label: '진행 중인 그룹' },
  { key: 'finished', label: '종료된 그룹' },
  { key: 'recruiting', label: '모집 중인 그룹' },
]

// 탭별 임시 데이터
const dummyData = {
  now: [
    {
      id: 1,
      title: '멋쟁이사자처럼 투자 소모임',
      dateTxt: '12일 6시간 남음',
      statusTxt: '현재 3등',
    },
    { id: 2, title: '투모로우 소모임', dateTxt: '56분 남음', statusTxt: '현재 1등' },
  ],
  finished: [
    { id: 1, title: '종료 그룹 1', dateTxt: '투자 종료', statusTxt: '최종 3등' },
    { id: 2, title: '종료 그룹 2', dateTxt: '투자 종료', statusTxt: '최종 3등' },
  ],
  recruiting: [
    { id: 1, title: '모집중 그룹 1', dateTxt: '모집 중', statusTxt: '3명 / 4명' },
    { id: 2, title: '모집중 그룹 2', dateTxt: '모집 중', statusTxt: '2명 / 3명' },
  ],
}

const GroupListPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('now')
  const modal = useModal()

  // 특정 탭 클릭시
  const handleItemClick = (item) => {
    // 모집 중 탭일 때만 모달 열기
    if (activeTab === 'recruiting') {
      modal.open()
    } else if (activeTab === 'now') {
      // 해당 그룹 홈으로 이동
      navigate('/group/home')
    } else {
      return
    }
  }

  // 인증 코드 연동 필요
  const handleCheckCode = () => {
    if (modal.code === 'aaaa') {
      modal.goSuccess()
    } else {
      modal.goFail()
    }
  }

  // 인증 코드 성공 시
  const handleNavigate = () => {
    navigate('/group')
    modal.close()
  }

  return (
    <>
      <Scrollable>
        <Header title='그룹' />
        <Container>
          <MiniButtonContainer>
            <GroupMiniButton
              img={pinkSquare}
              label={'그룹 생성'}
              onClick={() => navigate('/group/create')}
            />
            <GroupMiniButton img={yellowSquare} label={'그룹 참가'} onClick={() => modal.open()} />
          </MiniButtonContainer>

          {/* Tab 바 */}
          <Tab items={ITEMS} activeTab={activeTab} onChange={setActiveTab} />
          {/* 활성화 된 버튼에 따른 그룹 리스트 띄우기 */}
          <List items={dummyData[activeTab]} onClick={handleItemClick} />
        </Container>
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
            onLeftClick={() => modal.close()}
            onRightClick={handleCheckCode}
          />
        )}

        {modal.isOpen && modal.step === 2 && (
          // 연동 후 실제 데이터로 채워넣기
          <Modal
            isOpen={modal.isOpen}
            title='멋쟁이사자처럼투자소모임'
            text={`만든 사람: 멋쟁이사자처럼기디1\n참가비 : 1,000,000\n참가 인원 : 3명 / 4명`}
            leftButtonLabel='닫기'
            rightButtonLabel='참가하기'
            onLeftClick={() => modal.close()}
            onRightClick={handleNavigate}
          />
        )}
        {modal.isOpen && modal.step === 3 && (
          <Modal
            isOpen={modal.isOpen}
            title={'찾으시는 그룹이 없어요.\n입장코드를 확인해주세요.'}
            leftButtonLabel='닫기'
            rightButtonLabel='다시 입력하기'
            onLeftClick={() => modal.close()}
            onRightClick={() => modal.retry()}
          />
        )}
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupListPage

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
`

export const MiniButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`
