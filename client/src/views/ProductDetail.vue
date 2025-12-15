<template>
  <div class="product-detail" v-if="product">
    <el-row :gutter="20">
      <el-col :span="12">
        <img :src="product.image" class="product-image" />
      </el-col>
      <el-col :span="12">
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <el-tag v-if="product.featured" type="success">Featured</el-tag>
          <el-tag type="info">{{ product.category }}</el-tag>
          
          <div class="price">
            ${{ product.price.toFixed(2) }}
          </div>
          
          <p class="description">{{ product.description }}</p>
          
          <div class="stock-info">
            <el-tag v-if="product.stock > 0" type="success">In Stock ({{ product.stock }} available)</el-tag>
            <el-tag v-else type="danger">Out of Stock</el-tag>
          </div>
          
          <div class="quantity-selector">
            <label>Quantity:</label>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="product.stock"
              :disabled="product.stock === 0"
            ></el-input-number>
          </div>
          
          <el-button
            type="primary"
            size="large"
            @click="addToCart"
            :disabled="product.stock === 0 || !isAuthenticated"
            :loading="adding"
            style="width: 100%; margin-top: 20px;"
          >
            <i class="el-icon-shopping-cart-2"></i>
            {{ isAuthenticated ? 'Add to Cart' : 'Login to Purchase' }}
          </el-button>
          
          <el-button
            size="large"
            @click="$router.back()"
            style="width: 100%; margin-top: 10px;"
          >
            Back to Shop
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      quantity: 1,
      adding: false
    };
  },
  computed: {
    product() {
      return this.$store.getters['products/currentProduct'];
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
  methods: {
    async addToCart() {
      this.adding = true;
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
          quantity: this.quantity
        });
        
        this.$message.success('Product added to cart!');
        this.$router.push('/cart');
      } catch (error) {
        this.$message.error(error.message || 'Failed to add to cart');
      } finally {
        this.adding = false;
      }
    },
    async loadProduct() {
      try {
        await this.$store.dispatch('products/fetchProduct', this.$route.params.id);
      } catch (error) {
        this.$message.error('Failed to load product');
        this.$router.back();
      }
    }
  },
  mounted() {
    this.loadProduct();
  }
};
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.product-image {
  width: 100%;
  border-radius: 8px;
}

.product-info {
  padding: 20px;
}

.product-info h1 {
  margin-bottom: 15px;
}

.product-info .el-tag {
  margin-right: 10px;
}

.price {
  font-size: 32px;
  color: #409eff;
  font-weight: bold;
  margin: 20px 0;
}

.description {
  line-height: 1.8;
  color: #606266;
  margin: 20px 0;
  font-size: 16px;
}

.stock-info {
  margin: 20px 0;
}

.quantity-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-selector label {
  font-weight: bold;
}
</style>
