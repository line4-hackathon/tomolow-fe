import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import ImgAd from '@/assets/images/img-ad-list.svg?react'
import RightArrow from '@/assets/icons/icon-right-arrow.svg?react'
import Toast from '../common/Toast'
import Loading from '../common/Loading'

const AdList = () => {
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const handleAdClick = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const res = await axios.post(
        `${apiUrl}/api/mypage/cash/ad`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setToastMsg(`광고 보상이 지급 완료되었어요.`)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <List onClick={handleAdClick}>
        <Left>
          <ImgAd />
          <Column>
            <Title>광고 시청하기</Title>
            <Subtitle>회당 {(500000).toLocaleString()}원</Subtitle>
          </Column>
        </Left>
        <RightArrow />
      </List>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg('')} />}
    </>
  )
}

export default AdList

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Title = styled.p`
  color: var(--Neutral-900, #333);
  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`

const Subtitle = styled.p`
  color: var(--Neutral-900, #333);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
