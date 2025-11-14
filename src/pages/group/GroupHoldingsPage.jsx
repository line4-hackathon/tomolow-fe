import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStockStore from '@/stores/stockStores'
import axios from 'axios'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import Loading from '@/components/common/Loading'
import ListEmpty from '@/components/group/ListEmpty'

const GroupHoldingsPage = () => {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [loading, setLoading] = useState(false)
  const [holdingList, setHoldingList] = useState([])
  const { setStockData, resetForm } = useStockStore()
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  const getTextColor = (pnL) => {
    if (pnL > 0) return '#FF2E4E'
    if (pnL < 0) return '#0084FE'
    return '#333'
  }

  useEffect(() => {
    const getHoldingLists = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${apiUrl}/api/group/${groupId}/holding`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          setHoldingList(res.data.data.pnLDtos)
        } else {
          console.log(res.data.message)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getHoldingLists()
  }, [groupId])

  if (loading) return <Loading />
  return (
    <>
      <Scrollable>
        <Header title='보유종목' showIcon={true} path={`/group/home/${groupId}`} />
        <Container>
          {holdingList.length > 0 ? (
            <List>
              {holdingList.map((item) => (
                <Item
                  key={item.marketId}
                  onClick={() => {
                    console.log('클릭한 종목:', item)

                    resetForm()
                    setStockData({
                      marketId: item.marketId,
                      name: item.marketName,
                      marketName: item.marketName,
                      symbol: item.marketSymbol,
                      imageUrl: item.marketImgUrl,
                    })
                    navigate('/group/invest/trading')
                  }}
                >
                  <Left>
                    {item.marketImgUrl ? <Img src={item.marketImgUrl} /> : <TempImg />}{' '}
                    <LeftText>
                      <Name>{item.marketName}</Name>
                      <Quantity>{`${item.quantity.toLocaleString()}주`}</Quantity>
                    </LeftText>
                  </Left>
                  <Right>
                    <Price>{`${item.totalPrice.toLocaleString()}원`}</Price>
                    <ColoredText color={getTextColor(item.pnL)}>
                      {`${item.pnL.toLocaleString()}원`}
                      {`(${item.pnLRate}%)`}
                    </ColoredText>
                  </Right>
                </Item>
              ))}
            </List>
          ) : (
            <ListEmpty emptyMessage={'보유한 자산이 없어요.'} />
          )}
        </Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupHoldingsPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
`
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
`

const TempImg = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: #263c54;
`
const Img = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 33px;
  border: none;
`
const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Name = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Quantity = styled.p`
  color: var(--Neutral-500, #6d6d6d);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Price = styled.p`
  color: var(--Neutral-900, #333);
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
`

const ColoredText = styled.p`
  color: ${({ color }) => color};
  text-align: right;
  font-size: 12px;
  font-weight: 400;
`
