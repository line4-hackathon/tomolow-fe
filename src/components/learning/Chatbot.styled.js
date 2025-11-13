// src/pages/learning/Chatbot.styled.js
import styled from 'styled-components'

export const ChatbotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  background-color: #f5f6f9;
  padding-top: 16px;
  margin-bottom: 60px;
`

export const Content = styled.div`
  flex: 1;
  padding: 16px 20px 0;
  overflow-y: auto;
  padding-bottom: 60px;
`

export const Messages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`

export const BotBubble = styled.div`
  align-self: flex-start;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.6;
  color: #111827;

  /* 불러오기 안내문 같은 meta 텍스트는 파란색 */
  &.meta {
    color: #1570ef;
    white-space: pre-line;
  }
`

export const UserBubble = styled.div`
  align-self: flex-end;
  max-width: 80%;
  padding: 10px 14px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
`

export const SuggestionsSection = styled.section`
  margin-bottom: 24px;
`

export const SuggestionsTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`

export const ChipsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Chip = styled.button`
  border: none;
  outline: none;
  text-align: left;
  width: fit-content;
  padding: 10px 16px;
  border-radius: 16px;
  background-color: #eef4ff;
  color: #1f2933;
  font-size: 14px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`

/* ▼ 입력 바 영역: 항상 화면 맨 아래에 붙도록 fixed */
export const InputArea = styled.div`
  position: fixed;
  z-index: 10;
  background-color: #f5f6f9;
  width: 100%;
  max-width: 342px;
  bottom: 61px;
  padding: 12px 16px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }
`

export const IconCircleButton = styled.button`
  border-radius: 999px;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

export const IconImg = styled.img`
  width: 32px;
  height: 32px;
`

export const SourceList = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  justify-content: center;
`

export const SourceCard = styled.div`
  min-width: 104px;
  max-width: 145px;
  height: 120px;
  border-radius: 16px;
  background: #263C54;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  align-items: center;
`

export const SourceThumb = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
`

export const SourceFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  padding-bottom: 14px;
`


export const SourceDomain = styled.span`
  font-size: 11px;
  color: #e5e7eb;
  margin-top: 2px;  
`