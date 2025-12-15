<template>
  <div class="orders">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>My Orders</h1>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div>
              <h3>Order #{{ order.id }}</h3>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <el-tag :type="getStatusType(order.status)">{{ order.status.toUpperCase() }}</el-tag>
          </div>

          <el-divider></el-divider>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <el-divider></el-divider>

          <div class="order-summary">
            <div class="summary-row">
              <span>Payment Method:</span>
              <span>{{ formatPaymentMethod(order.paymentMethod) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping Address:</span>
              <span>{{ formatAddress(order.shippingAddress) }}</span>
            </div>
            <div class="summary-row total">
              <strong>Total:</strong>
              <strong>${{ order.total.toFixed(2) }}</strong>
            </div>
          </div>
        </el-card>

        <el-empty v-if="orders.length === 0" description="No orders yet">
          <el-button type="primary" @click="$router.push('/shop')">
            Start Shopping
          </el-button>
        </el-empty>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'Orders',
  data() {
    return {
      orders: []
    };
  },
  methods: {
    async loadOrders() {
      try {
        const response = await api.get('/orders');
        this.orders = response.data.orders;
      } catch (error) {
        this.$message.error('Failed to load orders');
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    formatPaymentMethod(method) {
      const methods = {
        credit_card: 'Credit Card',
        paypal: 'PayPal',
        cash_on_delivery: 'Cash on Delivery'
      };
      return methods[method] || method;
    },
    formatAddress(address) {
      return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}`;
    },
    getStatusType(status) {
      const types = {
        pending: 'warning',
        processing: 'info',
        shipped: 'primary',
        delivered: 'success',
        cancelled: 'danger'
      };
      return types[status] || 'info';
    }
  },
  mounted() {
    this.loadOrders();
  }
};
</script>

<style scoped>
.orders {
  max-width: 1200px;
  margin: 0 auto;
}

.orders h1 {
  margin-bottom: 20px;
}

.order-card {
  margin-bottom: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-header h3 {
  margin: 0 0 5px 0;
}

.order-date {
  color: #909399;
  font-size: 14px;
}

.order-items {
  margin: 15px 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.order-summary {
  margin-top: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.summary-row.total {
  font-size: 18px;
  padding-top: 10px;
  border-top: 2px solid #409eff;
}
</style>
