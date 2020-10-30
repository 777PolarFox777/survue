import Vue from 'vue'
import Vuex from 'vuex'
import { setupStore } from "@/store/setupStore";
import { navTabs } from "@/components/NavTabs/store";

Vue.use(Vuex)

const storeConfig = {
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    navTabs,
  }
}

export const store = setupStore(storeConfig);

export default store;

store.navTabs.setActiveTab("123");