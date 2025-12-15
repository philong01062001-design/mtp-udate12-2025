<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>Login</h2>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="Email" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%;">
            Login
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register-link">
        Don't have an account? <router-link to="/register">Register here</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' },
          { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return;

        this.loading = true;
        try {
          await this.$store.dispatch('auth/login', this.form);
          this.$message.success('Login successful!');
          
          // Load cart after login
          await this.$store.dispatch('cart/loadCart');
          
          const redirect = this.$route.query.redirect || '/';
          this.$router.push(redirect);
        } catch (error) {
          this.$message.error(error.message || 'Login failed');
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
