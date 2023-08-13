import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Home = () => import('../views/Home.vue');
const About = () => import('../views/About.vue');
const Meeting = () => import('../views/Meeting.vue');
const MeetingDetails = () => import('../views/MeetingDetails.vue');
const AccountSettings = () => import('../views/AccountSettings.vue');
const SignInPage = () => import('../views/SignInPage.vue');
const SignUpPage = () => import('../views/SignUpPage.vue');
const AdminCalendar = () => import('../views/AdminCalendar.vue');
const LongWigsCategory = () => import('../views/LongWigsCategory.vue');
const MediumWigsCategory = () => import('../views/MediumWigsCategory.vue');
const ShortWigsCategory = () => import('../views/ShortWigsCategory.vue');



import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      {
        path: '/meeting',
        name: 'Meeting',
        component: Meeting,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      { 
        path: '/meetingDetails',
        name: 'MeetingDetails',
        component: MeetingDetails,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      { 
        path: '/catalog/long-wigs',
        name: 'Long-wigs',
        component: LongWigsCategory,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      { 
        path: '/catalog/middle-wigs',
        name: 'Middle-wigs',
        component: MediumWigsCategory,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      { 
        path: '/catalog/short-wigs',
        name: 'Short-wigs',
        component: ShortWigsCategory,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      { 
        path: '/accountSettings',
        name: 'AccountSettings',
        component: AccountSettings,
        meta: {
          requiresAuth: true,
          requiresAdmin: false,
        },
      },
      { 
        path: '/signin',
        name: 'SignIn',
        component: SignInPage,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      { 
        path: '/signup',
        name: 'SignUp',
        component: SignUpPage,
        meta: {
          requiresAuth: false,
          requiresAdmin: false,
        },
      },
      {
        path: '/admin/calendar',
        name: 'AdminCalendar',
        component: AdminCalendar,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
]


const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        user?.displayName
        removeListener();
        resolve(user);
      },
      
      reject)
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {    
    const user: any = await getCurrentUser();
    if (user) {
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, where('email', '==', user.email));
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.forEach((doc) => {
            if (doc.data().isAdmin === true) {
              next();
            } else {
              alert('You must be an admin to access this route.');
              next('/');
            }
        });
      } else {
        next();
      }
    } else {
      alert("You don't have access. Please sign in.");
      next('/');
    }
  } else {
    next();
  }
});

export default router
