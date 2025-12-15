import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import cart from './modules/cart';
import posts from './modules/posts';
import products from './modules/products';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    cart,
    posts,
    products
  }
});
