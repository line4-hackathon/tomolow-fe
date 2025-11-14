import styled from 'styled-components'
import useSelect from '@/hooks/select'

import StockCard from '@/components/invest/stockCard'
import SearchBar from '@/components/common/searchBar'
import { menuTypes } from './selectType'
import NothingIcon from '@/assets/icons/icon-search-not.svg?react'
import NothingHeart from '@/assets/icons/icon-heart-navy.svg?react'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import { useEffect, useState } from 'react'
import { APIService } from './api'
import LoadingImage from '@/assets/images/image-loading.svg?react'
import { useType } from '@/contexts/TypeContext'

import * as StompJs from '@stomp/stompjs'
import { Client } from '@stomp/stompjs'

export default function InvestSearchPage() {
  const { selectedMenu, handleSelect } = useSelect('TRADING_AMOUNT')
  const [stockData, setStockData] = useState()
  const [searchName, setSearchName] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(searchName)
  const type = useType()
  //랭킹 데이터 얻기
 // 1) 웹소켓: 검색중이 아닐 때만 구독
  useEffect(() => {
    // 검색 중이면 웹소켓 구독하지 않음
    if (debouncedSearch) return;

    let client;
    let subscribeUrl;

    switch (selectedMenu) {
      case 'TRADING_AMOUNT':
        subscribeUrl = '/topic/rank/turnover';
        break;
      case 'TRADING_VOLUME':
        subscribeUrl = '/topic/rank/volume';
        break;
      case 'SOARING':
        subscribeUrl = '/topic/rank/gainers';
        break;
      case 'PLUMMETING':
        subscribeUrl = '/topic/rank/losers';
        break;
      case 'INTEREST':
        subscribeUrl = '/topic/interest/markets';
        break;
      default:
        subscribeUrl = null;
    }

    if (!subscribeUrl) return;

    client = new Client({
      brokerURL: 'wss://api.tomolow.store/ws',
      reconnectDelay: 5000,
      debug: (str) => console.log('STOMP:', str),
    });

    client.onConnect = () => {
      console.log('STOMP connected, subscribing to', subscribeUrl);
      client.subscribe(subscribeUrl, (message) => {
        try {
          const parsed = JSON.parse(message.body);
          // 서버가 배열을 바로 보내거나 { items: [...] }로 보낼 수 있으니 안전하게 처리
          const list = Array.isArray(parsed) ? parsed : parsed.items ?? parsed.data ?? [];
          // list가 배열인지 다시 확인
          if (Array.isArray(list)) {
            setStockData(list);
          } else {
            // 만약 단일 객체를 보내면 배열로 감싸서 처리할 수도 있음
            setStockData([list]);
          }
        } catch (e) {
          console.error('WS JSON parse error', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP ERROR', frame);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [selectedMenu, debouncedSearch]);

   // 2) 검색 API: debouncedSearch가 있을 때만 호출
  useEffect(() => {
    if (!debouncedSearch) return;

    let isMounted = true;
    const Search = async () => {
      try {
        const res = await APIService.private.get(`/api/search`, {
          params: { query: debouncedSearch },
        });
        if (!isMounted) return;
        // res.data가 배열인지 확인해서 넣기
        setStockData(Array.isArray(res.data) ? res.data : res.data.items ?? res.data.results ?? []);
      } catch (error) {
        console.log('검색어 조회 실패', error);
      }
    };

    Search();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);
    // 3) 관심종목(Interests): selectedMenu === 'INTEREST'이고 검색 중이 아닐 때만 호출
  useEffect(() => {
    if (selectedMenu !== 'INTEREST') return;
    if (debouncedSearch) return; // 검색 중이면 관심목록 조회 안 함

    let isMounted = true;
    const InteresSearch = async () => {
      try {
        const res = await APIService.private.get(`/api/interests/markets`);
        if (!isMounted) return;
        setStockData(res.data?.items ?? []);
      } catch (error) {
        console.log('관심 주식 조회 실패', error);
      }
    };

    InteresSearch();

    return () => {
      isMounted = false;
    };
  }, [selectedMenu, debouncedSearch]);


  useEffect(() => {
    //디바운싱 검색어 변환 및 적용
    const handler = setTimeout(() => {
      setDebouncedSearch(searchName)
    }, 1000) // 0.5초 동안 입력 없을 때만 반영

    return () => {
      clearTimeout(handler) // 입력이 계속되면 이전 타이머 취소
    }
  }, [searchName])
let stockUI;
  if (!stockData) {
    stockUI = <LoadingImage />;
  } else if (Array.isArray(stockData) && stockData.length > 0) {
    stockUI = (
      <StockCardBox>
        {stockData.map((data, index) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} key={data.name ?? index}>
            <StockCard data={data} />
            {index < stockData.length - 1 && <Line />}
          </div>
        ))}
      </StockCardBox>
    );
  } else {
    stockUI = (
      <Nothing>
        {selectedMenu === 'INTEREST' ? (
          <>
            <NothingHeart />
            <p>관심 자산이 없어요</p>
          </>
        ) : (
          <>
            <NothingIcon />
            <p>검색된 자산이 없어요</p>
          </>
        )}
      </Nothing>
    );
  }

  return (
    <Page>
      <Header title='투자' showIcon={type === 'group' ? true : false} path={-1} />
      <Contents>
        <SearchBar
          explain='원하는 자산을 검색하세요'
          searchName={searchName}
          setSearchName={setSearchName}
        />
        {!debouncedSearch && (
          <ListBox>
            {Object.keys(menuTypes).map((key) => (
              <List
                key={key}
                onClick={() => handleSelect(key)}
                // 3. 현재 선택된 메뉴 감지 및 스타일 적용
                $isMenu={selectedMenu === key ? true : false}
              >
                {menuTypes[key]} {/* 사용자에게 보이는 메뉴 이름 */}
              </List>
            ))}
          </ListBox>
        )}
        {stockUI}
      </Contents>
      <MenuBar />
    </Page>
  )
}

const Page = styled.div``
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  gap: 12px;
  align-items: center;
  margin-top: 32px;
  gap: 32px;
`
const ListBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`
const List = styled.div`
  color: ${({ $isMenu }) => ($isMenu ? '#2B5276' : '#B0B0B0')};
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  border-bottom: ${({ $isMenu }) => ($isMenu ? '1px solid #2B5276' : '')};
  padding-bottom: var(--Spacing-S, 8px);
  &:hover {
    cursor: pointer;
  }
`
const StockCardBox = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 35px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--Neutral-200, #d1d1d1);
  flex-shrink: 0;
`
const Nothing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;

  color: var(--Neutral-300, #b0b0b0);
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
