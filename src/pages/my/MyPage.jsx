import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import ButtonItem from '@/components/my/ButtonItem'
import savedIcon from '@/assets/icons/icon-saved-chatting.svg'
import moneyIcon from '@/assets/icons/icon-money-recharge.svg'
import editIcon from '@/assets/icons/icon-edit-info.svg'
import qnaIcon from '@/assets/icons/icon-qna.svg'
import ContactModal from '@/components/my/ContactModal'
import MenuBar from '@/components/common/MenuBar'

const MyPage = () => {
  const navigate = useNavigate()
  const { isOpen, open, close } = useModal()
  const [nickName, setNickName] = useState('')
  const [cash, setCash] = useState('')
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const loadMyPage = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(`${apiUrl}/api/mypage`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.success) {
          setNickName(res.data.data.nickname)
          setCash(res.data.data.cashBalance)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadMyPage()
  }, [])

  return (
    <>
      <Scrollable>
        <Header title='MY' />
        <Container>
          <NameContainer>
            <Name>{nickName} </Name>
            <Span> 님</Span>
          </NameContainer>
          <MoneyContainer>
            <Label>보유 중인 머니</Label>
            <Money>{cash.toLocaleString()}원</Money>
          </MoneyContainer>
          <ButtonContainer>
            <ButtonItem
              icon={savedIcon}
              label={`저장된 채팅`}
              onClick={() => navigate('/mypage/chats')}
            />
            <ButtonItem
              icon={moneyIcon}
              label={`머니충전`}
              onClick={() => navigate('/mypage/charge')}
            />
            <ButtonItem
              icon={editIcon}
              label={`정보수정`}
              onClick={() => navigate('/mypage/edit')}
            />
            {/* 모달 띄우기 */}
            <ButtonItem icon={qnaIcon} label={`문의하기`} onClick={open} />
          </ButtonContainer>
          <Logout onClick={() => navigate('/login')}>로그아웃</Logout>
          {isOpen && <ContactModal onClick={close} />}
        </Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default MyPage

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
  overflow-y: auto;
`

export const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: end;
  gap: 4px;
  padding-bottom: 32px;
`

export const Name = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

export const Span = styled.span`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
export const MoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Primary-200, #ccdceb);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 16px;
`
export const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

export const Money = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  padding: 24px 16px;
  gap: 32px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
export const Logout = styled.p`
  display: inline-block;
  align-self: flex-start;
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  cursor: pointer;
`
