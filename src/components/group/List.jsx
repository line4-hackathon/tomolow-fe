import React from 'react'
import styled from 'styled-components'
import ListItem from './ListItem'
import ListEmpty from './ListEmpty'

function List({ onClick = () => {} }) {
  // 임시 데이터
  const items = [
    { id: 1, title: '멋쟁이 사자처럼 모임', dateTxt: '12일 6시간 남음', statusTxt: '현재 3등' },
    { id: 2, title: 'Tomolow 모임', dateTxt: '100일 6시간 남음', statusTxt: '현재 5등' },
  ]
  return (
    <ListContainer>
      {items.length > 0 ? (
        items.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            dateTxt={item.dateTxt}
            statusTxt={item.statusTxt}
            onClick={() => onClick(item)}
          />
        ))
      ) : (
        <ListEmpty />
      )}
    </ListContainer>
  )
}

export default List

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px;
`
