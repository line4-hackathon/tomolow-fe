import React from 'react'
import styled from 'styled-components'

function DateChip({ type, value, options, isOpen, onClick, onSelect }) {
  return (
    <ChipContainer>
      <Chip onClick={onClick}>{value}</Chip>
      {isOpen && (
        <ListContainer>
          <List>
            {options.map((opt) => (
              <Item
                key={`${opt}`}
                onClick={() => {
                  onSelect(opt)
                }}
              >
                {opt}
              </Item>
            ))}
          </List>
        </ListContainer>
      )}
    </ChipContainer>
  )
}

export default DateChip

const ChipContainer = styled.div`
  position: relative;
`
const Chip = styled.button`
  min-width: 64px;
  display: flex;
  padding: 8px 0;
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  border: none;
  cursor: pointer;

  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
const ListContainer = styled.div`
  position: absolute;
  top: calc(100% - 2px);
  left: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-width: 64px;
  max-height: 150px;
  overflow: auto;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  &::-webkit-scrollbar {
    display: none;
  }
`
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px;
`

const Item = styled.li`
  text-align: center;
  padding: 8px 5px;
  cursor: pointer;
`
