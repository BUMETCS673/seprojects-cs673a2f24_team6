import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import WelcomePage from '../views/WelcomePage.vue';
import RecordPage from '../views/RecordPage.vue';
import PlanPage from '../views/PlanPage.vue';
import ExerciseSideBend from '../views/ExerciseSideBend.vue';
import ExercisePushUp from '../views/ExercisePushUp.vue';

const isAuthenticated = () => {
  // Simple check: Use local storage or state to check if logged in
  return localStorage.getItem('loggedIn') === 'true'; 
};

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/record',
    name: 'Record',
    component: RecordPage,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/plan',
    name: 'Plan',
    component: PlanPage,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/');
      } else {
        next();
      }
    }
  },

  { path: '/exercise/side-bend', name: 'SideBend', component: ExerciseSideBend}, 
  { path: '/exercise/push-up', name: 'PushUp', component: ExercisePushUp},



];





const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
