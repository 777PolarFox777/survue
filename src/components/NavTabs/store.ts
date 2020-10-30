export interface NavTabsState {
  activeTab: number | null;
}

export const navTabs = {
  state: {
    activeTab: null,
  } as NavTabsState,
  mutations: {
    setActiveTab(state: NavTabsState, payload: number) {
      state.activeTab = payload;
    },
  },
  getters: {
  },
  actions: {
  },
}