<template>
  <div class="login-page">
    <div class="login-box">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
      </div>
      <h2>Login</h2>
      <input v-model="email" placeholder="Email" class="input-box" />
      <input v-model="password" type="password" placeholder="Password" class="input-box" />
      <button @click="login" class="login-button">Continue</button> 
      <button @click="goToRegister" class="register-button">Register</button>
      <p class="support-text">
        Welcome to FitFusion, the Fitness Plan Builder. <br />
        Please login or register.
      </p>
    </div>
  </div>
</template>

<script>
// import { ref } from 'vue';
import { useRouter } from 'vue-router';


export default {
  data () {
    return {
      router: useRouter(),
      email: '', 
      password: ''
    }
  }, 

  methods: {
    login () {
      
      let url = 'http://127.0.0.1:3001/api/account?email=' + encodeURIComponent(this.email);
      url += '&password=' + encodeURIComponent(this.password);
      

      fetch(url, { method: 'get' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })

        .then(data => {
          console.log("Backend response:", data);
          if (data.token) {
            localStorage.setItem('loggedIn', 'true');   // Store login status
            localStorage.setItem('token', data.token);
            alert('Successfully logged in'); // Show a message if available
            window.location.href = '/welcome';          // Go to welcome page
          } else {
            alert('Invalid email or password');
          }
        })
        // .then(data => {
        //   localStorage.setItem('loggedIn', 'true');   // safety check success
        //   alert(data);                                // show logged in
        //   window.location.href = '/welcome';          // go to welcome page
        // })
        .catch(error => {
          console.error('Error during login:', error); 
          alert('Invalid email or password');
        });
    },

    goToRegister() {
      this.$router.push('/register');
    }

  }






//   setup() {
//     const email = ref('');
//     const password = ref('');
//     const router = useRouter();

//     const login = () => {

//       // simulate loginnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
//       if (email.value === 'admin@example.com' && password.value === 'admin123') {
//         localStorage.setItem('loggedIn', 'true');
//         router.push('/welcome');
//       } else {
//         alert('Invalid credentials.');
//       }
//     };

//     return {
//       email,
//       password,
//       login
//     };
//   }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.logo img {
  max-width: 150px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.input-box {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.login-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  align-items: center;
}

.login-button:hover {
  background-color: #0056b3;
}

.support-text {
  margin-top: 20px;
  font-size: 14px;
  color: #777;
  line-height: 1.5;
}


.register-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1rem;
  display: block;
}

.register-button:hover {
  background-color: #0056b3;
}

</style>