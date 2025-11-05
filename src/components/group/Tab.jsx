import React from 'react'
import styled from 'styled-components'
import TabButton from './TabButton'

function Tab({ items, activeTab, onChange }) {
  return (
    <TabContainer>
      {items.map((item) => (
        <TabButton
          key={item.key}
          label={item.label}
          active={activeTab === item.key}
          onClick={() => onChange(item.key)}
        />
      ))}
    </TabContainer>
  )
}

export default Tab

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 24px;
  gap: 24px;
`
