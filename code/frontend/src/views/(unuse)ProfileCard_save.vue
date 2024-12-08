<template>
    <div class="profile-card-container">
      <div class="profile-card">
        <div class="profile-photo">
          <img :src="user.avatar_url || defaultAvatar" alt="Profile Photo" />
        </div>
        <div class="profile-info">
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>
          <p><strong>Introduction:</strong> {{ user.introduction }}</p>
          <p><strong>Height:</strong> {{ user.height }} cm</p>
          <p><strong>Weight:</strong> {{ user.weight }} kg</p>
          <p><strong>Fitness Level:</strong> {{ fitnessLevelText }}</p>
          <p><strong>Fitness Goals:</strong> {{ user.fitness_goals }}</p>
          <p><strong>Birthday:</strong> {{ user.birthday }}</p>
          <p><strong>Training Start Date:</strong> {{ user.training_start_date }}</p>
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
      };
    },
    computed: {
      fitnessLevelText() {
        return this.fitnessLevelOptions[this.user.fitness_level] || '';
      }
    },
    methods: {
      async fetchUserProfile() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error("User is not logged in.");
          }

          console.log("Token used for fetching profile:", token);
  
          const response = await axios.get("http://localhost:3001/api/profile", {
            params: { token: token }
          });

          console.log("Profile data from backend:", response.data);

          if (response.data.rows && response.data.rows.length > 0) {
            this.user = { ...this.user, ...response.data.rows[0]};
          } else {
            console.error("No profile returned...")
          }

        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
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
    padding: 40px;
    background-color: #f0f2f5;
  }
  
  .profile-card {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  .profile-photo img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 4px solid #6c63ff;
  }
  
  .profile-info {
    text-align: left;
  }
  
  .profile-info h2 {
    margin-bottom: 20px;
    font-size: 2em;
    color: #333;
    text-align: center;
  }
  
  .profile-info p {
    margin: 10px 0;
    font-size: 1.1em;
    color: #555;
  }
  
  .profile-info p strong {
    color: #333;
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
  