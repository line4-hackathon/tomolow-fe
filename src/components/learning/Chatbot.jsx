// src/pages/learning/Chatbot.jsx

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

// JWT payload 파싱 (로그인 체크용 정도로만 사용)
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

// url에서 도메인만 뽑는 함수 (뉴스 카드 푸터용)
const getDomain = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'news'
  }
}

const Chatbot = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // (다른 경로에서 쓸 수 있는) 자동 질문
  const autoQuestion = location.state?.autoQuestion
  const autoMetaText = location.state?.autoMetaText // 현재는 사용 안 하지만 남겨둠

  // SelectDatePage 에서 넘어온 데이터 선택 상태
  const dataSelectedFromState = location.state?.data_selected
  const tickersFromState = location.state?.tickers
  const startDateFromState = location.state?.start_date
  const endDateFromState = location.state?.end_date
  const metaTextFromState = location.state?.metaText

  const token = getAccessToken()
  const payload = token ? parseJwt(token) : null

  // 닉네임: 기본값은 JWT / 없으면 '투모루우'
  const [nickname, setNickname] = useState(
    payload?.nickname || payload?.sub || '투모루우',
  )

  // 메시지 id를 위한 카운터 (항상 유니크)
  const msgIdRef = useRef(1)
  const nextId = () => {
    msgIdRef.current += 1
    return msgIdRef.current
  }

  // autoQuestion 한 번만 보내기 위한 플래그 (StrictMode 대비)
  const autoQuestionSentRef = useRef(false)

  // 데이터 선택 컨텍스트 (주가 기반 답변 여부)
  const [dataContext, setDataContext] = useState(null) // { active, tickers, start_date, end_date }
  const [showFollowup, setShowFollowup] = useState(false)

  // SelectDatePage에서 온 컨텍스트를 한 번만 초기화하기 위한 ref
  const dataInitRef = useRef(false)

  // 스크롤 맨 아래로 내리기 위한 ref
  const bottomRef = useRef(null)

  // 처음엔 메시지 비워두고, room 응답을 받은 뒤에 인사말 + 히스토리 세팅
  const [messages, setMessages] = useState([])
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
  const handleSend = async textFromChip => {
    const content = (textFromChip ?? trimmed).trim()
    if (!content || isThinking) return
    if (!API_BASE_URL) return

    const userMsg = { id: nextId(), role: 'user', text: content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)
    setShowFollowup(false) // 새 요청 시작 시 followup 버튼 숨김

    const controller = new AbortController()
    requestControllerRef.current = controller

    // 현재 데이터 컨텍스트를 사용할지 여부
    const useData =
      dataContext &&
      dataContext.active &&
      dataContext.tickers &&
      dataContext.start_date &&
      dataContext.end_date

    const body = useData
      ? {
          question: content,
          data_selected: true,
          tickers: dataContext.tickers,
          start_date: dataContext.start_date,
          end_date: dataContext.end_date,
        }
      : {
          question: content,
          data_selected: false,
        }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chatbot/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        signal: controller.signal,
        body: JSON.stringify(body),
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
      const sources = Array.isArray(data.sources) ? data.sources : []
      setLastAnswerKey(data.key ?? null)

      // 실제 답변 + 뉴스 카드
      setMessages(prev => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text: answer,
          sources, // 뉴스 카드 정보
        },
      ])

      // 데이터 기반 답변이면 follow-up 버튼 표시
      if (useData) {
        setShowFollowup(true)
      } else {
        setShowFollowup(false)
      }
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

        const data = json.data || {}

        if (data.roomId) setRoomId(data.roomId)

        // 서버에서 내려준 닉네임이 있으면 이걸 우선 사용
        const nicknameFromServer = data.nickname || nickname
        setNickname(nicknameFromServer)

        const messagesFromServer = Array.isArray(data.messages)
          ? data.messages
          : []

        // 인사말 + 히스토리 한 번에 세팅
        setMessages(prev => {
          // StrictMode에서 effect가 두 번 호출되는 것 방지
          if (prev.length > 0) return prev

          const history = messagesFromServer.flatMap(item => [
            {
              id: nextId(),
              role: 'user',
              text: item.question ?? '',
            },
            {
              id: nextId(),
              role: 'bot',
              text: item.answer ?? '',
            },
          ])

          return [
            {
              id: nextId(),
              role: 'bot',
              text:
                `안녕하세요! 저는 ‘${nicknameFromServer}’님이 부자가 될 때까지 함께 학습할 챗봇 투모입니다! ` +
                '본격적인 학습에 앞서 주식 하나를 가져와 공부를 시작해 볼까요?',
            },
            ...history,
          ]
        })
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
  }, [nickname, navigate])

  // SelectDatePage에서 온 경우: 데이터 컨텍스트 + 안내 문구 세팅
  useEffect(() => {
    if (dataInitRef.current) return
    if (!roomLoaded) return
    if (!dataSelectedFromState) return

    // 데이터 컨텍스트 활성화
    setDataContext({
      active: true,
      tickers: tickersFromState,
      start_date: startDateFromState,
      end_date: endDateFromState,
    })

    // 안내 문구 (파란 글씨)
    if (metaTextFromState) {
      setMessages(prev => [
        ...prev,
        {
          id: nextId(),
          role: 'bot',
          text: metaTextFromState,
          meta: true,
        },
      ])
    }

    dataInitRef.current = true

    // state 비워서 뒤로가기 등에서 재전송 안 되게
    navigate('/learning', { replace: true, state: {} })
  }, [
    roomLoaded,
    dataSelectedFromState,
    tickersFromState,
    startDateFromState,
    endDateFromState,
    metaTextFromState,
    navigate,
  ])

  // (기존) autoQuestion 자동 전송 로직 - 다른 플로우에서 사용할 수 있게 남겨둠
  useEffect(() => {
    if (!autoQuestion) return
    if (!roomLoaded) return
    if (autoQuestionSentRef.current) return

    autoQuestionSentRef.current = true
    handleSend(autoQuestion)

    navigate('/learning', { replace: true, state: {} })
  }, [autoQuestion, roomLoaded, navigate])

  // follow-up: "더 물어볼게요" / "이제 다른 질문할게요"
  const handleMoreAsk = () => {
    // 컨텍스트 유지, 버튼만 숨김
    setShowFollowup(false)
    setMessages(prev => [
    ...prev,
    {
      id: nextId(),
      role: 'bot',
      text: '네 계속해서 관련 데이터에 관한 질문을 해주세요.',
    },
  ])
    
  }

  const handleAnotherQuestion = () => {
    setShowFollowup(false)
    setDataContext(null)
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        role: 'bot',
        text:
          '네 그러면 해당 자산 관련 학습은 마칠게요. 궁금한 게 있으시면 물어봐주세요.',
      },
    ])
  }

  return (
    <S.ChatbotWrapper>
      <S.Content>
        <S.Messages>
          {messages.map(msg =>
            msg.role === 'bot' ? (
              <div key={msg.id}>
                {/* 기본 답변 말풍선 */}
                <S.BotBubble className={msg.meta ? 'meta' : ''}>
                  {msg.text}
                </S.BotBubble>

                {/* 뉴스 카드: 최대 2개까지만 */}
                {msg.sources && msg.sources.length > 0 && (
                  <S.SourceList>
                    {msg.sources.slice(0, 2).map((src, idx) => (
                      <S.SourceCard
                        key={src.url ?? idx}
                        onClick={() =>
                          src.url &&
                          window.open(src.url, '_blank', 'noopener,noreferrer')
                        }
                      >
                        {src.image_url && (
                          <S.SourceThumb
                            src={src.image_url}
                            alt={`뉴스 ${idx + 1}`}
                          />
                        )}
                        <S.SourceFooter>
                          <S.SourceDomain>{getDomain(src.url)}</S.SourceDomain>
                        </S.SourceFooter>
                      </S.SourceCard>
                    ))}
                  </S.SourceList>
                )}
              </div>
            ) : (
              <S.UserBubble key={msg.id}>{msg.text}</S.UserBubble>
            ),
          )}
          {/* 항상 맨 아래에 있는 앵커 */}
          <div ref={bottomRef} />
        </S.Messages>

        {/* 데이터 기반 답변 뒤 follow-up 영역 */}
        {showFollowup && (
          <S.SuggestionsSection>
            <S.SuggestionsTitle>관련 내용을 더 학습할까요?</S.SuggestionsTitle>
            <S.ChipsColumn>
              <S.Chip onClick={handleMoreAsk}>더 물어볼게요</S.Chip>
              <S.Chip onClick={handleAnotherQuestion}>
                이제 다른 질문할게요
              </S.Chip>
            </S.ChipsColumn>
          </S.SuggestionsSection>
        )}

        {/* 첫 사용자 메시지 전 + 데이터 컨텍스트 없을 때만 추천 질문 보여주기 */}
        {!hasUserMessage && !dataContext?.active && (
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