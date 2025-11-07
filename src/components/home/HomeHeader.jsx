import React from 'react'
import Header from '@/components/common/Header.jsx'
import styled from 'styled-components'
import useSelect from '@/hooks/select.js'

const HOME_TABS = [
  { key: 'asset', label: '내 자산' },
  { key: 'history', label: '거래내역' },
]

function HomeHeader({ selectedTab = { selectedTab }, onChangeTab }) {
  const { selectedMenu, handleSelect } = useSelect('asset') // 기본 탭: 내 자산

  const handleTabClick = (key) => {
    handleSelect(key)
    // HomePage에서 탭에 따라 다른 내용을 보여주고 싶으면 콜백 전달
    if (onChangeTab) onChangeTab(key)
  }

  return (
    <Container>
      {/* 탭 영역 */}
      <TabWrapper>
        {HOME_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            $active={selectedMenu === tab.key}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabWrapper>

      {/* 배너 영역: 탭 선택에 따라 배너 유무 결정 */}
      {selectedTab === 'asset' && (
        <Banner>
          {/*bannerImage && <S.BannerIcon src={bannerImage} alt="배너 아이콘" />*/}
          <BannerText>다양한 내용의 콘텐츠가 들어가는 배너 영역입니다.</BannerText>
        </Banner>
      )}
    </Container>
  )
}

export default HomeHeader

const Container = styled.div`
  background: var(--Neutral-0, #fff);
  gap: 20px;
  padding: var(--Spacing-2XL, 32px) var(--Grid-Margin, 16px) var(--Spacing-L, 16px)
    var(--Grid-Margin, 16px);
  align-self: stretch;
  display: flex;
  flex-direction: column;
`

const TabWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--Spacing-XL, 24px);
`

const TabButton = styled.button`
  border: none;
  background: transparent;
  padding: 0 0 8px;
  font-size: 16px;
  color: ${({ $active }) => ($active ? '#2B5276' : '#B0B0B0')};
  border-bottom: ${({ $active }) => ($active ? '1px solid #2B5276' : '1px solid transparent')};
`

const Banner = styled.div`
  display: flex;
  padding: 21px 17px 21px 18px;
  justify-content: center;
  align-items: center;
  gap: 15px;
  border-radius: var(--Radius-M, 12px);
  background: #aa6bc5;
  color: #fff;
`

const BannerText = styled.p`
  font-size: 16px;
`
