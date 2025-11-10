// src/components/common/Header.jsx
import React from 'react'
import styled from 'styled-components'
import backIcon from '@/assets/icons/icon-back.svg'
import SaveIcon from '@/assets/icons/icon-save.svg?react'
import { useNavigate } from 'react-router-dom'

function Header({
    title, icon = backIcon, showIcon = false,
    path = '/',          
    showSave = false,  savePath = '/learning/save',   
    }) {
    const navigate = useNavigate()

    const handleBackClick = () => {
        if (!path) return
        navigate(path)
    }

    const handleSaveClick = () => {
        if (!savePath) return
        navigate(savePath)
    }

    return (
        <HeaderBar>
        {showIcon ? (
            <Icon src={icon} alt="뒤로가기" onClick={handleBackClick} />
        ) : (
            <Spacer />
        )}
        <Title>{title}</Title>
        {showSave ? (
            <SaveButton type="button" onClick={handleSaveClick}>
            <SaveIcon />
            </SaveButton>
        ) : (
            <Spacer />
        )}
        </HeaderBar>
    )
    }

export default Header


const HeaderBar = styled.header`
    display: grid;
    grid-template-columns: 24px 1fr 24px;
    align-items: center;
    padding: 18px 16px;
    background: var(--Neutral-0, #fff);
    border-bottom: 0.5px solid var(--Neutral-100, #e7e7e7);
`

const Icon = styled.img`
    cursor: pointer;
`

const Title = styled.p`
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    color: #333333;
`

const Spacer = styled.div`
    width: 24px;
    height: 24px;
`

const SaveButton = styled.button`
    all: unset;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
            width: 100%;
            height: 100%;
    }

    &:hover {
        opacity: 0.8;
    }
`