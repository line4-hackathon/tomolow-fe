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

const ITEMS = [
  { key: 'now', label: '진행 중인 그룹' },
  { key: 'finished', label: '종료된 그룹' },
  { key: 'recruiting', label: '모집 중인 그룹' },
]

const GroupListPage = () => {
  // 활성화 탭
  const [activeTab, setActiveTab] = useState('now')

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
          <GroupMiniButton
            img={yellowSqaure}
            label={'그룹 참가'}
            onClick={() => console.log('그룹 참가')}
          />
        </S.MiniButtonContainer>

        {/* Tab 바 */}
        <Tab items={ITEMS} activeTab={activeTab} onChange={setActiveTab} />
        {/* 활성화 된 버튼에 따른 Content    */}
        {activeTab === 'now' && <GroupListNow />}
        {activeTab === 'finished' && <GroupListFinished />}
        {activeTab === 'recruiting' && <GroupListRecruting />}
      </S.Container>
    </>
  )
}

export default GroupListPage
