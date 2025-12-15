import api from '../../api';

const state = {
  products: [],
  currentProduct: null
};

const getters = {
  products: state => state.products,
  currentProduct: state => state.currentProduct,
  featuredProducts: state => state.products.filter(p => p.featured)
};

const actions = {
  async fetchProducts({ commit }, filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/products?${params}`);
      commit('SET_PRODUCTS', response.data.products);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async fetchProduct({ commit }, id) {
    try {
      const response = await api.get(`/products/${id}`);
      commit('SET_CURRENT_PRODUCT', response.data.product);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
