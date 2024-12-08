<template>
  <div class="exercise-page">
    <h1>Push Up</h1>
    <div class="exercise-content">
      <img src="@/assets/push-up.png" alt="Push Up" class="exercise-image" />
      <div class="exercise-info">
        <p>Push ups are a basic but highly effective exercise to build strength and endurance. They target your chest, arms, and core.</p>
        <ul>
          <li><strong>Targets:</strong> Chest</li>
          <li><strong>Abs:</strong> Core</li>
          <li><strong>Equipment:</strong> Body Weight</li>
        </ul>
      </div>
    </div>
  </div>
</template>
  


<script>  // exercise card 1: push up, at welcome page. 
export default {
  name: 'ExercisePushUp'
};
</script>
  
<style scoped>
.exercise-page {
  padding: 50px;
  text-align: center;
}
  
h1 {
  color: #4CAF50;
}
  
.exercise-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
  
.exercise-image {
  max-width: 400px;
  margin-right: 40px;
}
  
.exercise-info {
  max-width: 400px;
  text-align: left;
}
  
ul {
  list-style-type: none;
  padding-left: 0;
}
  
ul li {
  margin-bottom: 10px;
}
  
ul li::before {
  content: '✔';
  margin-right: 10px;
  color: #4CAF50;
}
</style>
  