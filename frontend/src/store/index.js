import Vue from 'vue'
import Vuex from 'vuex'
import usersAPI from './../apis/users'

Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
  state: {
    currentUser: {
      _id: -1,
      account: "",
      name: "",
      email: "",
      avatar: "",
      isAdmin: false,
    },
    isAuthenticated: false,
    token: null
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }
      state.isAuthenticated = true
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('token')
    },
    setToken (state, token) {
      state.token = token
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const response = await usersAPI.getCurrentUser()

        if (response.status !== 200) {
          throw new Error(response.statusText)
        }
        const { _id, name, account, email, avatar = '', isAdmin } = response.data
        commit('setCurrentUser', { _id, name, account, email, avatar, isAdmin })
        return true
      } catch (error) {
        console.error('can not fetch user information')
        commit('revokeAuthentication')
        return false
      }
    },
    initializeStore ({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
      }
    },
  },
  modules: {
  }
})
