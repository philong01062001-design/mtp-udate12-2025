<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="hero-section">
          <h1>Welcome to Fan Community & E-commerce</h1>
          <p>Connect with fans and shop exclusive merchandise</p>
          <div class="hero-buttons">
            <el-button type="primary" size="large" @click="$router.push('/community')">
              Join Community
            </el-button>
            <el-button size="large" @click="$router.push('/shop')">
              Shop Now
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 40px;">
      <el-col :span="12">
        <el-card class="feature-card">
          <h2>Fan Community</h2>
          <p>Share your passion, connect with other fans, and stay updated with the latest news and discussions.</p>
          <el-button type="primary" @click="$router.push('/community')">Explore</el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="feature-card">
          <h2>Exclusive Merchandise</h2>
          <p>Shop for official and exclusive products, collectibles, and limited edition items.</p>
          <el-button type="primary" @click="$router.push('/shop')">Browse</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 40px;">
      <el-col :span="24">
        <h2>Featured Products</h2>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="6" v-for="product in featuredProducts" :key="product.id">
            <el-card :body-style="{ padding: '0px' }" class="product-card">
              <img :src="product.image" class="product-image" />
              <div style="padding: 14px;">
                <h3>{{ product.name }}</h3>
                <p class="price">${{ product.price.toFixed(2) }}</p>
                <el-button type="primary" size="small" @click="viewProduct(product.id)">
                  View Details
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row style="margin-top: 40px;">
      <el-col :span="24">
        <h2>Recent Community Posts</h2>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24" v-for="post in recentPosts.slice(0, 3)" :key="post.id">
            <el-card class="post-card">
              <h3>{{ post.title }}</h3>
              <p>{{ post.content.substring(0, 150) }}...</p>
              <div class="post-meta">
                <span>By {{ post.author }}</span>
                <span>{{ post.likes }} likes</span>
                <el-button type="text" @click="$router.push(`/post/${post.id}`)">Read More</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      featuredProducts: [],
      recentPosts: []
    };
  },
  methods: {
    viewProduct(id) {
      this.$router.push(`/product/${id}`);
    },
    async loadData() {
      try {
        await this.$store.dispatch('products/fetchProducts', { featured: 'true' });
        this.featuredProducts = this.$store.getters['products/featuredProducts'];

        await this.$store.dispatch('posts/fetchPosts');
        this.recentPosts = this.$store.getters['posts/posts'];
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 40px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 24px;
  margin-bottom: 30px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.feature-card {
  text-align: center;
  padding: 20px;
}

.feature-card h2 {
  margin-bottom: 15px;
  color: #409eff;
}

.feature-card p {
  margin-bottom: 20px;
  line-height: 1.6;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.price {
  color: #409eff;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.post-card {
  margin-bottom: 20px;
}

.post-card h3 {
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style>
