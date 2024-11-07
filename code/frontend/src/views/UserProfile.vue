<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-photo">
        <img :src="user.avatar_url || defaultAvatar" alt="Profile Photo" />
      </div>
      <div class="profile-info">
        <h2>Name: {{ user.first_name }} {{ user.last_name }}</h2>
        <p>ID: {{ user.id }}</p>
        <button @click="changePassword" class="change-password-button">
          Change Password
        </button>
      </div>
    </div>

    <div class="profile-details">
      <!-- inputs -->
      <div class="row" v-for="(field, key) in formFields" :key="key">
        <div class="column">
          <label :for="key">{{ field.label }}:</label>
          <input v-if="field.type === 'text'" type="text" v-model="user[key]" :id="key" />
          <select v-if="field.type === 'select'" v-model="user.fitness_level_text" :id="key" @change="updateFitnessLevel">
            <option v-for="(label, value) in fitnessLevelOptions" :key="value" :value="label">{{ label }}</option>
          </select>
          <input v-if="field.type === 'date'" type="date" v-model="user[key]" :id="key" />
        </div>
      </div>
      <div class="button-container">
        <button @click="submitProfile" class="save-button">Save Profile</button>
        <button @click="viewProfileCard" class="view-profile-button">View Profile Card</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import defaultAvatar from '@/assets/default-avatar.jpg';

export default {
  data() {
    return {
      user: {
        first_name: '',
        last_name: '',
        avatar_url: '',
        introduction: '',
        height: '',
        weight: '',
        fitness_level: '', // Stores the numeric value to be sent to the backend
        fitness_level_text: '', // Stores the display text for frontend
        fitness_goals: '',
        birthday: '',
        training_start_date: '',
        phone: '',
        Email: '',
        country: '',
        city: '',
        state: '',
      },
      defaultAvatar, 
      fitnessLevelOptions: {
        1: "Beginner",
        2: "Intermediate",
        3: "Advanced"
      },
      formFields: {
        first_name: { label: "First Name", type: "text" },
        last_name: { label: "Last Name", type: "text" },
        avatar_url: { label: "Avatar URL", type: "text" },
        introduction: { label: "Introduction", type: "text" },
        height: { label: "Height", type: "text" },
        weight: { label: "Weight", type: "text" },
        fitness_level: { label: "Fitness Level", type: "select" },
        fitness_goals: { label: "Fitness Goals", type: "text" },
        birthday: { label: "Birthday", type: "date" },
        training_start_date: { label: "Training Start Date", type: "date" },
        phone: { label: "Phone", type: "text" },
        Email: { label: "Email", type: "text" },
        country: { label: "Country", type: "text" },
        city: { label: "City", type: "text" },
        state: { label: "State", type: "text" }
      }
    };
  },
  methods: {

    updateFitnessLevel() {
      this.user.fitness_level = Object.keys(this.fitnessLevelOptions).find(
        key => this.fitnessLevelOptions[key] === this.user.fitness_level_text
      );
    },


    async submitProfile() {
      try {
        const token = localStorage.getItem('token'); // get the token from local storage
        if (!token) {
          throw new Error("User is not logged in.");
        }
        
        const response = await axios.post("http://localhost:3001/api/profile", {
          token: token,
          ...this.user
        });

        console.log("Profile updated successfully:", response.data);

        this.$router.push({ name: 'ProfileCard' })

      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    

    changePassword() {
      // TODO: Add password changing method here.
      alert('Change password functionality not implemented yet.');
    },


    viewProfileCard() {
      this.$router.push({ name: 'ProfileCard' });
    },

  },

  
  mounted() {
    this.user.fitness_level_text = this.fitnessLevelOptions[this.user.fitness_level] || '';
  }


};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.profile-photo img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
  border: 2px solid #ddd;
}

.profile-info h2 {
  margin: 0;
  font-size: 2em;
  color: #333;
}

.profile-info p {
  font-size: 1em;
  color: #777;
}

.change-password-button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.change-password-button:hover {
  background-color: #574b90;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  flex: 1;
  font-weight: bold;
  color: #333;
  margin-right: 20px;
  text-align: right;
}

.input-box {
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-box:focus {
  border-color: #6c63ff;
  outline: none;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-button,
.view-profile-button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.save-button {
  background-color: #28a745;
  color: #fff;
}

.save-button:hover {
  background-color: #218838;
}

.view-profile-button {
  background-color: #17a2b8;
  color: #fff;
}

.view-profile-button:hover {
  background-color: #138496;
}
</style>