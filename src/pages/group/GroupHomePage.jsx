import React from 'react'
import styled from 'styled-components'
import { Scrollable } from '@/styles/Scrollable.styled'
import Header from '@/components/common/Header'
import MyAssets from '@/components/home/MyAssets'
import AssetDonut from '@/components/home/AssetDonut'
import GroupInfoCard from '@/components/group/GroupInfoCard'
import GroupMenu from '@/components/group/GroupMenu'
import GroupRankList from '@/components/group/GroupRankList'
import MenuBar from '@/components/common/MenuBar'

const GroupHomePage = () => {
  return (
    <>
      <Scrollable>
        <Header title='멋쟁이사자처럼 투자 소모임' showIcon={true} path='/group/list' />
        {/* 그룹 정보 */}
        <Container>
          <GroupInfoCard />
          {/* 그룹 내 자산 현황 */}
          {/* 메뉴 버튼 */}
          <GroupMenu />
          {/* 랭킹 확인 */}
          <GroupRankList />
        </Container>
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
  padding-bottom: 32px;
`
