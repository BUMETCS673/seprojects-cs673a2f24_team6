import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import WelcomePage from '../views/WelcomePage.vue';
import RecordPage from '../views/RecordPage.vue';
import PlanPage from '../views/PlanPage.vue';
import ExerciseSideBend from '../views/ExerciseSideBend.vue';
import ExercisePushUp from '../views/ExercisePushUp.vue';
import RegistrationPage from '../views/RegistrationPage.vue'; 
import UserProfile from '../views/UserProfile.vue';
import ProfileCard from '../views/ProfileCard.vue';
import CalendarComponent from '../views/CalendarComponent.vue';

const isAuthenticated = () => {
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
  { path: '/register', name: 'Register', component: RegistrationPage },
  { path: '/userprofile', name: 'UserProfile', component: UserProfile}, 
  { path: '/calendar', name: 'Calendar', component: CalendarComponent}, 
  { path: '/profile-card', name: 'ProfileCard', component: ProfileCard, beforeEnter: (to, from, next) => {
    if (!isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  }
}




];





const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
