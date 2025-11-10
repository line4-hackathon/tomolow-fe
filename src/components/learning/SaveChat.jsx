import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import CheckOnIcon from '@/assets/icons/icon-save-check-blue.svg'
import CheckOffIcon from '@/assets/icons/icon-save-check-gray.svg'
import Toast from '@/components/invest/ToastMessage'

// 서버 주소 & 임시 토큰
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_FAKE_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb295ZW9uIiwianRpIjoic29veWVvbiIsImlhdCI6MTc2Mjc0OTg0MSwiZXhwIjoxNzYyNzUxNjQxfQ.78zH7ASVse7PSwrA3Jj26WiYRVyy6ExTFylTShrbALo'

const getAuthHeader = () => ({
    Authorization: `Bearer ${TEMP_FAKE_TOKEN}`,
})

export default function SaveChat() {
    const navigate = useNavigate()

    const [items, setItems] = useState([]) // [{ key, question, answer }]
    const [selectedKeys, setSelectedKeys] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const hasSelection = selectedKeys.length > 0

    //  기존 대화 목록 가져오기
    useEffect(() => {
        const fetchRoom = async () => {
        if (!API_BASE_URL) {
            setError('서버 주소가 설정되어 있지 않습니다.')
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
            setError('대화 목록을 불러오지 못했습니다.')
            return
            }

        const json = await res.json()
        console.log('room (save page) response:', json)

        if (!json.success) {
            setError(json.message || '대화 목록을 불러오지 못했습니다.')
            return
        }

        setItems(Array.isArray(json.data) ? json.data : [])
        } catch (err) {
            console.error('room error:', err)
            setError('서버 통신 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
        }

        fetchRoom()
    }, [])

    // 체크박스 토글
    const toggleKey = (key) => {
        setSelectedKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        )
    }

    // 토스트 닫기
    const handleCloseToast = () => {
        setToastVisible(false)
    }

    // 저장 API 호출
    const handleSave = async () => {
        if (!hasSelection || saving || !API_BASE_URL) return

        setSaving(true)
        setError('')

        try {
        const res = await fetch(`${API_BASE_URL}/api/chatbot/save`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            },
            body: JSON.stringify({ keys: selectedKeys }),
        })

        if (!res.ok) {
            const text = await res.text()
            console.error('save error:', res.status, text)
            setError('대화 저장에 실패했습니다.')
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
        }, 113339000)

        setSelectedKeys([])
        } catch (err) {
        console.error('save error:', err)
        setError('서버 통신 중 오류가 발생했습니다.')
        } finally {
        setSaving(false)
        }
    }

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
                {items.map((item) => {
                const isChecked = selectedKeys.includes(item.key)
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

        {/*토스트 메시지 */}
        {toastVisible && (
            <Toast
            message={toastMessage}
            onClose={handleCloseToast}
            />
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
    margin-bottom: 60px;
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
    gap: 25px;
    margin-bottom: 16px;
`

const Item = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
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
    height: 48px;
    border-radius: var(--Radius-M, 12px);
    border: none;
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
    background: ${({ disabled }) => (disabled ? '#D1D1D1' : '#4880AF')};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    transition: 0.2s ease;

    &:hover {
        opacity: ${({ disabled }) => (disabled ? 1 : 0.9)};
    }
`