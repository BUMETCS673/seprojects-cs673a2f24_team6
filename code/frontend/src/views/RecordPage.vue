<template>
  <div>
    <h2>Record Your Training</h2>
    <form @submit.prevent="recordTraining">
      <label for="exercise-name">Exercise Name:</label>
      <input id="exercise-name" v-model="exerciseName" placeholder="Enter exercise name" />

      <label for="duration">Duration (minutes):</label>
      <input id="duration" type="number" v-model="duration" placeholder="Enter duration" />

      <button type="submit">Record</button>
    </form>

    <div v-if="trainingRecords.length">
      <h3>Your Training Records:</h3>
      <ul>
        <li v-for="(record, index) in trainingRecords" :key="index" class="record-entry">
          <h4>Record {{ index + 1 }}</h4>
          <p><strong>Exercise:</strong> {{ record.exerciseName }}</p>
          <p><strong>Duration:</strong> {{ record.duration }} minutes</p>
          <button @click="deleteRecord(index)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const exerciseName = ref('');
    const duration = ref('');
    const trainingRecords = ref([]);

    const recordTraining = () => {
      /// add record
      trainingRecords.value.push({
        exerciseName: exerciseName.value,
        duration: duration.value
      });

      /// reset
      exerciseName.value = '';
      duration.value = '';
    };

    const deleteRecord = (index) => {
      trainingRecords.value.splice(index, 1); /// remove
    };

    return {
      exerciseName,
      duration,
      trainingRecords,
      recordTraining,
      deleteRecord
    };
  }
};
</script>

<style scoped>
h2 {
  color: #4CAF50;
}
form {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
.record-entry {
  background-color: #f1f1f1;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}
.record-entry h4 {
  margin-bottom: 10px;
}
.record-entry button {
  background-color: #f44336;
}
.record-entry button:hover {
  background-color: #d32f2f;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
