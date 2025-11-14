import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useStockStore = create(
  persist(
    (set) => ({
      stockData: {
        market: '',
        symbol: '',
        marketId: '',
        marketName: '',
        name: '',
        tradePrice: '',
        changeRate: '',
        changePrice: '',
        prevClose: '',
        accVolume: '',
        accTradePrice24h: '',
        tradeTimestamp: '',
        interested: '',
      },

      // 상태를 업데이트하는 액션
      // `set` 함수를 사용하여 특정 스텝의 데이터만 업데이트
      setStockData: (data) => set((state) => ({ stockData: { ...state.stockData, ...data } })),

      // 전체 상태를 초기화하는 액션
      resetForm: () =>
        set({
          stockData: {
            market: '',
            symbol: '',
            marketId: '',
            marketName: '',
            name: '',
            price: '',
            changeRate: '',
            changePrice: '',
            prevClose: '',
            accVolume: '',
            accTradePrice24h: '',
            tradeTimestamp: '',
            interested: '',
          },
        }),
    }),
    {
      // ⭐ 필수: 로컬 스토리지에 저장될 때 사용될 키
      name: 'stock-data-storage',
      // ⭐ 선택: stockData 객체만 저장하도록 필터링 (다른 액션 함수는 제외)
      // 🔑 핵심: storage 옵션에 Session Storage를 지정합니다.
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useStockStore
