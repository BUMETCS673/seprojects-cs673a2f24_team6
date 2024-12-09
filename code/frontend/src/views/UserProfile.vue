<template>
  <div class="profile-container">
    <!-- Status message -->
    <div v-if="statusMessage" class="status-bar success">
      {{ statusMessage }}
    </div>

    <!-- Page title -->
    <h2 class="page-title">User Profile</h2>

    <!-- Form section -->
    <form class="profile-form">
      <!-- Avatar and basic information -->
      <div class="profile-header">
        <div class="profile-photo">
          <img :src="avatarImageSrc" alt="User Avatar" />
          <!-- File input and buttons for changing avatar -->
          <label for="avatar-input" class="avatar-input-label">Choose Avatar</label>
          <input
            id="avatar-input"
            type="file"
            @change="onFileChange"
            accept=".jpg"
            class="avatar-input"
          />
          <button @click.prevent="uploadAvatar" class="upload-avatar-button">
            Upload Avatar
          </button>
        </div>
        <div class="profile-info">
          <h3>Name: {{ user.First_name || "First Name" }} {{ user.Last_name || "Last Name" }}</h3>
          <p>Greetings: {{ user.id || "Hello" }}</p>
          <button @click.prevent="changePassword" class="change-password-button">
            Change Password
          </button>
        </div>
      </div>

      <!-- Form fields -->
      <div class="form-grid">
        <div v-for="(field, key) in formFields" :key="key" class="form-group">
          <label :for="key">{{ field.label }}:</label>
          <input
            v-if="field.type === 'text'"
            type="text"
            v-model="user[key]"
            :id="key"
            :placeholder="'Enter ' + field.label"
          />
          <select
            v-if="field.type === 'select'"
            v-model="user.fitness_level_text"
            :id="key"
            @change="updateFitnessLevel"
          >
            <option v-for="(label, value) in fitnessLevelOptions" :key="value" :value="label">
              {{ label }}
            </option>
          </select>
          <input
            v-if="field.type === 'date'"
            type="date"
            v-model="user[key]"
            :id="key"
          />
        </div>
      </div>

      <!-- Action buttons -->
      <div class="button-container">
        <button @click.prevent="submitProfile" class="save-button">Save Profile</button>
        <button @click.prevent="viewProfileCard" class="view-profile-button">View Profile Card</button>
      </div>
    </form>
  </div>
</template>




<script>
import axios from "axios";
import defaultAvatar from "@/assets/default-avatar.jpg";

export default {
  data() {
    return {
      statusMessage: null, 
      userID: null,
      selectedAvatarFile: null,
      avatarVersion: Date.now(),
      user: {
        first_name: "",
        last_name: "",
        avatar_url: "",
        introduction: "",
        height: "",
        weight: "",
        fitness_level: "", // Backend fitness level value
        fitness_level_text: "", // Frontend fitness level display
        fitness_goals: "",
        birthday: "",
        training_start_date: "",
        phone: "",
        Email: "",
        country: "",
        city: "",
        state: "",
        // Removed selectedAvatarFile and avatarVersion from here
      },
      defaultAvatar,
      fitnessLevelOptions: {
        1: "Beginner",
        2: "Intermediate",
        3: "Advanced",
      },
      formFields: {
        First_name: { label: "First Name", type: "text" },
        Last_name: { label: "Last Name", type: "text" },
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
        state: { label: "State", type: "text" },
      },
    };
  },
  computed: {
    avatarImageSrc() {
      if (this.user.avatar_url) {
        return this.user.avatar_url + '&t=' + this.avatarVersion;
      } else {
        return this.defaultAvatar;
      }
    },
  },



  created() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("User is not logged in.");

    // Set the avatar URL with the token
    this.user.avatar_url = 'http://localhost:3001/api/profile/avatar?token=' + token;

    this.fetchUserProfile();
  },


  methods: {
    // Update fitness level based on the selected option
    updateFitnessLevel() {
      this.user.fitness_level = Object.keys(this.fitnessLevelOptions).find(
        (key) => this.fitnessLevelOptions[key] === this.user.fitness_level_text
      );
    },

    // Submit profile data to the backend
    async submitProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User is not logged in.");

        const response = await axios.post(`http://localhost:3001/api/profile?token=${token}`, {
          ...this.user,
        });

        this.statusMessage = "Profile updated successfully!";
        console.log("Profile updated:", response.data);
        alert("Profile Updated!!!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile.");
      }
    },

    // Fetch user profile data from the backend
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User is not logged in.");

        const response = await axios.get("http://localhost:3001/api/profile", {
          params: { token: token },
        });

        if (response.data && Object.keys(response.data).length > 0) {
          console.log('Fetched user profile:', response.data);

          this.user = { ...this.user, ...response.data };

          // Set the avatar URL with the token
          this.user.avatar_url = 'http://localhost:3001/api/profile/avatar?token=' + token;
          console.log('After setting avatar_url:', this.user.avatar_url);

          // Update fitness level text
          this.user.fitness_level_text =
            this.fitnessLevelOptions[this.user.fitness_level] || "";
        } else {
          console.error("No profile returned...");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },



    // Upload the selected avatar to the server
    async uploadAvatar() {
      if (!this.selectedAvatarFile) {
        alert('Please select an avatar file to upload.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not logged in.');

        const formData = new FormData();
        formData.append('avatar', this.selectedAvatarFile);

        const response = await axios.post(
          `http://localhost:3001/api/profile/avatar?token=${token}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Server response:', response.data);

        if (response.status === 200 && response.data.success === 'updateAvatar') {
          alert('Avatar uploaded successfully!');
          // Force cache busting by updating avatarVersion
          this.avatarVersion = Date.now();
          this.selectedAvatarFile = null; // Reset the selected file
        } else {
          alert(response.data.err || 'Failed to upload avatar.');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Error occurred while uploading the avatar.');
      }
    },


        // Handle file selection
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type and size
        if (file.type !== 'image/jpeg') {
          alert('Invalid file type. Only JPG files are allowed.');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('File too large. Maximum size is 5MB.');
          return;
        }
        this.selectedAvatarFile = file; // Store the file in the component's data
      }
    },



    // Password change (placeholder)
    changePassword() {
      alert("Change password functionality not implemented yet.");
    },

    // Navigate to the profile card page
    viewProfileCard() {
      this.$router.push({ name: "ProfileCard" });
    },
  },
};
</script>





<!-- <style scoped>
.profile-photo {
  position: relative;
}

.avatar-input-label {
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
}

.avatar-input {
  display: none;
}

.upload-avatar-button {
  display: inline-block;
  margin-top: 10px;
  background-color: #2ecc71;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-avatar-button:hover {
  background-color: #27ae60;
}

.profile-photo img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.status-bar {
  padding: 10px;
  margin-bottom: 20px;
}

.status-bar.success {
  background-color: #2ecc71;
  color: white;
}
</style> -->









<style scoped>
.profile-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

/* Status bar styling */
.status-bar.success {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

/* Title styling */
.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

/* Header section styling */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.profile-photo img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  margin-right: 20px;
}

.profile-info h3 {
  margin: 0;
  color: #555;
  font-size: 1.2rem;
}

.profile-info p {
  color: #777;
  margin: 5px 0 10px;
}

.change-password-button {
  background-color: #6c63ff;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.change-password-button:hover {
  background-color: #574b90;
}

/* Form grid layout */
.profile-form .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Action buttons */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.save-button,
.view-profile-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #218838;
}

.view-profile-button {
  background-color: #17a2b8;
}

.view-profile-button:hover {
  background-color: #138496;
}


.profile-photo {
  position: relative;
  text-align: center;
}

.avatar-input {
  display: none;
}

.avatar-input-label {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.avatar-input-label:hover {
  background: #5a6268;
}

.upload-avatar-button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.upload-avatar-button:hover {
  background: #0056b3;
}


</style>
