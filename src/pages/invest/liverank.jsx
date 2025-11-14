import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// NOTE: 이 컴포넌트는 SockJS와 StompJs가 HTML 페이지에 <script> 태그로 전역 로드되었다고 가정합니다.
// 실제 React/Webpack/Vite 환경에서는 npm 패키지를 설치하여 import하는 것이 일반적입니다.

const API_BASE = window.location.origin;
const WS_URL =
  (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
  window.location.host +
  '/ws';

const fmt = (n) => Number(n ?? 0).toLocaleString('ko-KR');
const pct = (n) => {
  const v = Number(n || 0);
  const sign = v >= 0 ? '+' : '';
  return sign + (v * 100).toFixed(2) + '%';
};

function RealtimeRanking() {
  const [rankType, setRankType] = useState('turnover');
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('상태: 연결 안 됨');
  const [ranking, setRanking] = useState([]);
  const [logMessages, setLogMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // STOMP 클라이언트와 구독 객체를 useRef로 관리
  const stompClientRef = useRef(null);
  const currentSubRef = useRef(null);
  const logBoxRef = useRef(null);

  // 1) 로그 추가 및 스크롤
  const log = useCallback((m) => {
    setLogMessages((prev) => {
      const newLogs = [...prev, m];
      // 최대 로그 개수 제한 (예: 100개)
      return newLogs.slice(-100); 
    });
  }, []);

  // 로그 메시지 업데이트 후 스크롤
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logMessages]);


  // 4) 랭킹 데이터 수신 및 렌더링 (상태 업데이트)
  const renderRanking = useCallback((items) => {
    setRanking((items || []).slice(0, limit));
  }, [limit]);

  // 3) 랭킹 토픽 구독 (/topic/rank/{type})
  const subscribeRank = useCallback((type, currentStompClient) => {
    if (!currentStompClient || !currentStompClient.active) return;

    const topic = `/topic/rank/${type}`;

    if (currentSubRef.current) {
      log('🧻 UNSUB 기존 구독 해제: ' + currentSubRef.current.id);
      currentSubRef.current.unsubscribe();
    }

    currentSubRef.current = currentStompClient.subscribe(topic, (msg) => {
      try {
        const list = JSON.parse(msg.body); // RankingService에서 JSON 문자열 보냄
        log(`📥 PUSH ${topic} length=${list.length}`);
        renderRanking(list);
      } catch (e) {
        console.error(e);
        log('❌ JSON 파싱 에러: ' + e.message);
      }
    });

    log('🧷 SUB ' + topic);
    setStatus(`상태: 연결 완료, ${topic} 구독 중`);
  }, [log, renderRanking]);

  // 2) WebSocket + STOMP 연결
  const connectStomp = useCallback(async (type) => {
    // 이미 연결되어 있으면 정리
    if (stompClientRef.current) {
      try {
        if (currentSubRef.current) currentSubRef.current.unsubscribe();
      } catch {}
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    // 전역 StompJs 객체 사용 확인
    if (!window.StompJs || !window.SockJS) {
        log('❌ StompJs 또는 SockJS가 전역에 로드되지 않았습니다!');
        setStatus('상태: 연결 실패 (StompJs/SockJS 로드 필요)');
        return;
    }
    
// 💡 Client 인스턴스 생성 시 StompJS.Client 대신 import 한 Client 사용
    const client = new Client({
        brokerURL: WS_URL, // 브로커 URL은 여전히 필요
        reconnectDelay: 2000,
        debug: (msg) => log(msg),

        // 💡 웹소켓 팩토리 설정: SockJS를 통해 연결하도록 명시
        webSocketFactory: () => {
            // SockJS 클라이언트 생성
            return new SockJS(WS_URL); 
        },

        onConnect: () => {
            log('✅ STOMP 연결 성공: ' + WS_URL);
            setIsConnected(true);
            stompClientRef.current = client;
            subscribeRank(type, client);
        },
      onStompError: (frame) => {
        log('❌ STOMP ERROR: ' + frame.headers['message']);
        setIsConnected(false);
        setStatus('상태: STOMP 에러 발생');
      },
      onDisconnect: () => {
        log('🔻 연결 종료됨');
        setIsConnected(false);
        setStatus('상태: 연결 끊김');
      }
    });
    
    // 활성화 시도
    log('🔗 STOMP 연결 시도...');
    client.activate();
    
    // ref에 인스턴스 저장 (연결 시도 중)
    stompClientRef.current = client; 
  }, [log, subscribeRank]);


  // 1) REST로 초기 랭킹 한번 받아오기
  async function loadInitialRank(type, currentLimit) {
    const url = `${API_BASE}/api/rank/${type}?limit=${currentLimit}`;
    log('📡 GET ' + url);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        log('❌ 랭킹 요청 실패: ' + res.status);
        return;
      }
      const body = await res.json();
      const items = body.data || [];
      log(`✅ 초기 랭킹 ${items.length}건 수신`);
      renderRanking(items);
    } catch (error) {
      log('❌ 초기 랭킹 요청 중 에러: ' + error.message);
    }
  }


  // 시작 버튼 핸들러
  const handleStart = async () => {
    setStatus('상태: 초기 랭킹 조회 중...');
    // 초기 조회는 현재 limit 상태를 반영하여 진행
    await loadInitialRank(rankType, limit); 
    // WebSocket 연결 및 구독
    connectStomp(rankType); 
  };
  
  // 연결 끊기 버튼 핸들러
  const handleDisconnect = () => {
    if (stompClientRef.current) {
      try {
        if (currentSubRef.current) currentSubRef.current.unsubscribe();
      } catch {}
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    setIsConnected(false);
    setStatus('상태: 연결 안 됨');
  };
  
  // 랭킹 타입 변경 핸들러
  const handleRankTypeChange = (e) => {
    const newType = e.target.value;
    setRankType(newType);

    // 연결된 상태에서 타입 변경 시, 새 토픽으로 재구독
    if (isConnected && stompClientRef.current) {
      subscribeRank(newType, stompClientRef.current);
    }
  };


  // 렌더링
  return (
    <>
      <style>{`
        /* 기존 CSS를 여기에 붙여넣거나 별도의 CSS 파일/모듈로 분리 */
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, Pretendard, sans-serif;
            background: #f7f8fa;
            margin: 0;
            padding: 32px;
        }

        h2 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 18px;
            align-items: center;
        }

        select, input, button {
            height: 34px;
            border-radius: 10px;
            border: 1px solid #ccc;
            padding: 0 10px;
            font-size: 14px;
        }

        button {
            background: #222;
            color: white;
            cursor: pointer;
            border: none;
        }

        #status {
            font-size: 13px;
            color: #555;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        th, td {
            padding: 8px 10px;
            font-size: 13px;
            border-bottom: 1px solid #eee;
            text-align: right;
        }

        th:nth-child(2),
        th:nth-child(3),
        td:nth-child(2),
        td:nth-child(3) {
            text-align: left;
        }

        th {
            background: #fafafa;
            font-weight: 600;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .up {
            color: #d93025;
        }
        .down {
            color: #0d904f;
        }

        pre {
            margin-top: 16px;
            background: #111;
            color: #cde2ff;
            padding: 10px;
            border-radius: 10px;
            height: 120px;
            overflow-y: auto;
            font-size: 11px;
        }
      `}</style>
      
      <h2>📊 랭킹 실시간 테스트</h2>

      <div className="controls">
        <span>랭킹 타입:</span>
        <select id="rankType" value={rankType} onChange={handleRankTypeChange}>
          <option value="turnover">거래대금 (turnover)</option>
          <option value="volume">거래량 (volume)</option>
          <option value="gainers">급상승 (gainers)</option>
          <option value="losers">급하락 (losers)</option>
        </select>

        <span>limit:</span>
        <input
          id="limit"
          type="number"
          min="1"
          max="100"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ width: '70px' }}
        />

        <button id="btnStart" onClick={handleStart}>
          초기 조회 + 실시간 구독
        </button>
        <button id="btnDisconnect" onClick={handleDisconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      <div id="status">{status}</div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>심볼</th>
            <th>이름</th>
            <th>현재가</th>
            <th>등락률</th>
            <th>등락금액</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {ranking.map((it, idx) => {
            const rate = it.changeRate ?? 0;
            const rateClass = rate > 0 ? 'up' : rate < 0 ? 'down' : '';
            return (
              <tr key={it.symbol || idx}>
                <td>{idx + 1}</td>
                <td>{it.symbol ?? '-'}</td>
                <td>{it.name ?? '-'}</td>
                <td>{fmt(it.price)}</td>
                <td className={rateClass}>{pct(rate)}</td>
                <td>{fmt(it.changePrice)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <pre id="log" ref={logBoxRef}>
        {logMessages.join('\n')}
      </pre>
    </>
  );
}

export default RealtimeRanking;