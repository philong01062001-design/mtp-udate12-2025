<template>
  <div class="shop">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>Shop</h1>
        <p>Browse our exclusive merchandise</p>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card>
          <h3>Filters</h3>
          <el-form>
            <el-form-item label="Category">
              <el-select v-model="filters.category" @change="applyFilters" placeholder="All Categories">
                <el-option label="All" value=""></el-option>
                <el-option label="Apparel" value="apparel"></el-option>
                <el-option label="Collectibles" value="collectibles"></el-option>
                <el-option label="Media" value="media"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Search">
              <el-input v-model="filters.search" @input="applyFilters" placeholder="Search products"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="clearFilters" style="width: 100%;">
                Clear Filters
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-row :gutter="20">
          <el-col :span="8" v-for="product in products" :key="product.id">
            <el-card :body-style="{ padding: '0px' }" class="product-card" @click.native="viewProduct(product.id)">
              <img :src="product.image" class="product-image" />
              <div style="padding: 14px;">
                <h3>{{ product.name }}</h3>
                <p class="product-description">{{ product.description.substring(0, 80) }}...</p>
                <div class="product-footer">
                  <span class="price">${{ product.price.toFixed(2) }}</span>
                  <el-tag v-if="product.featured" type="success" size="small">Featured</el-tag>
                </div>
                <el-button type="primary" size="small" style="width: 100%; margin-top: 10px;">
                  View Details
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-empty v-if="products.length === 0" description="No products found"></el-empty>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Shop',
  data() {
    return {
      filters: {
        category: '',
        search: ''
      }
    };
  },
  computed: {
    products() {
      return this.$store.getters['products/products'];
    }
  },
  methods: {
    viewProduct(id) {
      this.$router.push(`/product/${id}`);
    },
    async applyFilters() {
      await this.loadProducts();
    },
    clearFilters() {
      this.filters = {
        category: '',
        search: ''
      };
      this.loadProducts();
    },
    async loadProducts() {
      try {
        const filterParams = {};
        if (this.filters.category) filterParams.category = this.filters.category;
        if (this.filters.search) filterParams.search = this.filters.search;
        
        await this.$store.dispatch('products/fetchProducts', filterParams);
      } catch (error) {
        this.$message.error('Failed to load products');
      }
    }
  },
  mounted() {
    this.loadProducts();
  }
};
</script>

<style scoped>
.shop {
  max-width: 1200px;
  margin: 0 auto;
}

.shop h1 {
  margin-bottom: 10px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-description {
  color: #606266;
  font-size: 14px;
  margin: 10px 0;
  min-height: 40px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #409eff;
  font-size: 20px;
  font-weight: bold;
}
</style>
