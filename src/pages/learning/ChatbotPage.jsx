import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from '@/components/common/Header.jsx'
import MenuBar from '@/components/common/MenuBar.jsx'
import Chatbot from '@/components/learning/Chatbot.jsx'

function ChatbotPage() {
    return (
        <Container className='scrollable'>
            <Header title='학습' />
            <Chatbot />
            <MenuBar /> {/* 하단 탭바 */} 
        </Container>
    )
}

export default ChatbotPage

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: var(--Neutral-0, #fff);
    align-self: stretch;
`