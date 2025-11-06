import React, { useState } from 'react'
import * as S from './MyPage.styled'
import Header from '@/components/common/Header'
import ButtonItem from '@/components/my/ButtonItem'
import savedIcon from '@/assets/icons/icon-saved-chatting.svg'
import moneyIcon from '@/assets/icons/icon-money-recharge.svg'
import editIcon from '@/assets/icons/icon-edit-info.svg'
import qnaIcon from '@/assets/icons/icon-qna.svg'

const MyPage = () => {
  return (
    <>
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
          <ButtonItem icon={savedIcon} label={`저장된 채팅`} />
          <ButtonItem icon={moneyIcon} label={`머니 충전`} />
          <ButtonItem icon={editIcon} label={`정보 수정`} />
          <ButtonItem icon={qnaIcon} label={`문의하기`} />
        </S.ButtonContainer>
        <S.Logout>로그아웃</S.Logout>
      </S.Container>
    </>
  )
}

export default MyPage
