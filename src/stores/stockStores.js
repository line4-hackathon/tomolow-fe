import { create } from "zustand";

const useStockStore = create((set) => ({
  stockData: {
    market: "",
    symbol:'',
    marketId:"",
    marketName: "",
    name:'',
    tradePrice: '',
    changeRate: '',
    changePrice: '',
    prevClose: '',
    accVolume: '',
    accTradePrice24h: '',
    tradeTimestamp: '',
    interested:''
  },

  // 상태를 업데이트하는 액션
  // `set` 함수를 사용하여 특정 스텝의 데이터만 업데이트
  setStockData: (data) => set((state) => ({ stockData: { ...state.stockData, ...data } })),

  // 전체 상태를 초기화하는 액션
  resetForm: () =>
    set({
    stockData: {     
    market: "",
    marketId:"",
    marketName: "",
    tradePrice: '',
    changeRate: '',
    changePrice: '',
    prevClose: '',
    accVolume: '',
    accTradePrice24h: '',
    tradeTimestamp: '' },
    }),
}));

export default useStockStore;
