<template>
    <div>
      <h2>Record Training</h2>
      <form @submit.prevent="recordTraining">
        <input v-model="training" placeholder="Training Description" />
        <input v-model="duration" placeholder="Duration (mins)" />
        <button type="submit">Record</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        training: '',
        duration: ''
      };
    },
    methods: {
      async recordTraining() {
        console.log(`Training: ${this.training}, Duration: ${this.duration}`);   /// tong axios possible
      }
    }
  };
  </script>
  