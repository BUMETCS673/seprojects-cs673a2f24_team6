<template>
    <div class="current-plans-page">
      <h2>Your Current Plans</h2>
      <div v-if="plans && plans.length > 0">
        <ul>
          <li v-for="plan in plans" :key="plan.plan_id" class="plan-item">
            <strong>{{ plan.title }}</strong> - {{ plan.description }}
            <br />
            Status: {{ plan.status == 1 ? "Active" : "Inactive" }}
            <br />
            Frequency Type: {{ plan.frequency_type }}
            <br />
            Days of Month: {{ plan.days_of_month || "N/A" }}
            <br />
            Days of Week: {{ plan.days_of_week || "N/A" }}
            <br />
            Custom Day: {{ plan.custom_day || "N/A" }}
            <br />
            Time of Day: {{ plan.time_of_day || "N/A" }}
            <br />
            Priority: {{ plan.priority || "N/A" }}
            <br />
            Reminder Enabled: {{ plan.reminder_enabled == 1 ? "Yes" : "No" }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>You have no current plans.</p>
      </div>
      <!-- Add Back Button -->
      <button @click="goBack" class="back-button">Back to Plan Creation</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        plans: [],
      };
    },
    methods: {
      async fetchPlans() {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('User is not logged in.');
          return;
        }
  
        try {
          const response = await fetch(`http://127.0.0.1:3001/api/plan?token=${token}`, {
            method: 'GET',
          });
          const result = await response.json();
          console.log('fetchPlans result:', result);
          console.log('response ok:', response.ok); 
          console.log('response status:', response.status);
  
          if (response.ok) {
            this.plans = result.rows;
            console.log('Assigned plans:', this.plans);
          } else {
            alert(result.err || 'Failed to fetch plans');
            this.plans = [];
          }
        } catch (error) {
          console.error('Error occurred while fetching plans', error);
          alert('Error occurred while fetching plans');
        }
      },

      goBack() {
        this.$router.push('/plan');
      },
    },
    mounted() {
      this.fetchPlans();
    },
  };
  </script>
  

  
  <style>
  .current-plans-page {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  .plan-item {
    background: #f1f1f1;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 5px;
  }
  
  .back-button {
    margin-top: 20px;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .back-button:hover {
    background: #0056b3;
  }
  </style>
  