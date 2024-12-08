<template>
  <div class="current-records-container">
    <h1 class="title">Your Exercise Records</h1>
  
    <!-- Display messages -->
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>
  
    <div v-if="records && records.length > 0" class="records-list">
      <div v-for="(record) in records" :key="record.record_id" class="record-item">
        <h3>Exercise ID: {{ record.exercise_id }}</h3>
        <p><strong>Description:</strong> {{ record.description }}</p>
        <p><strong>Number of Sets:</strong> {{ record.number_of_set }}</p>
        <p><strong>Status:</strong> {{ statusReverseMapping[record.status] }}</p>
        <p><strong>Priority:</strong> {{ record.priority }}</p>
        <p><strong>Start Time:</strong> {{ record.start_time }}</p>
        <p><strong>End Time:</strong> {{ record.end_time }}</p>
        <p><strong>Total Time:</strong> {{ record.total_time }} seconds</p>
  
        <!-- Delete Button -->
        <button @click="deleteRecord(record.record_id)" class="delete-button">Delete</button>
      </div>
    </div>
    <div v-else>
      <p>You have no exercise records.</p>
    </div>
  
    <!-- Back to Record Page Button -->
    <button @click="goToRecordPage" class="back-button">Back to Record Page</button>
  </div>
</template>



<script>
export default {
  name: 'CurrentRecords',
  data() {
    return {
      records: [],
      message: '',
      messageType: '',
    };
  },
  computed: {
    statusReverseMapping() {
      return {
        1: 'Done',
        2: 'Half Finished',
        3: 'Intended',
        4: 'Abandoned',
      };
    },
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    fetchRecords() {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (!token) {
        this.message = 'Token missing, please login first.';
        this.messageType = 'error';
        return;
      }

      fetch(`http://127.0.0.1:3001/api/record?token=${token}`, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.err || 'Failed to fetch records');
            });
          }
          return response.json();
        })
        .then((data) => {
          this.records = data.rows || data; // Adjust based on your API response format
        })
        .catch((error) => {
          console.error('Error fetching records:', error);
          this.message = 'Error fetching records: ' + error.message;
          this.messageType = 'error';
        });
    },
    deleteRecord(record_id) {
      if (!confirm('Are you sure you want to delete this record?')) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        this.message = 'Token missing, please login first.';
        this.messageType = 'error';
        return;
      }

      fetch(`http://127.0.0.1:3001/api/record?token=${token}&record_id=${record_id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.err || 'Failed to delete record');
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log('Record deleted successfully:', data);
          this.message = 'Record deleted successfully!';
          this.messageType = 'success';
          // Remove the deleted record from the records array
          this.records = this.records.filter((record) => record.record_id !== record_id);
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
          this.message = 'Error deleting record: ' + error.message;
          this.messageType = 'error';
        });
    },
    goToRecordPage() {
      this.$router.push('/record');
    },
  },
};
</script>



<style scoped>
.current-records-container {
  padding: 20px;
}
  
.title {
  text-align: center;
  margin-bottom: 20px;
}
  
.message {
  margin-bottom: 20px;
}
  
.message.success {
  color: green;
}
  
.message.error {
  color: red;
}

.records-list {
  display: flex;
  flex-direction: column;
}
  
.record-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
}
  
.record-item h3 {
  margin-top: 0;
}
  
.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
  
.delete-button:hover {
  background-color: #c0392b;
}
  
.back-button {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
  
.back-button:hover {
  background-color: #2980b9;
}
</style>
  
  