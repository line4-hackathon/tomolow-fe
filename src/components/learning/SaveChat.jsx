// src/components/learning/SaveChat.jsx (경로는 너 프로젝트에 맞게)

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CheckOnIcon from '@/assets/icons/icon-save-check-blue.svg'
import CheckOffIcon from '@/assets/icons/icon-save-check-gray.svg'
import Toast from '@/components/invest/ToastMessage'
import * as ChatS from '@/components/learning/Chatbot.styled' // 🔥 뉴스카드 스타일 재사용

// 서버 주소
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 로그인 토큰 사용
const getAccessToken = () => localStorage.getItem('accessToken')

const getAuthHeader = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// url에서 도메인만 뽑는 함수 (챗봇이랑 동일)
const getDomain = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'news'
  }
}

export default function SaveChat() {
  const navigate = useNavigate()

  // items: [{ key, question, answer, sources? }]
  const [items, setItems] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const hasSelection = selectedKeys.length > 0

  // 1) 저장 가능한 채팅 목록 가져오기
  useEffect(() => {
    const fetchRoom = async () => {
      if (!API_BASE_URL) {
        setError('서버 주소가 설정되어 있지 않습니다.')
        setLoading(false)
        return
      }

      const token = getAccessToken()
      if (!token) {
        setError('로그인 후 이용 가능한 서비스입니다.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/chatbot/room`, {
          method: 'GET',
          headers: { ...getAuthHeader() },
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('room error:', res.status, text)

          if (res.status === 401 || res.status === 403) {
            setError('로그인이 만료되었어요. 다시 로그인 후 이용해 주세요.')
          } else {
            setError('대화 목록을 불러오지 못했습니다.')
          }
          return
        }

        const json = await res.json()
        console.log('room (save page) response:', json)

        if (!json.success) {
          setError(json.message || '대화 목록을 불러오지 못했습니다.')
          return
        }

        const messages = json.data?.messages

        if (!Array.isArray(messages)) {
          console.warn('messages is not array, fallback to empty []')
          setItems([])
          return
        }

        setItems(messages)
      } catch (err) {
        console.error('room error:', err)
        setError('서버 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [])

  // 2) 체크박스 토글
  const toggleKey = key => {
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    )
  }

  // 3) 토스트 닫기
  const handleCloseToast = () => {
    setToastVisible(false)
  }

  // 4) 선택된 key들 저장 요청
  const handleSave = async () => {
    if (!hasSelection || saving || !API_BASE_URL) return

    const token = getAccessToken()
    if (!token) {
      setError('로그인 후 이용 가능한 서비스입니다.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/chatbot/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        // ★ BE 스펙: keys: [ "CHAT:1:..." , ... ]
        body: JSON.stringify({ keys: selectedKeys }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('save error:', res.status, text)

        if (res.status === 401 || res.status === 403) {
          setError('로그인이 만료되었어요. 다시 로그인 후 이용해 주세요.')
        } else {
          setError('대화 저장에 실패했습니다.')
        }
        return
      }

      const json = await res.json()
      console.log('save response:', json)

      if (!json.success) {
        setError(json.message || '대화 저장에 실패했습니다.')
        return
      }

      // 성공 토스트 메시지 표시
      setToastMessage('선택한 대화가 저장되었어요!')
      setToastVisible(true)

      // 2초 뒤 학습(챗봇) 화면으로 이동
      setTimeout(() => {
        navigate('/learning')
      }, 2000)

      setSelectedKeys([])
    } catch (err) {
      console.error('save error:', err)
      setError('서버 통신 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    console.log('items state updated >>>', items.length, items[0])
  }, [items])

  return (
    <Wrapper>
      <Content>
        {loading && <Message>대화 목록을 불러오는 중이에요...</Message>}
        {!loading && error && <Message>{error}</Message>}
        {!loading && !error && items.length === 0 && (
          <Message>저장할 수 있는 대화가 아직 없어요.</Message>
        )}

        {!loading && !error && items.length > 0 && (
          <List>
            {items.map(item => {
              const isChecked = selectedKeys.includes(item.key)
              const hasSources =
                Array.isArray(item.sources) && item.sources.length > 0

              return (
                <Item key={item.key} onClick={() => toggleKey(item.key)}>
                  <CheckboxWrapper>
                    <CheckIcon
                      src={isChecked ? CheckOnIcon : CheckOffIcon}
                      alt={isChecked ? 'checked' : 'unchecked'}
                    />
                  </CheckboxWrapper>

                  <ChatBlock>
                    <QuestionBubble>{item.question}</QuestionBubble>
                    <AnswerBubble>{item.answer}</AnswerBubble>

                    {/* 🔥 뉴스카드: 챗봇이랑 동일하게 최대 2개만 표시 */}
                    {hasSources && (
                      <ChatS.SourceList>
                        {item.sources.slice(0, 2).map((src, idx) => (
                          <ChatS.SourceCard
                            key={src.url ?? idx}
                            onClick={e => {
                              e.stopPropagation() // 카드 클릭해도 체크 토글 안 되게
                              if (src.url) {
                                window.open(
                                  src.url,
                                  '_blank',
                                  'noopener,noreferrer',
                                )
                              }
                            }}
                          >
                            {src.image_url && (
                              <ChatS.SourceThumb
                                src={src.image_url}
                                alt={`뉴스 ${idx + 1}`}
                              />
                            )}
                            <ChatS.SourceFooter>
                              <ChatS.SourceDomain>
                                {getDomain(src.url)}
                              </ChatS.SourceDomain>
                            </ChatS.SourceFooter>
                          </ChatS.SourceCard>
                        ))}
                      </ChatS.SourceList>
                    )}
                  </ChatBlock>
                </Item>
              )
            })}
          </List>
        )}
      </Content>

      <BottomBar>
        <SaveButton
          type="button"
          disabled={!hasSelection || saving}
          onClick={handleSave}
        >
          {saving
            ? '저장 중...'
            : hasSelection
            ? '저장하기'
            : '저장할 대화를 선택해 주세요'}
        </SaveButton>
      </BottomBar>

      {toastVisible && (
        <Toast message={toastMessage} onClose={handleCloseToast} />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  background-color: #f5f6f9;
  padding-top: 32px;
  margin-bottom: 65px;
  padding-bottom: 60px;
`

const Content = styled.div`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Message = styled.p`
  margin-top: 40px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 16px;
`

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  cursor: pointer;
`

const CheckboxWrapper = styled.div`
  padding-top: 8px;
  flex-shrink: 0;
`

const CheckIcon = styled.img`
  width: 22px;
  height: 22px;
  cursor: pointer;
  user-select: none;
`

const ChatBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const QuestionBubble = styled.div`
  align-self: flex-end;
  max-width: 80%;
  padding: 10px 14px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
`

const AnswerBubble = styled.div`
  align-self: flex-start;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
`

const BottomBar = styled.footer`
  position: sticky;
  bottom: 0;
  padding: 12px 16px 16px;
  background-color: #f5f6f9;
`

const SaveButton = styled.button`
  width: 100%;
  max-width: 341px;
  height: 48px;
  position: fixed;
  bottom: 80px;
  border-radius: var(--Radius-M, 12px);
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  background: ${({ disabled }) => (disabled ? '#d1d1d1' : '#4880af')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: 0.2s ease;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
  }
`