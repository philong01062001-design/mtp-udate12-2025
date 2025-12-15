<template>
  <div class="community">
    <el-row :gutter="20">
      <el-col :span="24">
        <h1>Fan Community</h1>
        <p>Share your thoughts and connect with fellow fans</p>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24" v-if="isAuthenticated">
        <el-card>
          <h3>Create New Post</h3>
          <el-form :model="newPost" ref="postForm">
            <el-form-item>
              <el-input v-model="newPost.title" placeholder="Post Title"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="newPost.content"
                type="textarea"
                :rows="4"
                placeholder="What's on your mind?"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createPost" :loading="posting">
                Post
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <h3>{{ post.title }}</h3>
            <span class="post-author">by {{ post.author }}</span>
          </div>
          <p class="post-content">{{ post.content }}</p>
          <div class="post-actions">
            <el-button
              type="text"
              icon="el-icon-thumb"
              @click="likePost(post.id)"
              :disabled="!isAuthenticated"
            >
              {{ post.likes }} Likes
            </el-button>
            <el-button
              type="text"
              icon="el-icon-chat-line-square"
              @click="viewPost(post.id)"
            >
              {{ post.comments.length }} Comments
            </el-button>
            <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          </div>
        </el-card>
        
        <el-empty v-if="posts.length === 0" description="No posts yet"></el-empty>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Community',
  data() {
    return {
      newPost: {
        title: '',
        content: ''
      },
      posting: false
    };
  },
  computed: {
    posts() {
      return this.$store.getters['posts/posts'];
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
  methods: {
    async createPost() {
      if (!this.newPost.title || !this.newPost.content) {
        this.$message.warning('Please fill in all fields');
        return;
      }

      this.posting = true;
      try {
        await this.$store.dispatch('posts/createPost', this.newPost);
        this.$message.success('Post created successfully!');
        this.newPost = { title: '', content: '' };
      } catch (error) {
        this.$message.error(error.message || 'Failed to create post');
      } finally {
        this.posting = false;
      }
    },
    async likePost(postId) {
      try {
        await this.$store.dispatch('posts/likePost', postId);
        this.$message.success('Post liked!');
      } catch (error) {
        this.$message.error(error.message || 'Failed to like post');
      }
    },
    viewPost(postId) {
      this.$router.push(`/post/${postId}`);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async loadPosts() {
      try {
        await this.$store.dispatch('posts/fetchPosts');
      } catch (error) {
        this.$message.error('Failed to load posts');
      }
    }
  },
  mounted() {
    this.loadPosts();
  }
};
</script>

<style scoped>
.community {
  max-width: 900px;
  margin: 0 auto;
}

.community h1 {
  margin-bottom: 10px;
}

.post-card {
  margin-bottom: 20px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.post-header h3 {
  margin: 0;
}

.post-author {
  color: #909399;
  font-size: 14px;
}

.post-content {
  margin: 15px 0;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  gap: 15px;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.post-date {
  margin-left: auto;
  color: #909399;
  font-size: 14px;
}
</style>
