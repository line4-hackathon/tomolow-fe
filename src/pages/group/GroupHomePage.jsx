import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Scrollable } from '@/styles/Scrollable.styled'
import { useParams } from 'react-router-dom'
import useGroupStore from '@/stores/groupStores'
import Header from '@/components/common/Header'
import MyAssets from '@/components/home/MyAssets'
import GroupInfoCard from '@/components/group/GroupInfoCard'
import GroupMenu from '@/components/group/GroupMenu'
import GroupRankList from '@/components/group/GroupRankList'
import MenuBar from '@/components/common/MenuBar'

const GroupHomePage = () => {
  const { groupId } = useParams()
  const { groupData, setGroupData } = useGroupStore()

  useEffect(() => {
    if (groupId && groupId !== groupData.groupId) {
      setGroupData({ groupId })
    }
  }, [groupId, groupData.groupId, setGroupData])
  return (
    <>
      <Scrollable>
        <Header title='멋쟁이사자처럼 투자 소모임' showIcon={true} path='/group' />
        {/* 그룹 정보 */}
        <Container>
          <GroupInfoCard />
          <Space></Space>
          {/* 그룹 내 자산 현황 */}
          <MyAssets mode='group' title='그룹의 내 자산 현황' />
          {/* 메뉴 버튼 */}
          <GroupMenu />
          {/* 랭킹 확인 */}
          <GroupRankList />
        </Container>
        <Space></Space>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupHomePage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--Neutral-50, #f6f6f6);
`
const Space = styled.div`
  height: 24px;
  background: var(--Neutral-50, #f6f6f6);
`
