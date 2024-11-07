<template>
  <div class="welcome-page">
    <h1>Welcome to Your Fitness Journey</h1>
    <p>Track your progress, build your workout plan, and stay motivated.</p>

    <div class="action-buttons">
      <router-link to="/record" class="button">Record Training</router-link>
      <router-link to="/plan" class="button">Build Fitness Plan</router-link>
    </div>


    <div class="profile-button">
      <router-link to="/UserProfile" class="button">User Profile</router-link>
    </div>


    <div class="exercise-guide">
      <h2>Exercise Guides</h2>
      <div class="exercise-cards">
        <router-link to="/exercise/side-bend" class="exercise-card">
          <img src="@/assets/side-bend.png" alt="Side Bend" />
          <p>45° Side Bend</p>
        </router-link>

        <router-link to="/exercise/push-up" class="exercise-card">
          <img src="@/assets/push-up.png" alt="Push Up" />
          <p>Push Up</p>
        </router-link>
      
      
      <!-- jump to a existing domain name -->
      <div class="external-button-container">
        <button @click="redirectToAmazon" class="external-button">go to ................</button>
      </div>


        

        <!-- other possible guidance cards....... -->


        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',

  methods: {
    redirectToAmazon() {
      window.location.href = 'https://fitfusion-gym-exercises.netlify.app/';
    }
  }
}

</script>

<style scoped>
.welcome-page {
  text-align: center;
  padding: 50px;
}

h1 {
  color: #4CAF50;
  font-size: 36px;
}

p {
  font-size: 18px;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.profile-button {
  position: absolute; 
  top: 25px;
  right: 10px;
}

.button {
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px;
  margin: 0 15px;
  font-size: 18px;
  text-decoration: none;
  border-radius: 5px;
}

.button:hover {
  background-color: #45a049;
}

.exercise-guide {
  margin-top: 40px;
}

.exercise-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.exercise-card {
  text-align: center;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 10px;
  width: 200px;
  transition: transform 0.3s;
}

.exercise-card img {
  max-width: 100%;
  height: auto;
}

.exercise-card p {
  margin-top: 10px;
  font-weight: bold;
}

.exercise-card:hover {
  transform: scale(1.05);
}


.external-button-container {
  text-align: center;
  margin-top: 20px;
}

.external-button {
  background-color: #ff9900;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.external-button:hover {
  background-color: #e68a00;
}

</style>
