import React, { useState, useEffect } from 'react'
import axios from 'axios'
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

const GroupListPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('now')
  const [groupInfo, setGroupInfo] = useState(null) // 참여하기 누르면 반환받을 그룹 정보 (그룹 아이디, 그룹명, ..)
  const [activeList, setActiveList] = useState([]) // 진행중 그룹
  const [expiredList, setExpiredList] = useState([]) // 종료된 그룹
  const [joinedRecruitList, setJoinedRecruitList] = useState([]) // 내가 참여한 모집중 그룹
  const [notJoinedRecruitList, setNotJoinedRecruitList] = useState([]) // 내가 참여하지 않은 모집중 그룹
  const modal = useModal()
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  // 특정 탭 클릭시
  const handleItemClick = (item) => {
    // 모집 중 탭일 때인 경우 홈 이동 or 모달 열기
    if (activeTab === 'recruiting') {
      const isJoined = joinedRecruitList.some((joined) => joined.id === item.id)
      if (isJoined) {
        navigate(`/group/home/${item.id}`)
      } else {
        modal.open()
      }
    } else if (activeTab === 'now') {
      // 해당 그룹 홈으로 이동
      navigate(`/group/home/${item.id}`)
    } else {
      return
    }
  }

  // activeTab에 따라 리스트 띄우기
  useEffect(() => {
    const getGroups = async () => {
      try {
        if (activeTab === 'now' || activeTab === 'finished') {
          const res = await axios.get(`${apiUrl}/api/group`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (res.data.success) {
            const { activeList, expiredList } = res.data.data

            const formattedActive = activeList.map((item) => ({
              id: item.groupId,
              title: item.groupName,
              dateTxt: `${item.dayUntilEnd ?? 0}일 ${item.hourUntilEnd}시간 남음`,
              statusTxt: `현재 ${item.ranking}등`,
            }))

            const formattedExpired = expiredList.map((item) => ({
              id: item.groupId,
              title: item.groupName,
              dateTxt: '투자 종료',
              statusTxt: `최종 ${item.ranking}등`,
            }))

            setActiveList(formattedActive)
            setExpiredList(formattedExpired)
          }
        } else if (activeTab === 'recruiting') {
          const res = await axios.get(`${apiUrl}/api/group/joinable`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (res.data.success) {
            const { joinedGroupList, notJoinedGroupList } = res.data.data

            const formattedJoined = joinedGroupList.map((item) => ({
              id: item.groupId,
              title: item.groupName,
              dateTxt: '모집중',
              statusTxt: `${item.currentMemberCount}명/${item.memberCount}명 `,
            }))
            const formattedNotJoined = notJoinedGroupList.map((item) => ({
              id: item.groupId,
              title: item.groupName,
              dateTxt: '모집중',
              statusTxt: `${item.currentMemberCount}명/${item.memberCount}명 `,
            }))

            setJoinedRecruitList(formattedJoined)
            setNotJoinedRecruitList(formattedNotJoined)
          }
        }
      } catch (err) {
        console.error('그룹 리스트 불러오기 실패')
        console.error(err)
      }
    }
    getGroups()
  }, [activeTab])

  // 그룹 찾기 연동 (인증 코드 확인)
  const handleCheckCode = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/group/join?code=${modal.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success) {
        setGroupInfo(res.data.data)
        modal.goSuccess()
      } else {
        modal.goFail()
      }
    } catch (err) {
      modal.goFail()
    }
  }

  // 그룹 참가 연동(인증 코드 성공 시)
  const handleJoinGroup = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/group/join/${groupInfo.groupId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success) {
        navigate('/group') // 특정 그룹 아이디 홈으로 이동 (수정 필요)
        modal.close()
      } else {
        console.log(res.data.message)
        modal.close()
      }
    } catch (err) {
      console.log(err)
    }
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
          {/* 탭별 리스트 */}
          {activeTab === 'now' && (
            <List
              items={activeList}
              onClick={handleItemClick}
              emptyMessage='아직 그룹에 참여하지 않았어요.'
            />
          )}
          {activeTab === 'finished' && (
            <List items={expiredList} emptyMessage='종료된 그룹이 없어요.' />
          )}
          {activeTab === 'recruiting' && (
            <>
              <SectionTitle>내가 참여한 그룹</SectionTitle>
              <List
                items={joinedRecruitList}
                onClick={handleItemClick}
                emptyMessage='참여 중인 그룹이 없어요.'
              />
              <SectionTitle>다른 그룹 찾기</SectionTitle>
              <List
                items={notJoinedRecruitList}
                onClick={handleItemClick}
                emptyMessage='현재 모집 중인 그룹이 없어요.'
              />
            </>
          )}
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

        {modal.isOpen && modal.step === 2 && groupInfo && (
          // 연동 후 실제 데이터로 채워넣기
          <Modal
            isOpen={modal.isOpen}
            title={groupInfo.groupName}
            text={`만든 사람: ${groupInfo.creatorNickname}\n참가비 : ${groupInfo.seedMoney.toLocaleString()}원\n참가 인원 : ${groupInfo.currentMemberCount}명 / ${groupInfo.memberCount}명`}
            leftButtonLabel='닫기'
            rightButtonLabel='참가하기'
            onLeftClick={() => modal.close()}
            onRightClick={handleJoinGroup}
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

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
`

const MiniButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`
const SectionTitle = styled.p`
  color: var(--Clicked-P_600, #2b5276);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding-top: 24px;
`
