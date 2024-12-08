<template>
  <div class="profile-card-container">
    <div class="profile-card">
      <div class="profile-photo">
        <img :src="avatarImageSrc" alt="Profile Photo" />
      </div>
      <div class="profile-info">
        <h2><strong>Name:</strong> {{ user.First_name }} {{ user.Last_name }}</h2>
        <p><strong>Introduction:</strong> {{ user.introduction }}</p>
        <p><strong>Height:</strong> {{ user.height }} cm</p>
        <p><strong>Weight:</strong> {{ user.weight }} kg</p>
        <p><strong>Fitness Level:</strong> {{ fitnessLevelText }}</p>
        <p><strong>Fitness Goals:</strong> {{ user.fitness_goals }}</p>
        <p><strong>Birthday:</strong> {{ formattedBirthday }}</p>
        <p><strong>Training Start Date:</strong> {{ formattedTrainingStartDate }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
        <p><strong>Email:</strong> {{ user.Email }}</p>
        <p><strong>Location:</strong> {{ user.city }}, {{ user.state }}, {{ user.country }}</p>
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
        fitness_level: '', // stores the numeric value
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
      avatarVersion: Date.now(), // For cache busting
    };
  },



  computed: {
    fitnessLevelText() {
      return this.fitnessLevelOptions[this.user.fitness_level] || '';
    },
    avatarImageSrc() {
      if (this.user.avatar_url) {
        return this.user.avatar_url + '&t=' + this.avatarVersion;
      } else {
        return this.defaultAvatar;
      }
    },

    // beautify birthday and training start date display. 
    formattedBirthday() {
      return this.formatDate(this.user.birthday);
    },
    formattedTrainingStartDate() {
      return this.formatDate(this.user.training_start_date);
    },
  },




  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("User is not logged in.");
        }

        console.log("Token used for fetching profile:", token);

        const response = await axios.get(`http://localhost:3001/api/profile`, {
          params: { token: token }
        });

        console.log("Profile data from backend:", response.data);

        if (response.data && response.data.user_profile) {
          this.user = { ...this.user, ...response.data.user_profile };
        } else if (response.data.rows && response.data.rows.length > 0) {
          this.user = { ...this.user, ...response.data.rows[0] };
        } else if (response.data && Object.keys(response.data).length > 0) {
          this.user = { ...this.user, ...response.data };
        } else {
          console.error("No profile returned...");
        }

        // After updating user data, set the avatar URL
        this.user.avatar_url = 'http://localhost:3001/api/profile/avatar?token=' + token;
        // Update avatarVersion to force cache busting
        this.avatarVersion = Date.now();

      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString); 
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); 
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },

  },



  mounted() {
    this.fetchUserProfile();
  }
};
</script>




  
<style scoped>
.profile-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(20deg, #ff2844, #6741ff);
  padding: 20px;
  box-sizing: border-box;
}

.profile-card {
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.profile-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.profile-photo {
  position: relative;
  margin-bottom: 30px;
}

.profile-photo img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #b92a76;
  box-shadow: 0 8px 55px rgba(185, 42, 118, 0.5);
  transition: transform 0.3s ease-in-out;
}

.profile-card:hover .profile-photo img {
  transform: scale(1.1);
}

.profile-info {
  text-align: left;
  width: 100%;
}

.profile-info h2 {
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: bold;
  text-align: center;
  color: #b92a76;
}

.profile-info p {
  margin: 8px 0;
  font-size: 1.1em;
  line-height: 1.6;
  color: #334e64;
}

.profile-info p strong {
  font-weight: bold;
  color: #6741ff;
}

@media screen and (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }

  .profile-info h2 {
    font-size: 1.5em;
  }

  .profile-info p {
    font-size: 1em;
  }
}
</style>
