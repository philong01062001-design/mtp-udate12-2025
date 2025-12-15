import api from '../../api';

const state = {
  posts: [],
  currentPost: null
};

const getters = {
  posts: state => state.posts,
  currentPost: state => state.currentPost
};

const actions = {
  async fetchPosts({ commit }) {
    try {
      const response = await api.get('/posts');
      commit('SET_POSTS', response.data.posts);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async fetchPost({ commit }, id) {
    try {
      const response = await api.get(`/posts/${id}`);
      commit('SET_CURRENT_POST', response.data.post);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createPost({ commit }, postData) {
    try {
      const response = await api.post('/posts', postData);
      commit('ADD_POST', response.data.post);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async likePost({ commit }, postId) {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      commit('UPDATE_POST', response.data.post);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async addComment({ commit }, { postId, content }) {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts;
  },
  SET_CURRENT_POST(state, post) {
    state.currentPost = post;
  },
  ADD_POST(state, post) {
    state.posts.unshift(post);
  },
  UPDATE_POST(state, updatedPost) {
    const index = state.posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      state.posts.splice(index, 1, updatedPost);
    }
    if (state.currentPost && state.currentPost.id === updatedPost.id) {
      state.currentPost = updatedPost;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
