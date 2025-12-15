<template>
  <div class="cart">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>Shopping Cart</h1>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card v-if="items.length > 0">
          <el-table :data="items" style="width: 100%">
            <el-table-column label="Product" min-width="200">
              <template slot-scope="scope">
                <strong>{{ scope.row.name }}</strong>
              </template>
            </el-table-column>
            <el-table-column label="Price" width="120">
              <template slot-scope="scope">
                ${{ scope.row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="Quantity" width="150">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :min="1"
                  @change="updateQuantity(scope.row.productId, scope.row.quantity)"
                  size="small"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Subtotal" width="120">
              <template slot-scope="scope">
                ${{ (scope.row.price * scope.row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="100">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="removeItem(scope.row.productId)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px;">
            <el-button type="danger" plain @click="clearCart">
              Clear Cart
            </el-button>
          </div>
        </el-card>

        <el-empty v-else description="Your cart is empty">
          <el-button type="primary" @click="$router.push('/shop')">
            Go Shopping
          </el-button>
        </el-empty>
      </el-col>

      <el-col :span="8">
        <el-card v-if="items.length > 0">
          <h3>Order Summary</h3>
          <div class="summary-item">
            <span>Items:</span>
            <span>{{ itemsCount }}</span>
          </div>
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <el-divider></el-divider>
          <div class="summary-item total">
            <strong>Total:</strong>
            <strong>${{ total.toFixed(2) }}</strong>
          </div>
          <el-button type="primary" size="large" @click="proceedToCheckout" style="width: 100%; margin-top: 20px;">
            Proceed to Checkout
          </el-button>
          <el-button size="large" @click="$router.push('/shop')" style="width: 100%; margin-top: 10px;">
            Continue Shopping
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  computed: {
    items() {
      return this.$store.getters['cart/items'];
    },
    total() {
      return this.$store.getters['cart/total'];
    },
    itemsCount() {
      return this.$store.getters['cart/itemsCount'];
    }
  },
  methods: {
    async updateQuantity(productId, quantity) {
      try {
        await this.$store.dispatch('cart/updateCartItem', { productId, quantity });
      } catch (error) {
        this.$message.error('Failed to update quantity');
      }
    },
    async removeItem(productId) {
      try {
        await this.$store.dispatch('cart/removeFromCart', productId);
        this.$message.success('Item removed from cart');
      } catch (error) {
        this.$message.error('Failed to remove item');
      }
    },
    async clearCart() {
      this.$confirm('Are you sure you want to clear your cart?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$store.dispatch('cart/clearCart');
          this.$message.success('Cart cleared');
        } catch (error) {
          this.$message.error('Failed to clear cart');
        }
      }).catch(() => {});
    },
    proceedToCheckout() {
      this.$router.push('/checkout');
    }
  },
  mounted() {
    this.$store.dispatch('cart/loadCart');
  }
};
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
}

.cart h1 {
  margin-bottom: 20px;
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
