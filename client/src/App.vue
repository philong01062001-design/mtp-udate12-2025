<template>
  <div id="app">
    <el-container>
      <el-header height="60px">
        <nav class="navbar">
          <div class="nav-brand">
            <router-link to="/">Fan Community</router-link>
          </div>
          <div class="nav-links">
            <router-link to="/">Home</router-link>
            <router-link to="/community">Community</router-link>
            <router-link to="/shop">Shop</router-link>
            <router-link to="/cart" v-if="isAuthenticated">
              <el-badge :value="cartItemsCount" :hidden="cartItemsCount === 0">
                Cart
              </el-badge>
            </router-link>
            <router-link to="/login" v-if="!isAuthenticated">Login</router-link>
            <el-dropdown v-if="isAuthenticated">
              <span class="el-dropdown-link">
                {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link to="/profile">Profile</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/orders">My Orders</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </nav>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer height="60px">
        <div class="footer">
          <p>&copy; 2024 Fan Community & E-commerce Platform. All rights reserved.</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
    cartItemsCount() {
      return this.$store.getters['cart/itemsCount'];
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    // Check if user is logged in
    if (localStorage.getItem('token')) {
      this.$store.dispatch('auth/checkAuth');
    }
    // Load cart if authenticated
    if (this.isAuthenticated) {
      this.$store.dispatch('cart/loadCart');
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.el-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-links a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  padding: 8px 16px;
}

.el-dropdown-menu a {
  color: inherit;
  text-decoration: none;
  display: block;
}

.el-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.el-footer {
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  text-align: center;
}
</style>
