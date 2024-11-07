<template>
  <div class="record-container">
    <h1 class="title">Record Exercise</h1>

    <!-- show visible messages -->
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>

    <!-- item1: name of exercise -->
    <div class="form-group">
      <label for="exercise_name">Exercise Name:</label>
      <input type="text" v-model="exercise_name" id="exercise_name" class="input-field" />
    </div>

    <!-- item2: description of exercise -->
    <div class="form-group">
      <label for="description">Description:</label>
      <textarea v-model="description" id="description" class="textarea-field"></textarea>
    </div>

    <!-- item3: num of sets -->
    <div class="form-group">
      <label for="number_of_set">Number of Sets:</label>
      <input type="number" v-model="number_of_set" id="number_of_set" class="input-field" />
    </div>

    <!-- item4: status, which will be turned into numeric and store in backend -->
    <div class="form-group">
      <label for="status">Status:</label>
      <select v-model="selectedStatus" id="status" class="select-field">
        <option value="Done">Done</option>
        <option value="Half Finished">Half Finished</option>
        <option value="Intended">Intended</option>
        <option value="Abandoned">Abandoned</option>
      </select>
    </div>

    <!-- item5: priority(1-10) -->
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

    <!-- item6: start time -->
    <div class="form-group">
      <label for="start_time">Start Time:</label>
      <input type="datetime-local" v-model="start_time" id="start_time" class="input-field" />
    </div>

    <!-- item7: end time, calculate total time in backend -->
    <div class="form-group">
      <label for="end_time">End Time:</label>
      <input type="datetime-local" v-model="end_time" id="end_time" class="input-field" />
    </div>

    <button @click="submitRecord" class="save-button">Submit</button>


        <!-- Submitted Records Display -->
    <h2 class="subtitle">Submitted Records</h2>
    <div v-if="records && records.length > 0" class="records-list">
      <div v-for="(record, index) in records" :key="index" class="record-item">
        <h3>{{ record.exercise_name }}</h3>
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


     <!-- more todos -->


  </div>
</template>

<script>
export default {
  data() {
    return {
      exercise_name: "",
      description: "",
      number_of_set: 1,
      selectedStatus: "Done",
      priority: 1,
      start_time: "",
      end_time: "",
      message: "",        // store messages for user
      messageType: "",
      records: [],
    };
  },
  computed: {
    statusMapping() {   // str -> num
      return {
        Done: 1,
        "Half Finished": 2,
        Intended: 3,
        Abandoned: 4,
      };
    },
    statusReverseMapping() {
      return {
        1: "Done", 
        2: "Half Finished", 
        3: "Intended", 
        4: "Abandoned",
      };
    },

  },
  methods: {
    submitRecord() {
      const start = new Date(this.start_time);
      const end = new Date(this.end_time);
      const total_time = Math.floor((end - start) / 1000);

      const token = localStorage.getItem("token");           // get token
      if (!token) {
        console.error("Token missing, please login first.");
        this.message = "Token missing, please login first.";
        this.messageType = "error";
        return;
      }

      const recordData = {    // all data items to deliver to database
        token: token,
        exercise_name: this.exercise_name,
        description: this.description,
        number_of_set: this.number_of_set,
        status: this.statusMapping[this.selectedStatus],
        priority: this.priority,
        start_time: this.start_time,
        end_time: this.end_time,
        total_time: total_time,
      };

      fetch("http://127.0.0.1:3001/api/record", {    // record api
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit record");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Record submitted successfully:", data);
          this.message = "Record submitted successfully!";
          this.messageType = "success"

          this.records.unshift( {
            exercise_name: this.exercise_name, 
            description: this.description, 
            number_of_set: this.number_of_set,
            status: this.statusMapping[this.selectedStatus], 
            priority: this.priority, 
            start_time: this.start_time, 
            end_time: this.end_time, 
            total_time: total_time,
          }); 

          this.resetForm();               // reset to start status after submit one


        })
        .catch((error) => {
          console.error("Error submitting record:", error);
          this.message = "Error submitting record: " + error.message;
          this.messageType = "error";
        });
    },
    resetForm() {   // reset related
      this.exercise_name = "";
      this.description = "";
      this.number_of_set = 1;
      this.selectedStatus = "Done";
      this.priority = 1;
      this.start_time = "";
      this.end_time = "";
    },
  },
};
</script>

<style scoped>
/* Container styles */
.record-container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

/* Message styles */
.message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Flex container */
.content-wrapper {
  display: flex;
  gap: 20px;
}

/* Left Side: Form */
.form-section {
  flex: 1;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc; /* Changed border color */
  border-radius: 5px;
  box-sizing: border-box;
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  border-color: #4caf50; /* Green border on focus */
  outline: none;
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
}

.save-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #45a049;
}

/* Right Side: Records */
.records-section {
  flex: 1;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 100px); /* Adjust as needed */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subtitle {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.records-list {
  margin-top: 20px;
}

.record-item {
  background-color: #fff;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  transition: box-shadow 0.3s;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.record-item h3 {
  margin-top: 0;
  color: #333;
}

.record-item p {
  margin: 5px 0;
  color: #555;
}

/* Media Queries for Responsiveness */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .form-section,
  .records-section {
    max-width: 600px;
    margin: 0 auto;
  }

  .records-section {
    margin-top: 30px;
    max-height: none;
  }
}
</style>
