<template>
  <div class="record-container">
    <h1 class="title">Record Exercise</h1>

    <!-- Display messages -->
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>

    <button @click="goToCurrentRecords" class="view-records-button">View Current Records</button>

    <!-- Exercise Type Dropdown -->
    <div class="form-group">
      <label for="exercise_type">Exercise Type:</label>
      <select v-model="selectedExerciseType" @change="onExerciseTypeChange" id="exercise_type" class="select-field">
        <option value="" disabled>Select Exercise Type</option>
        <option v-for="type in exerciseTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Exercise Name Dropdown -->
    <div class="form-group">
      <label for="exercise_name">Exercise Name:</label>
      <select v-model="selectedExerciseId" :disabled="!selectedExerciseType" id="exercise_name" class="select-field">
        <option value="" disabled>Select Exercise Name</option>
        <option v-for="exercise in exercisesByType" :key="exercise.exercise_id" :value="exercise.exercise_id">
          {{ exercise.name }}
        </option>
      </select>
    </div>

    <!-- Description Display -->
    <div class="form-group">
      <label for="description">Description:</label>
      <textarea v-model="selectedExerciseDescription" id="description" class="textarea-field" readonly></textarea>
    </div>

    <!-- Number of Sets Input -->
    <div class="form-group">
      <label for="number_of_set">Number of Sets:</label>
      <input type="number" v-model="number_of_set" id="number_of_set" class="input-field" />
    </div>

    <!-- Status Selection -->
    <div class="form-group">
      <label for="status">Status:</label>
      <select v-model="selectedStatus" id="status" class="select-field">
        <option value="Done">Done</option>
        <option value="Half Finished">Half Finished</option>
        <option value="Intended">Intended</option>
        <option value="Abandoned">Abandoned</option>
      </select>
    </div>

    <!-- Priority Input -->
    <div class="form-group">
      <label for="priority">Priority:</label>
      <input
        type="number"
        v-model="priority"
        id="priority"
        min="1"
        max="10"
        class="input-field"
      />
    </div>

    <!-- Start Time Input -->
    <div class="form-group">
      <label for="start_time">Start Time:</label>
      <input type="datetime-local" v-model="start_time" id="start_time" class="input-field" />
    </div>

    <!-- End Time Input -->
    <div class="form-group">
      <label for="end_time">End Time:</label>
      <input type="datetime-local" v-model="end_time" id="end_time" class="input-field" />
    </div>

    <!-- Submit Button -->
    <button @click="submitRecord" class="save-button">Submit</button>

    <!-- Submitted Records Display -->
    <h2 class="subtitle">Submitted Records</h2>
    <div v-if="records && records.length > 0" class="records-list">
      <div v-for="(record, index) in records" :key="index" class="record-item">
        <h3>Exercise: {{ record.exercise_name }}</h3>
        <p><strong>Description:</strong> {{ record.description }}</p>
        <p><strong>Number of Sets:</strong> {{ record.number_of_set }}</p>
        <p><strong>Status:</strong> {{ statusReverseMapping[record.status] }}</p>
        <p><strong>Priority:</strong> {{ record.priority }}</p>
        <p><strong>Start Time:</strong> {{ record.start_time }}</p>
        <p><strong>End Time:</strong> {{ record.end_time }}</p>
        <p><strong>Total Time:</strong> {{ record.total_time }} seconds</p>
      </div>
    </div>
    <div v-else>
      <p>No records submitted yet.</p>
    </div>
  </div>
</template>





<script>
import axios from 'axios';

export default {
  data() {
    return {
      exerciseTypes: [],           // drop down ist of exercise types
      selectedExerciseType: '',    // Selected exercise type
      exercisesByType: [],         // Exercises of the selected type
      selectedExerciseId: '',      // Selected exercise ID
      selectedExerciseName: '',    // Selected exercise name
      selectedExerciseDescription: '', // Description of the selected exercise
      number_of_set: 1,
      selectedStatus: "Done",
      priority: 1,
      start_time: "",
      end_time: "",
      message: "",    // Store messages for user
      messageType: "",
      records: [],
    };
  },
  computed: {
    statusMapping() { // Map status from string to number
      return {
        Done: 1,
        "Half Finished": 2,
        Intended: 3,
        Abandoned: 4,
      };
    },
    statusReverseMapping() { // Map status from number to string
      return {
        1: "Done",
        2: "Half Finished",
        3: "Intended",
        4: "Abandoned",
      };
    },
  },
  methods: {
    async fetchExerciseTypes() {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/exercise/typelist');  // use typelist api to get each unique type
        this.exerciseTypes = response.data;
      } catch (error) {
        console.error('Error fetching exercise types:', error);
        this.message = "Error fetching exercise types.";
        this.messageType = "error";
      }
    },
    async onExerciseTypeChange() {
      this.selectedExerciseId = '';             // Reset selected exercise ID
      this.selectedExerciseName = '';           // Reset selected exercise name
      this.selectedExerciseDescription = '';    // Reset description
      if (this.selectedExerciseType) {
        try {
          const response = await axios.get('http://127.0.0.1:3001/api/exercise/type', {   // use type api to get details
            params: { type: this.selectedExerciseType },
          });
          this.exercisesByType = response.data;
        } catch (error) {
          console.error('Error fetching exercises by type:', error);
          this.message = "Error fetching exercises by type.";
          this.messageType = "error";
        }
      } else {
        this.exercisesByType = [];
      }
    },
    onExerciseNameChange() {
      const selectedExercise = this.exercisesByType.find(exercise => exercise.exercise_id === this.selectedExerciseId);
      if (selectedExercise) {
        this.selectedExerciseName = selectedExercise.name;
        this.selectedExerciseDescription = selectedExercise.description || '';
      } else {
        this.selectedExerciseName = '';
        this.selectedExerciseDescription = '';
      }
    },
    formatDateTime(date) {
      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);
      let hours = ('0' + date.getHours()).slice(-2);
      let minutes = ('0' + date.getMinutes()).slice(-2);
      let seconds = ('0' + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    submitRecord() {
      if (!this.selectedExerciseId) {
        this.message = "Please select an exercise.";
        this.messageType = "error";
        return;
      }

      // Parse and format start and end times
      const start = new Date(this.start_time);
      const end = new Date(this.end_time);
      const total_time = Math.floor((end - start) / 1000);

      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("Token missing, please login first.");
        this.message = "Token missing, please login first.";
        this.messageType = "error";
        return;
      }

      const formattedStartTime = this.formatDateTime(start);
      const formattedEndTime = this.formatDateTime(end);

      const recordData = {
        exercise_id: this.selectedExerciseId,
        description: this.selectedExerciseDescription,
        number_of_set: this.number_of_set,
        status: this.statusMapping[this.selectedStatus],
        priority: this.priority,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        total_time: total_time,
      };

      fetch(`http://127.0.0.1:3001/api/record?token=${token}`, {   // record api to post to backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.err || "Failed to submit record");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Record submitted successfully:", data);
          this.message = "Record submitted successfully!";
          this.messageType = "success";

          // Add the new record to the records array
          this.records.unshift({
            exercise_id: this.selectedExerciseId,
            exercise_name: this.selectedExerciseName,
            description: this.selectedExerciseDescription,
            number_of_set: this.number_of_set,
            status: this.statusMapping[this.selectedStatus],
            priority: this.priority,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            total_time: total_time,
          });

          this.resetForm(); // reset after submission a record
        })
        .catch((error) => {
          console.error("Error submitting record:", error);
          this.message = "Error submitting record: " + error.message;
          this.messageType = "error";
        });
    },
    resetForm() { // reset settings
      this.selectedExerciseType = '';
      this.exercisesByType = [];
      this.selectedExerciseId = '';
      this.selectedExerciseName = '';
      this.selectedExerciseDescription = '';
      this.number_of_set = 1;
      this.selectedStatus = "Done";
      this.priority = 1;
      this.start_time = "";
      this.end_time = "";
    },
    goToCurrentRecords() {
      this.$router.push('/current-records');
    },
  },
  watch: {
    selectedExerciseId() {
      this.onExerciseNameChange();
    },
  },
  created() {
    this.fetchExerciseTypes();
  },
};
</script>






<style scoped>
/* Import Google Fonts for a modern look */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

/* Apply base font family */
* {
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
}

/* Container styles */
.record-container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.record-container:hover {
  transform: translateY(-3px);
}

/* Title and Subtitle */
.title {
  text-align: center;
  color: #2c3e50;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
}

.subtitle {
  text-align: center;
  color: #34495e;
  font-size: 20px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

/* Message Styles */
.message {
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}
.success {
  background-color: #dff0d8;
  color: #3c763d;
}
.error {
  background-color: #f2dede;
  color: #a94442;
}

/* Form Group */
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
}

/* Input, Textarea, and Select */
.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  color: #34495e;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: #f8f9fa;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
  outline: none;
}

/* Submit Button Styles */
.save-button {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(24, 90, 157, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.save-button:hover {
  background: linear-gradient(135deg, #185a9d, #43cea2);
  box-shadow: 0 6px 16px rgba(24, 90, 157, 0.4);
  transform: translateY(-2px);
}

.save-button:active {
  background: linear-gradient(135deg, #0f4c75, #2cb47b);
  box-shadow: 0 2px 8px rgba(24, 90, 157, 0.3);
  transform: translateY(1px);
}


/* Records Section */
.records-list {
  margin-top: 20px;
}
.record-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.record-item:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
.record-item h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 18px;
  font-weight: 700;
}
.record-item p {
  margin: 5px 0;
  color: #555;
  font-size: 14px;
}

/* Empty State Message */
.no-records-message {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }
  .subtitle {
    font-size: 18px;
  }
  .input-field,
  .textarea-field,
  .select-field {
    padding: 10px;
    font-size: 14px;
  }
  .save-button {
    padding: 12px;
    font-size: 16px;
  }
}


/* current records page button */

.view-records-button {
  margin-top: 20px;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-records-button:hover {
  background: #218838;
}



</style>