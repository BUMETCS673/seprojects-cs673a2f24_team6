<template>
  <div class="plan-page">
    <h2>Create a Fitness Plan</h2>

      <button @click.prevent="gotoCurrentPlans" class="current-plans-button">Current Plans</button>

    <form @submit.prevent="savePlan" class="plan-form">
      <label for="exercise-id">Exercise ID:</label>
      <input id="exercise-id" type="number" v-model="plan.exercise_id" required />

      <label for="title">Title:</label>
      <input id="title" v-model="plan.title" placeholder="Enter plan title" required />

      <label for="description">Description:</label>
      <textarea id="description" v-model="plan.description" placeholder="Enter plan description" required></textarea>

      <label>Status:</label>
      <select v-model="plan.status" required>
        <option :value="1">Active</option>
        <option :value="2">Inactive</option>
      </select>


      <!-- all options are here to add -->
      <label for="frequency-type">Frequency Type:</label>
      <select id="frequency-type" v-model="plan.frequency_type">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="custom">Custom</option>
      </select>

      <label for="days-of-month">Days of Month:</label>
      <input id="days-of-month" type="number" v-model="plan.days_of_month" placeholder="1-31" />

      <label for="days-of-week">Days of Week:</label>
      <input id="days-of-week" v-model="plan.days_of_week" placeholder="e.g., monday,tuesday" />

      <label for="custom-day">Custom Day:</label>
      <input id="custom-day" type="date" v-model="plan.custom_day" />

      <label for="time-of-day">Time of Day:</label>
      <input id="time-of-day" type="time" v-model="plan.time_of_day" />

      <label for="priority">Priority:</label>
      <input id="priority" type="number" v-model="plan.priority" placeholder="1-10" />

      <label for="reminder-enabled">Enable Reminder:</label>
      <select v-model="plan.reminder_enabled">
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>

      <button type="submit">Save Plan</button>

    </form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      plan: {
        exercise_id: null,
        title: '',
        description: '',
        frequency_type: 'daily',
        days_of_month: null,
        days_of_week: '',
        custom_day: '',
        time_of_day: '',
        priority: null,
        status: 1,
        reminder_enabled: 0,
      },
      plans: [], 
    };
  },
  methods: {
    async savePlan() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not logged in.');
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/plan?token=${token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.plan),
          }
        );
        const result = await response.json();
        if (response.ok) {
          alert('Plan uploaded successfully');
          this.fetchPlans();
        } else {
          alert(result.err || 'Plan upload failed');
        }
      } catch (error) {
        alert('Error occurred while saving the plan');
      }
    },
    gotoCurrentPlans() {
      this.$router.push('/current-plans');
    },



    // get try, has been transferred to current plans page, ignore this. 
    async fetchPlans() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not logged in.');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:3001/api/plan?token=${token}`, {
          method: 'GET',
        });
        const result = await response.json();
        console.log('fetchPlans result:', result);  // debug
        if (response.ok) {
          this.plans = result;
          console.log('assigned plans:', this.plans);
        } else {
          alert(result.err || 'Failed to fetch plans');
        }
      } catch (error) {
        alert('Error occurred while fetching plans');
      }
    },



  },
};
</script>

<style>
.plan-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.plan-form label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

.plan-form input,
.plan-form textarea,
.plan-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.plan-form button {
  display: block;
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.plan-form button:hover {
  background: #0056b3;
}

.current-plans-button {
  margin-top: 20px;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.current-plans-button:hover {
  background: #218838;
}


</style>
