import { create } from "zustand";

const useGroupStore = create((set) => ({
  groupData: {
    groupId:'',
  },

  // 상태를 업데이트하는 액션
  // `set` 함수를 사용하여 특정 스텝의 데이터만 업데이트
  setGroupData: (data) => set((state) => ({ groupData: { ...state.groupData, ...data } })),

  // 전체 상태를 초기화하는 액션
  resetForm: () =>
    set({
    groupData: { 
        groupId:'',    
    },
    }),
}));

export default useGroupStore;
