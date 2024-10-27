<template>
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-photo">
          <img :src="profileImage" alt="Profile Photo" />
        </div>
        <div class="profile-info">
          <h2>Name: {{ user.firstName }} {{ user.lastName }}</h2>
          <p>ID: {{ user.id }}</p>
          <button @click="changePassword" class="change-password-button">
            Change Password
          </button>
        </div>
      </div>
  
      <div class="profile-details">
        <div class="row">
          <div class="column">
            <label>First Name:</label>
            <input type="text" v-model="user.firstName" />
          </div>
          <div class="column">
            <label>Last Name:</label>
            <input type="text" v-model="user.lastName" />
          </div>
        </div>
  
        <div class="row">
          <div class="column">
            <label>Your Role:</label>
            <select v-model="user.role">
              <option value="Select ...">Select ...</option>
              <option value="Beginner">Beginner</option>
              <option value="Fitness enthusiast">Fitness enthusiast</option>
              <option value="Coach">Coach</option>
              <option value="Nutrition Expert">Nutrition Expert</option>
              <option value="Professional">Professional</option>
              <option value="Body builder">Body builder</option>
              <!-- more roles as needed -->
            </select>
          </div>
          <div class="column">
            <label>Training part:</label>
            <input type="text" v-model="user.part" />
          </div>
        </div>
  
        <div class="row">
          <div class="column">
            <label>Training Start Date:</label>
            <input type="date" v-model="user.startDate" />
          </div>
          <div class="column">
            <label>Birth Date:</label>
            <input type="date" v-model="user.birthDate" />
          </div>
        </div>
      </div>
  
      <div class="contact-address-section">
        <div class="contacts">
          <h3>Contacts</h3>
          <div class="contact-item">
            <p><i class="fa fa-phone"></i> {{ user.phone }}</p>
            <p><i class="fa fa-envelope"></i> {{ user.email }}</p>
          </div>
          <div class="contact-details">
            <label>Phone:</label>
            <input type="text" v-model="user.phone" />
            <label>Email:</label>
            <input type="email" v-model="user.email" />
            <label>Favorite Training Period:</label>
            <input type="text" v-model="user.trainperiod" />
          </div>
        </div>
  
        <div class="address">
          <h3>Address</h3>
          <p><i class="fa fa-map-marker"></i> {{ user.address }}</p>
          <div class="address-details">
            <label>Country:</label>
            <input type="text" v-model="user.country" />
            <label>City:</label>
            <input type="text" v-model="user.city" />
            <label>State/province/area:</label>
            <input type="text" v-model="user.state" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        profileImage: 'https://via.placeholder.com/150',
        user: {
          id: '22',
          firstName: ' ',
          lastName: ' ',
          Role: 'Select ...',
          TrainingPart: ' ',
          hiredDate: ' ',
          birthDate: ' ',
          phone: ' ',
          email: ' ',
          trainperiod: ' ',
          address: ' ',
          country: ' ',
          city: ' ',
          state: ' ',
        },
      };
    },
    methods: {
      changePassword() {
        alert('Change password functionality not implemented yet.');
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #f9f9f9;
}
  .profile-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .profile-photo img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  
  .profile-info h2 {
    margin: 0;
    font-size: 24px;
  }
  
  .change-password-button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .profile-details,
  .contact-address-section {
    margin-top: 20px;
  }
  
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .column {
    flex: 1;
    margin-right: 10px;
  }
  
  .contacts,
  .address {
    border: 1px solid #ddd;
    padding: 10px;
    margin-top: 10px;
  }
  
  .contact-item p {
    margin: 5px 0;
  }
  
  input,
  select {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
  }
  
  h3 {
    margin-top: 0;
  }
  
  .fa {
    margin-right: 5px;
  }
  </style>
  