import React, { useState } from 'react'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import SearchBar from '@/components/my/SearchBar'

// 채팅 더미데이터
const qnaList = [
  {
    question:
      '삼성 전자의 2025년 1월 1일부터 2025년 1월 6일까지 주가를 분석하고 변동 원인을 설명해줘',
    answer:
      '2021년 1월부터 2월까지 삼성전자의 주가는 반도체 업황 회복 기대 속에 강한 상승세를 보였습니다. 2020년 말부터 이어진 글로벌 유동성 확대와 경기 부양책으로 투자심리가 개선되었으며, IT·서버용 메모리 수요 증가로 D램과 낸드플래시 가격이 반등 조짐을 보였습니다.이에 따라 삼성전자의 실적 개선 전망이 확산되며 주가는 9만 원대를 돌파했습니다.',
  },
  {
    question: '주식이 뭐야',
    answer: '주식은 주식회사의 자본을 구성하는 단위이자 회사의 일부 소유권을 나타내는 증권입니다. ',
  },
]
const SavedChattingPage = () => {
  const [search, setSearch] = useState('')

  const searchList = qnaList.filter(
    (qna) => qna.question.includes(search) || qna.answer.includes(search),
  )
  return (
    <>
      <Header title='저장된 채팅' showIcon={true} path='/mypage' />
      <Container>
        <SearchBar
          explain='찾으시는 키워드를 입력하세요'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CardList>
          {searchList.map((qa, id) => (
            <Card key={id}>
              <Question>Q. {qa.question}</Question>
              <Answer>A. {qa.answer}</Answer>
            </Card>
          ))}{' '}
        </CardList>
      </Container>
    </>
  )
}

export default SavedChattingPage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
`
const CardList = styled.div`
  display: flex;
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
