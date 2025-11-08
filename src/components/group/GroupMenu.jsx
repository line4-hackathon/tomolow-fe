import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import pinkSquare from '@/assets/images/img-pink-square.svg'
import GroupMiniButton from './GroupMiniButton'

const GroupMenuButtons = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <ButtonContainer>
        <Row>
          <GroupMiniButton
            img={pinkSquare}
            label={'보유 종목'}
            onClick={() => navigate('/group/holdings')}
          />
          <GroupMiniButton img={pinkSquare} label={'투자하기'} onClick={() => navigate('/')} />
        </Row>
        <Row>
          <GroupMiniButton
            img={pinkSquare}
            label={'대기주문'}
            onClick={() => navigate('/group/waiting')}
          />
          <GroupMiniButton
            img={pinkSquare}
            label={'거래내역'}
            onClick={() => navigate('/group/transaction')}
          />
        </Row>
      </ButtonContainer>
      <Label>투자 순위</Label>
    </Container>
  )
}

export default GroupMenuButtons

const Container = styled.div`
  padding: 0 16px 16px 16px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
