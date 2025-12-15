<template>
  <div class="post-detail" v-if="post">
    <el-card>
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <span class="post-author">by {{ post.author }}</span>
      </div>
      <p class="post-content">{{ post.content }}</p>
      <div class="post-actions">
        <el-button
          type="primary"
          icon="el-icon-thumb"
          @click="likePost"
          :disabled="!isAuthenticated"
        >
          {{ post.likes }} Likes
        </el-button>
        <span class="post-date">{{ formatDate(post.createdAt) }}</span>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h3>Comments ({{ post.comments.length }})</h3>
      
      <div v-if="isAuthenticated" class="comment-form">
        <el-input
          v-model="newComment"
          type="textarea"
          :rows="3"
          placeholder="Write a comment..."
        ></el-input>
        <el-button type="primary" @click="addComment" :loading="commenting" style="margin-top: 10px;">
          Add Comment
        </el-button>
      </div>

      <div class="comments-list">
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <strong>{{ comment.author }}</strong>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p>{{ comment.content }}</p>
        </div>
        
        <el-empty v-if="post.comments.length === 0" description="No comments yet"></el-empty>
      </div>
    </el-card>

    <el-button @click="$router.back()" style="margin-top: 20px;">Back</el-button>
  </div>
</template>

<script>
export default {
  name: 'PostDetail',
  data() {
    return {
      newComment: '',
      commenting: false
    };
  },
  computed: {
    post() {
      return this.$store.getters['posts/currentPost'];
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
  methods: {
    async likePost() {
      try {
        await this.$store.dispatch('posts/likePost', this.post.id);
        this.$message.success('Post liked!');
        await this.loadPost();
      } catch (error) {
        this.$message.error(error.message || 'Failed to like post');
      }
    },
    async addComment() {
      if (!this.newComment.trim()) {
        this.$message.warning('Please enter a comment');
        return;
      }

      this.commenting = true;
      try {
        await this.$store.dispatch('posts/addComment', {
          postId: this.post.id,
          content: this.newComment
        });
        this.$message.success('Comment added!');
        this.newComment = '';
        await this.loadPost();
      } catch (error) {
        this.$message.error(error.message || 'Failed to add comment');
      } finally {
        this.commenting = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async loadPost() {
      try {
        await this.$store.dispatch('posts/fetchPost', this.$route.params.id);
      } catch (error) {
        this.$message.error('Failed to load post');
        this.$router.back();
      }
    }
  },
  mounted() {
    this.loadPost();
  }
};
</script>

<style scoped>
.post-detail {
  max-width: 900px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 20px;
}

.post-header h1 {
  margin-bottom: 10px;
}

.post-author {
  color: #909399;
  font-size: 14px;
}

.post-content {
  line-height: 1.8;
  margin: 20px 0;
  font-size: 16px;
}

.post-actions {
  display: flex;
  gap: 15px;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.post-date {
  margin-left: auto;
  color: #909399;
  font-size: 14px;
}

.comment-form {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-date {
  color: #909399;
  font-size: 12px;
}

.comment p {
  margin: 0;
  line-height: 1.6;
}
</style>
