import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/useModal'
import { Scrollable } from '@/styles/Scrollable.styled'
import * as S from './MyPage.styled'
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
  return (
    <>
      <Scrollable>
        <Header title='MY' />
        <S.Container>
          <S.NameContainer>
            <S.Name>{`멋쟁이사자`} </S.Name>
            <S.Span> 님</S.Span>
          </S.NameContainer>
          <S.MoneyContainer>
            <S.Label>보유 중인 머니</S.Label>
            <S.Money>{(160434464).toLocaleString()}원</S.Money>
          </S.MoneyContainer>
          <S.ButtonContainer>
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
          </S.ButtonContainer>
          <S.Logout>로그아웃</S.Logout>
          {isOpen && <ContactModal onClick={close} />}
        </S.Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default MyPage
