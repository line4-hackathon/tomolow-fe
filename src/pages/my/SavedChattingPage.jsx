import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import SearchBar from '@/components/my/SearchBar'
import IconEmpty from '@/assets/icons/icon-empty-transactions.svg?react'
import MenuBar from '@/components/common/MenuBar'

const SavedChattingPage = () => {
  const [search, setSearch] = useState('')
  const [chatList, setChatList] = useState([])
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    // 채팅 내용 불러오기(연동)
    const loadChatting = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(`${apiUrl}/api/mypage/saved-chat`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.success && Array.isArray(res.data.data)) {
          setChatList(res.data.data)
        } else {
          setChatList([])
        }
      } catch (err) {
        console.error(err)
        console.error('채팅 불러오기 실패')
      }
    }
    loadChatting()
  }, [])

  // 검색 기능
  const searchList = useMemo(() => {
    return chatList.filter(
      (item) =>
        item.question?.toLowerCase().includes(search.toLowerCase()) ||
        item.answer?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, chatList])

  return (
    <>
      <Scrollable>
        <Header title='저장된 채팅' showIcon={true} path='/mypage' />
        <Container>
          <SearchBar
            explain='찾으시는 키워드를 입력하세요'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CardList>
            {searchList.length > 0 ? (
              searchList.map((qa, id) => (
                <Card key={id}>
                  <Question>Q. {qa.question}</Question>
                  <Answer>A. {qa.answer}</Answer>
                </Card>
              ))
            ) : (
              <EmptyContainer>
                <IconEmpty />
                <EmptyText>저장된 채팅이 없습니다.</EmptyText>
              </EmptyContainer>
            )}
          </CardList>
        </Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default SavedChattingPage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100dvh;
  padding: 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
`
const CardList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 26px 0;
  gap: 16px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
`
const Question = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const Answer = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const EmptyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`
const EmptyText = styled.p`
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
