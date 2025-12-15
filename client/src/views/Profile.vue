<template>
  <div class="profile">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>My Profile</h1>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <h3>Account Information</h3>
          <div class="info-row">
            <span class="label">Username:</span>
            <span class="value">{{ user.username }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Role:</span>
            <el-tag :type="user.role === 'admin' ? 'danger' : 'primary'">
              {{ user.role.toUpperCase() }}
            </el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <h3>Quick Actions</h3>
          <div class="actions">
            <el-button type="primary" @click="$router.push('/orders')" icon="el-icon-document">
              View Orders
            </el-button>
            <el-button type="success" @click="$router.push('/shop')" icon="el-icon-shopping-bag-2">
              Shop Now
            </el-button>
            <el-button type="info" @click="$router.push('/community')" icon="el-icon-chat-line-square">
              Community
            </el-button>
            <el-button type="danger" @click="handleLogout" icon="el-icon-switch-button">
              Logout
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <h3>Activity Summary</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="el-icon-shopping-cart-2"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ stats.orders }}</div>
                  <div class="stat-label">Total Orders</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="el-icon-document"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ stats.posts }}</div>
                  <div class="stat-label">Posts Created</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon">
                  <i class="el-icon-chat-line-square"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ stats.comments }}</div>
                  <div class="stat-label">Comments</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      stats: {
        orders: 0,
        posts: 0,
        comments: 0
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    }
  },
  methods: {
    handleLogout() {
      this.$confirm('Are you sure you want to logout?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('auth/logout');
        this.$message.success('Logged out successfully');
        this.$router.push('/login');
      }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
}

.profile h1 {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-weight: bold;
  color: #606266;
}

.info-row .value {
  color: #303133;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.actions .el-button {
  width: 100%;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}
</style>
