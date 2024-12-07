<template>
  <div class="exercise-page">
    <h1>45° Side Bend</h1>
    <div class="exercise-content">
      <img src="@/assets/side-bend.png" alt="45° Side Bend" class="exercise-image" />
      <div class="exercise-info">
        <p>Exercises keep you strong. 45° side bend is one of the best exercises to target your abs. It will help you improve your mood and gain energy.</p>
        <ul>
          <li><strong>Targets:</strong> Waist</li>
          <li><strong>Abs:</strong> Abs</li>
          <li><strong>Equipment:</strong> Body Weight</li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script>  // exercise card 2: side bend, at welcome page. 
export default {
  name: 'ExerciseSideBend'
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
  