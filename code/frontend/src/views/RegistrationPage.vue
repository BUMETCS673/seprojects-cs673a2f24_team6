<template>
  <div class="registration-container">
    <div class="header">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h2>FitFusion Registration</h2>
      <a @click="goToLogin" class="back-link">Back to login</a>
    </div>
    <form @submit.prevent="registerUser">
      <div class="input-group">
        <i class="icon email-icon"></i>
        <input type="text" v-model="email" placeholder="Your Email Address" required />
      </div>
      <div class="input-group">
        <i class="icon username-icon"></i>
        <input type="text" v-model="name" placeholder="Your Username" required />
      </div>
      <div class="input-group">
        <i class="icon password-icon"></i>
        <input type="password" v-model="password" placeholder="Your Password" required />
      </div>
      <button type="submit" class="submit-button">Register!</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      email: '',
      name: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            name: this.name,
            password: this.password,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed. Please try again.');
        }
  
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    goToLogin() {
      this.$router.push('/');
    }
  }
};
</script>
  
<style scoped>
.registration-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
  
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
  
.logo {
  width: 100px;
}
  
.back-link {
  width: 150px;
  font-size: 0.8rem;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}
  
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  background-color: #f9f9f9;
}
  
.input-group input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  background-color: transparent;
}
  
.icon {
  margin-right: 0.5rem;
  color: #888;
}
  
.email-icon:before {
  content: "📱";
}
  
.username-icon:before {
  content: "👤";
}
  
.password-icon:before {
  content: "🔒";
}
  
  
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}
  
.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
  