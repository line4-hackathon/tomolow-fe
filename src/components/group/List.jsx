import React from 'react'
import styled from 'styled-components'
import ListItem from './ListItem'
import ListEmpty from './ListEmpty'

function List({ items = [], onClick = () => {} }) {
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
