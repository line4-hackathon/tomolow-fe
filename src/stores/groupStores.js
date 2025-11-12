import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useGroupStore = create(
  persist(
    (set) => ({
      groupData: {
        groupId: '',
      },

      // 상태를 업데이트하는 액션
      // `set` 함수를 사용하여 특정 스텝의 데이터만 업데이트
      setGroupData: (data) => set((state) => ({ groupData: { ...state.groupData, ...data } })),

      // 전체 상태를 초기화하는 액션
      resetForm: () =>
        set({
          groupData: {
            groupId: '',
          },
        }),
    }),
    {
      // ⭐ 필수: 로컬 스토리지에 저장될 때 사용될 키
      name: 'stock-data-storage',
      // ⭐ 선택: stockData 객체만 저장하도록 필터링 (다른 액션 함수는 제외)
      // partialize: (state) => ({ stockData: state.stockData }),
    },
  ),
)

export default useGroupStore
