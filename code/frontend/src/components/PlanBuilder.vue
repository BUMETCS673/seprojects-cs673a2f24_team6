<template>
    <div>
      <h2>Build Your Fitness Plan</h2>
      <form @submit.prevent="submitPlan">
        <input v-model="planName" placeholder="Plan Name" />
        <textarea v-model="planDetails" placeholder="Plan Details"></textarea>
        <button type="submit">Save Plan</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        planName: '',
        planDetails: ''
      };
    },
    methods: {
      async submitPlan() {
        console.log(`Plan Name: ${this.planName}, Details: ${this.planDetails}`);   //// can have axios related calls, liu yi xia
      }
    }
  };
  </script>
  