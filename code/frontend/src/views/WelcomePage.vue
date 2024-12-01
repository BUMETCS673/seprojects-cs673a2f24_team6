<template>
  <div class="welcome-page">
    <h1>Welcome to Your Fitness Journey</h1>
    <p>Track your progress, build your workout plan, and stay motivated.</p>

    <!-- Notification setup -->
    <div class="notification-section">
      <h3>Set Up Notification</h3>
      <div class="form-group">
        <label for="notify-time">Notification Time</label>
        <input
          type="time"
          id="notify-time"
          v-model="notificationTime"
          class="notification-input"
        />
      </div>
      <button @click="setupNotification">Enable Notifications</button>
    </div>

    <div class="action-buttons">
      <router-link to="/record" class="button">Record Training</router-link>
      <router-link to="/plan" class="button">Build Fitness Plan</router-link>
    </div>

    <div class="profile-button">
      <router-link to="/UserProfile" class="button">User Profile</router-link>
    </div>

    <div class="calendar-button">
      <router-link to="/Calendar" class="button">Plan Calendar</router-link>
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

        <!-- Jump to an existing domain name -->
        <div class="external-button-container">
          <button @click="redirectToAmazon" class="external-button">
            Go To Video Demonstrations
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data() {
    return {
      notificationTime: '',
      notificationTimeout: null,
    };
  },
  methods: {
    redirectToAmazon() {
      window.location.href = 'https://fitfusion-gym-exercises.netlify.app/';
    },
    setupNotification() {
      if (!this.notificationTime) {
        alert('Please select a time for notifications.');
        return;
      }

      // Clear any existing timeout
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }

      const now = new Date();
      const [hours, minutes] = this.notificationTime.split(':').map(Number);
      const notificationTime = new Date();

      notificationTime.setHours(hours);
      notificationTime.setMinutes(minutes);
      notificationTime.setSeconds(0);
      notificationTime.setMilliseconds(0);

      let timeDifference = notificationTime - now;

      if (timeDifference < 0) {
        // If the time has already passed today, schedule for tomorrow
        timeDifference += 24 * 60 * 60 * 1000; // Add 24 hours
      }

      this.notificationTimeout = setTimeout(() => {
        alert('This is your scheduled notification!');
      }, timeDifference);

      alert('Notification set up successfully!');
    },
  },
  beforeUnmount() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  },
};
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

.calendar-button {
  position: absolute; 
  top: 80px;
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


/* push notification part design */
.notification-section {
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-section h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #007bff;
}


.notification-input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

</style>
