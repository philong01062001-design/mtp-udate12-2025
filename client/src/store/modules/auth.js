import api from '../../api';

const state = {
  token: localStorage.getItem('token') || '',
  user: null,
  isAuthenticated: false
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  token: state => state.token
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      commit('SET_AUTH', { token, user });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      commit('SET_AUTH', { token, user });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async checkAuth({ commit }) {
    try {
      const response = await api.get('/auth/me');
      commit('SET_USER', response.data.user);
    } catch (error) {
      commit('LOGOUT');
      localStorage.removeItem('token');
    }
  },

  logout({ commit }) {
    localStorage.removeItem('token');
    commit('LOGOUT');
  }
};

const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token;
    state.user = user;
    state.isAuthenticated = true;
  },
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = true;
  },
  LOGOUT(state) {
    state.token = '';
    state.user = null;
    state.isAuthenticated = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
