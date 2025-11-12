import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
import Loading from '@/components/common/Loading'
import ListEmpty from '@/components/group/ListEmpty'

const GroupHomePage = () => {
  const [groupInfo, setGroupInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const { groupId } = useParams()
  const { groupData, setGroupData } = useGroupStore()
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  // groupId 세팅
  useEffect(() => {
    if (groupId && groupId !== groupData.groupId) {
      setGroupData({ groupId })
    }
  }, [groupId])

  // 개별 그룹 정보 불러오기
  useEffect(() => {
    const getGroupInfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${apiUrl}/api/group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          setGroupInfo(res.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (groupId) getGroupInfo()
  }, [groupId])

  // 현재 진행중인 그룹인지 체크
  const checkRunningGroup =
    groupInfo && groupInfo.days !== null && groupInfo.hours !== null && groupInfo.minutes !== null

  if (loading) return <Loading />

  return (
    <>
      <Scrollable>
        {groupInfo && <Header title={groupInfo.groupName} showIcon={true} path='/group' />}
        {/* 그룹 정보 */}
        <Container>
          {groupInfo && (
            <GroupInfoCard
              money={`${groupInfo.seedMoney.toLocaleString()}원`}
              code={groupInfo.code}
              leftDuration={
                checkRunningGroup
                  ? `${groupInfo.days}일 ${groupInfo.hours}시간 ${groupInfo.minutes}분`
                  : '-'
              }
              member={`${groupInfo.currentMemberCount}명 / ${groupInfo.memberCount}명`}
            />
          )}
          {checkRunningGroup ? (
            <>
              <Space></Space>
              {/* 그룹 내 자산 현황 */}
              <MyAssets mode='group' title='그룹의 내 자산 현황' />
              {/* 메뉴 버튼 */}
              <GroupMenu />
              {/* 랭킹 확인 */}
              <GroupRankList rankings={groupInfo.rankings} />
            </>
          ) : (
            <ListEmpty
              emptyMessage={`참가자를 기다리는 중이에요\n인원이 채워지면 자동으로 그룹 내 투자가 시작돼요`}
            />
          )}
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
