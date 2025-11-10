import React from 'react'
import styled from 'styled-components'
import ListItem from './ListItem'
import ListEmpty from './ListEmpty'

function List({ items = [], onClick = () => {}, emptyMessage = '그룹이 존재하지 않아요.' }) {
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
        <ListEmpty emptyMessage={emptyMessage} />
      )}
    </ListContainer>
  )
}

export default List

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;
  padding-top: 12px;
`
