import React from 'react'
import styled from 'styled-components'

import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import SaveChat from '@/components/learning/SaveChat'

function SaveChatPage() {
    return (
        <Page>
            <Header title="학습" showIcon={true} path="/learning" />
            <SaveChat />
            <MenuBar />
        </Page>
    )
}

export default SaveChatPage

const Page = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
`