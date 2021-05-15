import Vue from "vue";
import Vuex from "vuex";
import { SyncDataDto } from "@akari-sync/dto";
import { LOAD_MAIN_LIST, SAVE_MAIN_LIST } from "@/Constants";

Vue.use(Vuex);

export interface StoreState {
  mainList: SyncDataDto[];
}

const state: StoreState = {
  mainList: []
};

export default new Vuex.Store({
  state: state,
  mutations: {
    [SAVE_MAIN_LIST](state: StoreState, value: SyncDataDto[]) {
      state.mainList = value;
    }
  },
  actions: {
    async [LOAD_MAIN_LIST]({ commit }) {
      const response = await Vue.axios.get("/syncdata/list");
      console.log(response.data);
      commit(SAVE_MAIN_LIST, response.data);
    }
  },
  modules: {}
});
