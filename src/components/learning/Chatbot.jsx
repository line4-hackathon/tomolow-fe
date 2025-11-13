// src/pages/learning/Chatbot.jsx (또는 해당 경로)

import React, { useState, useEffect, useRef } from 'react'
import * as S from './Chatbot.styled'
import { useNavigate, useLocation } from 'react-router-dom'

import SendIcon from '@/assets/icons/icon-send.svg'
import BanSendIcon from '@/assets/icons/icon-send-ban.svg'
import StopSendIcon from '@/assets/icons/icon-stop-send.svg'
import InvestIcon from '@/assets/icons/icon-invest.svg'
import BanInvestIcon from '@/assets/icons/icon-invest-not.svg'

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = RAW_BASE_URL

console.log('API_BASE_URL >>>', API_BASE_URL)

// accessToken 가져오기
const getAccessToken = () => localStorage.getItem('accessToken')

// JWT payload 파싱 (sub, nickname 등 꺼내기)
const parseJwt = token => {
  try {
    const base64Payload = token.split('.')[1]
    const jsonPayload = atob(base64Payload)
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// Authorization 헤더
const getAuthHeader = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const Chatbot = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // SelectDatePage에서 넘어온 자동 질문 + 안내 문구
  const autoQuestion = location.state?.autoQuestion
  const autoMetaText = location.state?.autoMetaText

  const token = getAccessToken()
  const payload = token ? parseJwt(token) : null
  const nickname = payload?.nickname || payload?.sub || '투모루우'

  // 메시지 id를 위한 카운터 (항상 유니크)
  const msgIdRef = useRef(1)
  const nextId = () => {
    msgIdRef.current += 1
    return msgIdRef.current
  }

  // autoQuestion 한 번만 보내기 위한 플래그 (StrictMode 대비)
  const autoQuestionSentRef = useRef(false)

  // 스크롤 맨 아래로 내리기 위한 ref
  const bottomRef = useRef(null)

  const [messages, setMessages] = useState(() => [
    {
      id: msgIdRef.current, // 1
      role: 'bot',
      text:
        `안녕하세요! 저는 ‘${nickname}’님이 부자가 될 때까지 함께 학습할 챗봇 투모입니다! ` +
        '본격적인 학습에 앞서 주식 하나를 가져와 공부를 시작해 볼까요?',
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [roomId, setRoomId] = useState(null)
  const [lastAnswerKey, setLastAnswerKey] = useState(null)
  const [roomLoaded, setRoomLoaded] = useState(false) // room 로딩 완료 여부

  const requestControllerRef = useRef(null)

  const trimmed = input.trim()
  const canSend = !!trimmed && !isThinking
  const hasUserMessage = messages.some(msg => msg.role === 'user')

  // 로그인 안 된 상태면 로그인 페이지로 이동
  useEffect(() => {
    if (!getAccessToken()) {
      navigate('/login')
    }
  }, [navigate])

  // 서버 주소 없으면 에러 메시지
  useEffect(() => {
    if (!API_BASE_URL) {
      console.error('VITE_API_BASE_URL 이 설정되어 있지 않습니다.')
      setMessages(prev => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text:
            '서버 주소가 설정되어 있지 않습니다. .env.local 에 VITE_API_BASE_URL 을 설정해 주세요.',
        },
      ])
    }
  }, [])

  // 새 메시지 생길 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  // 2) 질문 보내기
  // metaTextFromOutside: SelectDatePage에서 온 경우에만 들어오는 안내 문구
  const handleSend = async (textFromChip, metaTextFromOutside) => {
    const content = (textFromChip ?? trimmed).trim()
    if (!content || isThinking) return
    if (!API_BASE_URL) return

    const userMsg = { id: nextId(), role: 'user', text: content }
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

        if (res.status === 401 || res.status === 403) {
          setMessages(prev => [
            ...prev,
            {
              id: nextId(),
              role: 'bot',
              text: '로그인이 만료되었어요. 다시 로그인 후 이용해 주세요.',
            },
          ])
          navigate('/login')
          return
        }

        setMessages(prev => [
          ...prev,
          {
            id: nextId(),
            role: 'bot',
            text: '요청 처리 중 오류가 발생했습니다.',
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
            id: nextId(),
            role: 'bot',
            text: json.message || '요청 처리 중 오류가 발생했습니다.',
          },
        ])
        return
      }

      const data = json.data || {}
      const answer = data.answer ?? '답변이 없습니다.'
      setLastAnswerKey(data.key ?? null)

      // 🔹 metaTextFromOutside 가 있으면, 먼저 안내 문구(meta: true), 그 다음 실제 답변
      setMessages(prev => {
        const arr = [...prev]
        if (metaTextFromOutside && metaTextFromOutside.trim()) {
          arr.push({
            id: nextId(),
            role: 'bot',
            text: metaTextFromOutside.trim(),
            meta: true,
          })
        }
        arr.push({ id: nextId(), role: 'bot', text: answer })
        return arr
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('question error:', err)
        setMessages(prev => [
          ...prev,
          {
            id: nextId(),
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

  const handleInvestClick = () => {
    if (isThinking) return
    navigate('/learning/holding')
  }

  const sendIconSrc = isThinking
    ? StopSendIcon
    : canSend
    ? SendIcon
    : BanSendIcon
  const investIconSrc = isThinking ? BanInvestIcon : InvestIcon

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

        if (!res.ok) {
          const text = await res.text()
          console.error('room error:', res.status, text)
          if (res.status === 401 || res.status === 403) {
            setMessages(prev => [
              ...prev,
              {
                id: nextId(),
                role: 'bot',
                text: '로그인이 만료되었어요. 다시 로그인 후 이용해 주세요.',
              },
            ])
            navigate('/login')
            return
          }

          setMessages(prev => [
            ...prev,
            {
              id: nextId(),
              role: 'bot',
              text: '채팅방 정보를 불러오지 못했습니다.',
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
              id: nextId(),
              role: 'bot',
              text: json.message || '채팅방 정보를 불러오지 못했습니다.',
            },
          ])
          return
        }

        const data = json.data
        if (data?.roomId) setRoomId(data.roomId)

        if (Array.isArray(data)) {
          const history = data.flatMap(item => [
            { id: nextId(), role: 'user', text: item.question ?? '' },
            { id: nextId(), role: 'bot', text: item.answer ?? '' },
          ])
          setMessages(prev => [...prev, ...history])
        }
      } catch (err) {
        console.error('room error:', err)
        setMessages(prev => [
          ...prev,
          { id: nextId(), role: 'bot', text: 'room 요청 중 오류 발생' },
        ])
      } finally {
        setRoomLoaded(true) // room 요청 끝난 시점
      }
    }

    fetchRoom()
  }, [])

  // SelectDatePage에서 넘어온 autoQuestion 자동 전송 (한 번만, room 로딩 이후)
  useEffect(() => {
    if (!autoQuestion) return
    if (!roomLoaded) return
    if (autoQuestionSentRef.current) return

    autoQuestionSentRef.current = true
    // autoMetaText 를 두 번째 인자로 넣어
    handleSend(autoQuestion, autoMetaText)

    // state 비워서 뒤로가기 등에서 재전송 안 되게
    navigate('/learning', { replace: true, state: {} })
  }, [autoQuestion, autoMetaText, roomLoaded, navigate])

  return (
    <S.ChatbotWrapper>
      <S.Content>
        <S.Messages>
          {messages.map(msg =>
            msg.role === 'bot' ? (
              <S.BotBubble
                key={msg.id}
                className={msg.meta ? 'meta' : ''} 
              >
                {msg.text}
              </S.BotBubble>
            ) : (
              <S.UserBubble key={msg.id}>{msg.text}</S.UserBubble>
            ),
          )}
          {/* 항상 맨 아래에 있는 앵커 */}
          <div ref={bottomRef} />
        </S.Messages>

        {!hasUserMessage && (
          <S.SuggestionsSection>
            <S.SuggestionsTitle>이런 질문은 어때요?</S.SuggestionsTitle>
            <S.ChipsColumn>
              <S.Chip onClick={() => handleSend('이더리움의 주가 등락 요인')}>
                이더리움의 주가 등락 요인
              </S.Chip>
              <S.Chip onClick={() => navigate('/learning/holding')}>
                자산 정보 가져와서 분석하기
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