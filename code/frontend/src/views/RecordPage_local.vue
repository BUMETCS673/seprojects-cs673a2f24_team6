<template>
  <div class="record-page">
    <h1>Record Exercise</h1>

    <!-- Exercise Name Input -->
    <label for="exercise_name">Exercise Name:</label>
    <input type="text" v-model="exercise_name" id="exercise_name" class="input-field" />

    <!-- Description Input -->
    <label for="description">Description:</label>
    <textarea v-model="description" id="description" class="input-field"></textarea>

    <!-- Number of Sets Input -->
    <label for="number_of_set">Number of Sets:</label>
    <input type="number" v-model="number_of_set" id="number_of_set" class="input-field" />

    <!-- Status Selection -->
    <label for="status">Status:</label>
    <select v-model="selectedStatus" id="status" class="input-field">
      <option value="Done">Done</option>
      <option value="Half Finished">Half Finished</option>
      <option value="Intended">Intended</option>
      <option value="Abandoned">Abandoned</option>
    </select>

    <!-- Priority Input -->
    <label for="priority">Priority:</label>
    <input type="number" v-model="priority" id="priority" min="1" max="10" class="input-field" />

    <!-- Start and End Time Inputs -->
    <label for="start_time">Start Time:</label>
    <input type="datetime-local" v-model="start_time" id="start_time" class="input-field" />

    <label for="end_time">End Time:</label>
    <input type="datetime-local" v-model="end_time" id="end_time" class="input-field" />

    <!-- Submit Button -->
    <button @click="addRecord" class="submit-button">Add Record</button>

    <!-- Displaying Records -->
    <h2>Saved Records</h2>
    <div v-if="records.length > 0" class="records-list">
      <div v-for="(record, index) in records" :key="index" class="record-card">
        <h3>{{ record.exercise_name }}</h3>
        <p><strong>Description:</strong> {{ record.description }}</p>
        <p><strong>Sets:</strong> {{ record.number_of_set }}</p>
        <p><strong>Status:</strong> {{ record.status }}</p>
        <p><strong>Priority:</strong> {{ record.priority }}</p>
        <p><strong>Start Time:</strong> {{ record.start_time }}</p>
        <p><strong>End Time:</strong> {{ record.end_time }}</p>
        <p><strong>Total Time:</strong> {{ record.total_time }} seconds</p>
      </div>
    </div>
    <p v-else>No records saved yet.</p>
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
      records: [],
    };
  },
  computed: {
    statusMapping() {
      return {
        Done: "Completed",
        "Half Finished": "Partially Done",
        Intended: "Planned",
        Abandoned: "Not Completed",
      };
    },
  },
  methods: {
    addRecord() {
      const start = new Date(this.start_time);
      const end = new Date(this.end_time);
      const total_time = Math.floor((end - start) / 1000);

      const newRecord = {
        exercise_name: this.exercise_name,
        description: this.description,
        number_of_set: this.number_of_set,
        status: this.statusMapping[this.selectedStatus],
        priority: this.priority,
        start_time: this.start_time,
        end_time: this.end_time,
        total_time: total_time,
      };

      this.records.push(newRecord);
      
      // Clear form inputs after adding record
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
.record-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  text-align: center;
}

label {
  font-weight: bold;
  margin-top: 10px;
  display: block;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

.records-list {
  margin-top: 20px;
}

.record-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-card h3 {
  color: #333;
  margin-bottom: 5px;
}

.record-card p {
  margin: 5px 0;
  color: #555;
}
</style>
