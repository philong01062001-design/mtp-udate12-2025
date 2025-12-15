<template>
  <div class="checkout">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>Checkout</h1>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <h3>Shipping Information</h3>
          <el-form :model="form" :rules="rules" ref="checkoutForm">
            <el-form-item label="Full Name" prop="fullName">
              <el-input v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="City" prop="city">
              <el-input v-model="form.city"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="State" prop="state">
                  <el-input v-model="form.state"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="ZIP Code" prop="zipCode">
                  <el-input v-model="form.zipCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 20px;">
          <h3>Payment Method</h3>
          <el-radio-group v-model="form.paymentMethod">
            <el-radio label="credit_card">Credit Card</el-radio>
            <el-radio label="paypal">PayPal</el-radio>
            <el-radio label="cash_on_delivery">Cash on Delivery</el-radio>
          </el-radio-group>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <h3>Order Summary</h3>
          <div class="order-items">
            <div v-for="item in items" :key="item.productId" class="order-item">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <el-divider></el-divider>
          <div class="summary-item total">
            <strong>Total:</strong>
            <strong>${{ total.toFixed(2) }}</strong>
          </div>
          <el-button
            type="primary"
            size="large"
            @click="placeOrder"
            :loading="placing"
            style="width: 100%; margin-top: 20px;"
          >
            Place Order
          </el-button>
          <el-button
            size="large"
            @click="$router.back()"
            style="width: 100%; margin-top: 10px;"
          >
            Back to Cart
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'Checkout',
  data() {
    return {
      form: {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        paymentMethod: 'credit_card'
      },
      rules: {
        fullName: [{ required: true, message: 'Please enter full name', trigger: 'blur' }],
        address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
        city: [{ required: true, message: 'Please enter city', trigger: 'blur' }],
        state: [{ required: true, message: 'Please enter state', trigger: 'blur' }],
        zipCode: [{ required: true, message: 'Please enter ZIP code', trigger: 'blur' }],
        phone: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }]
      },
      placing: false
    };
  },
  computed: {
    items() {
      return this.$store.getters['cart/items'];
    },
    total() {
      return this.$store.getters['cart/total'];
    }
  },
  methods: {
    placeOrder() {
      this.$refs.checkoutForm.validate(async (valid) => {
        if (!valid) return;

        if (this.items.length === 0) {
          this.$message.warning('Your cart is empty');
          return;
        }

        this.placing = true;
        try {
          const orderData = {
            items: this.items,
            total: this.total,
            shippingAddress: {
              fullName: this.form.fullName,
              address: this.form.address,
              city: this.form.city,
              state: this.form.state,
              zipCode: this.form.zipCode,
              phone: this.form.phone
            },
            paymentMethod: this.form.paymentMethod
          };

          await api.post('/orders', orderData);
          
          // Clear cart after successful order
          await this.$store.dispatch('cart/clearCart');
          
          this.$message.success('Order placed successfully!');
          this.$router.push('/orders');
        } catch (error) {
          this.$message.error(error.response?.data?.message || 'Failed to place order');
        } finally {
          this.placing = false;
        }
      });
    }
  },
  mounted() {
    if (this.items.length === 0) {
      this.$message.warning('Your cart is empty');
      this.$router.push('/cart');
    }
  }
};
</script>

<style scoped>
.checkout {
  max-width: 1200px;
  margin: 0 auto;
}

.checkout h1 {
  margin-bottom: 20px;
}

.order-items {
  margin: 15px 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 14px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.summary-item.total {
  font-size: 18px;
}
</style>
