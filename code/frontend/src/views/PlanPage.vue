<template>
  <div>
    <h2>Create a Fitness Plan</h2>
    <form @submit.prevent="savePlan">
      <label for="plan-name">Plan Name:</label>
      <input id="plan-name" v-model="planName" placeholder="Enter your plan name" />
      
      <label for="plan-details">Plan Details:</label>
      <textarea id="plan-details" v-model="planDetails" placeholder="Enter the details of your plan"></textarea>
      
      <button type="submit">Save Plan</button>
    </form>

    <div v-if="plans.length">
      <h3>Your Saved Plans:</h3>
      <ul>
        <li v-for="(plan, index) in plans" :key="index" class="plan-entry">
          <h4>Plan {{ index + 1 }}</h4>
          <p><strong>Plan Name:</strong> {{ plan.name }}</p>
          <p><strong>Plan Details:</strong> {{ plan.details }}</p>
          <button @click="deletePlan(index)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const planName = ref('');
    const planDetails = ref('');
    const plans = ref([]);

    const savePlan = () => {
      // save plan
      plans.value.push({
        name: planName.value,
        details: planDetails.value
      });

      // reset to blank input after saving
      planName.value = '';
      planDetails.value = '';
    };

    const deletePlan = (index) => {
      plans.value.splice(index, 1);  // delete a planaaaaaaaaaaaaaaaaaaaaaaaaa
    };

    return {
      planName,
      planDetails,
      plans,
      savePlan,
      deletePlan
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
input, textarea {
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
.plan-entry {
  background-color: #f1f1f1;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}
.plan-entry h4 {
  margin-bottom: 10px;
}
.plan-entry button {
  background-color: #f44336;
}
.plan-entry button:hover {
  background-color: #d32f2f;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
