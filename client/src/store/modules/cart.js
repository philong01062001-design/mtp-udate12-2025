import api from '../../api';

const state = {
  items: [],
  total: 0
};

const getters = {
  items: state => state.items,
  total: state => state.total,
  itemsCount: state => state.items.reduce((count, item) => count + item.quantity, 0)
};

const actions = {
  async loadCart({ commit }) {
    try {
      const response = await api.get('/cart');
      commit('SET_CART', response.data.cart);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  },

  async addToCart({ commit }, item) {
    try {
      const response = await api.post('/cart/add', item);
      commit('SET_CART', response.data.cart);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateCartItem({ commit }, { productId, quantity }) {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      commit('SET_CART', response.data.cart);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async removeFromCart({ commit }, productId) {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      commit('SET_CART', response.data.cart);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async clearCart({ commit }) {
    try {
      const response = await api.delete('/cart/clear');
      commit('SET_CART', response.data.cart);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

const mutations = {
  SET_CART(state, cart) {
    state.items = cart.items || [];
    state.total = cart.total || 0;
  },
  CLEAR_CART(state) {
    state.items = [];
    state.total = 0;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
