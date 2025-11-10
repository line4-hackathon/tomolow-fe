import React, { useState, useEffect, useRef } from 'react'
import * as S from './Chatbot.styled'
import { useNavigate } from 'react-router-dom'

import SendIcon from '@/assets/icons/icon-send.svg'
import BanSendIcon from '@/assets/icons/icon-send-ban.svg'
import StopSendIcon from '@/assets/icons/icon-stop-send.svg'
import InvestIcon from '@/assets/icons/icon-invest.svg'
import BanInvestIcon from '@/assets/icons/icon-invest-not.svg'

// env
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = RAW_BASE_URL

// 디버깅용 로그
console.log('API_BASE_URL >>>', API_BASE_URL)

// (임시) 로그인 없이 테스트할 실제 토큰
const TEMP_FAKE_TOKEN =
   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb295ZW9uIiwianRpIjoic29veWVvbiIsImlhdCI6MTc2Mjc1NTQ0MiwiZXhwIjoxNzYyNzU3MjQyfQ.4XcjHOK4_YPTcCT9F9QV6SNEt3TDhokYfhHT6FVzP5U"
// Authorization 헤더 생성
const getAuthHeader = () => {
    const token = TEMP_FAKE_TOKEN
    return { Authorization: `Bearer ${token}` }
}

const Chatbot = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text:
            "안녕하세요! 저는 ‘닉네임’님이 부자가 될 때까지 함께 학습할 챗봇 투모입니다! " +
            '본격적인 학습에 앞서 주식 하나를 가져와 공부를 시작해 볼까요?',
        },
    ])

    const [input, setInput] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [roomId, setRoomId] = useState(null)
    const [lastAnswerKey, setLastAnswerKey] = useState(null)

    const requestControllerRef = useRef(null)

    const trimmed = input.trim()
    const canSend = !!trimmed && !isThinking
    const hasUserMessage = messages.some(msg => msg.role === 'user')

  // 0) 서버 주소가 없는 경우
    useEffect(() => {
        if (!API_BASE_URL) {
        console.error('VITE_API_BASE_URL 이 설정되어 있지 않습니다.')
        setMessages(prev => [
            ...prev,
            {
            id: Date.now(),
            role: 'bot',
            text:
                '서버 주소가 설정되어 있지 않습니다. .env.local 에 VITE_API_BASE_URL 을 설정해 주세요.',
            },
        ])
        }
    }, [])

    // 1) room 불러오기
    useEffect(() => {
        if (!API_BASE_URL) return

        const fetchRoom = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/chatbot/room`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(),
            },
            })

            // HTTP 상태 코드 먼저 체크
            if (!res.ok) {
            const text = await res.text()
            console.error('room error:', res.status, text)

            let msg = '채팅방 정보를 불러오지 못했습니다.'
            if (res.status === 401 || res.status === 403) {
                msg =
                '챗봇 서버에 접근할 권한이 없어요. 로그인/토큰 설정을 백엔드에 확인해 주세요.'
            }

            setMessages(prev => [
                ...prev,
                {
                id: Date.now(),
                role: 'bot',
                text: msg,
                },
            ])
            return
            }

        const json = await res.json()
        console.log('room response:', json)

        if (!json.success) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              role: 'bot',
              text: json.message || '채팅방 정보를 불러오지 못했습니다.',
            },
          ])
          return
        }

        const data = json.data
        if (data?.roomId) setRoomId(data.roomId)

        // data 가 [{ key, question, answer }, ...] 형식일 때
        if (Array.isArray(data)) {
          const history = data.flatMap((item, i) => {
            const baseId = Date.now() + i * 2
            return [
              { id: baseId, role: 'user', text: item.question ?? '' },
              { id: baseId + 1, role: 'bot', text: item.answer ?? '' },
            ]
          })
          setMessages(prev => [...prev, ...history])
        }
      } catch (err) {
        console.error('room error:', err)
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 2, role: 'bot', text: 'room 요청 중 오류 발생' },
        ])
      }
    }

    fetchRoom()
  }, [])

  // 2) 질문 보내기
  const handleSend = async textFromChip => {
    const content = (textFromChip ?? trimmed).trim()
    if (!content || isThinking) return
    if (!API_BASE_URL) return

    const userMsg = { id: Date.now(), role: 'user', text: content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    const controller = new AbortController()
    requestControllerRef.current = controller

    try {
      const res = await fetch(`${API_BASE_URL}/api/chatbot/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        signal: controller.signal,
        body: JSON.stringify({
          question: content,
          data_selected: false,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('question error:', res.status, text)

        let msg = '요청 처리 중 오류가 발생했습니다.'
        if (res.status === 401 || res.status === 403) {
          msg =
            '챗봇 요청에 대한 권한이 없어요. 로그인/토큰 설정을 백엔드에 확인해 주세요.'
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'bot',
            text: msg,
          },
        ])
        return
      }

      const json = await res.json()
      console.log('question response:', json)

      if (!json.success) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'bot',
            text: json.message || '요청 처리 중 오류가 발생했습니다.',
          },
        ])
        return
      }

      const data = json.data || {}
      const answer = data.answer ?? '답변이 없습니다.'
      setLastAnswerKey(data.key ?? null)

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 3, role: 'bot', text: answer },
      ])
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('question error:', err)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 4,
            role: 'bot',
            text: '서버 통신 중 오류가 발생했습니다.',
          },
        ])
      }
    } finally {
      setIsThinking(false)
      requestControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (requestControllerRef.current) requestControllerRef.current.abort()
    setIsThinking(false)
  }

  const handleSendButtonClick = () => {
    if (isThinking) handleStop()
    else if (canSend) handleSend()
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && canSend) handleSend()
  }

  // 왼쪽 아이콘은 일단 안내 문구만 (나중에 holding 페이지 이동으로 바꿀 수 있음)
  const handleInvestClick = () => {
  if (isThinking) return
  navigate('/learning/holding')  // 🔥 보유 주식 페이지로 이동
}

  const sendIconSrc = isThinking
    ? StopSendIcon
    : canSend
    ? SendIcon
    : BanSendIcon
  const investIconSrc = isThinking ? BanInvestIcon : InvestIcon

  return (
    <S.ChatbotWrapper>
      <S.Content>
        <S.Messages>
          {messages.map(msg =>
            msg.role === 'bot' ? (
              <S.BotBubble key={msg.id}>{msg.text}</S.BotBubble>
            ) : (
              <S.UserBubble key={msg.id}>{msg.text}</S.UserBubble>
            ),
          )}
        </S.Messages>

        {/* 유저가 대화 시작 안했을때만 추천 질문 노출 */}
        {!hasUserMessage && (
          <S.SuggestionsSection>
            <S.SuggestionsTitle>이런 질문은 어때요?</S.SuggestionsTitle>
            <S.ChipsColumn>
              <S.Chip onClick={() => handleSend('이더리움의 주가 등락 요인')}>
                이더리움의 주가 등락 요인
              </S.Chip>
              <S.Chip onClick={() => handleSend('가상화폐와 주식의 차이가 뭐야')}>
                가상화폐와 주식의 차이가 뭐야
              </S.Chip>
            </S.ChipsColumn>
          </S.SuggestionsSection>
        )}
      </S.Content>

      <S.InputArea>
        <S.IconCircleButton
          type="button"
          disabled={isThinking}
          onClick={handleInvestClick}
        >
          <S.IconImg src={investIconSrc} alt="invest" />
        </S.IconCircleButton>

        <S.TextInput
          placeholder="무엇이 궁금하세요?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <S.IconCircleButton
          type="button"
          disabled={!canSend && !isThinking}
          onClick={handleSendButtonClick}
        >
          <S.IconImg src={sendIconSrc} alt={isThinking ? 'stop' : 'send'} />
        </S.IconCircleButton>
      </S.InputArea>
    </S.ChatbotWrapper>
  )
}

export default Chatbot