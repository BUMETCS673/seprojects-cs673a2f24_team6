<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li v-if="!isLoggedIn"><router-link to="/">Login</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/welcome">Welcome</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/record">Record Training</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/plan">Plan Builder</router-link></li>
          <li v-if="isLoggedIn"><button @click="logout">Logout</button></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; 2024 Fitness Plan Builder. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const state = reactive({
      loggedIn: localStorage.getItem('loggedIn') === 'true'
    });

    const isLoggedIn = computed(() => state.loggedIn);

    const logout = () => {
      localStorage.setItem('loggedIn', 'false');
      state.loggedIn = false;
      router.push('/');
    };

    return { isLoggedIn, logout };
  }
};
</script>

<style scoped>
header {
  background-color: #4CAF50;
  padding: 10px;
  text-align: center;
}
nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
nav ul li {
  display: inline;
  margin-right: 15px;
}
nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.3s;
}
nav ul li a:hover {
  background-color: #45a049;
}
main {
  padding: 20px;
}
footer {
  text-align: center;
  padding: 10px;
  background-color: #f1f1f1;
}
</style>
