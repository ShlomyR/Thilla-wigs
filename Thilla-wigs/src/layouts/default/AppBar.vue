<template>
  <v-app-bar :elevation="24" app>
    <v-divider vertical class="px-1"></v-divider>
    <v-row>
      <v-col cols="3">
        <v-app-bar-title>
          <a>
            <v-img src="https://tehila-wigs.co.il/wp-content/uploads/2022/06/TEHILA-LOGO-B-300-×-150-px.png.webp"
              max-width="250px" max-height="95px'" />
          </a>
        </v-app-bar-title>
      </v-col>
    </v-row>
    <v-img v-if="isMobile" src="https://tehila-wigs.co.il/wp-content/uploads/2022/06/TEHILA-LOGO-B-300-×-150-px.png.webp"
      width="70px" height="105px" />
    <ul class="navigation">
      <v-divider v-if="!isMobile" vertical></v-divider>
      <li><router-link v-if="!isMobile" :style="{ color: sticky ? 'white' : 'black' }" class="px-3 link"
          to="/">Home</router-link></li>
      <v-divider v-if="!isMobile" vertical></v-divider>
      <li><router-link v-if="!isMobile" :style="{ color: sticky ? 'white' : 'black' }" class="px-3 link"
          to="/about">About</router-link></li>
      <v-divider v-if="!isMobile" vertical></v-divider>
    </ul>
    <template v-slot:append>
      <v-btn v-if="!isMobile" icon="mdi-whatsapp" href="https://api.whatsapp.com/send?phone=972552273020"></v-btn>
      <v-btn v-if="!isMobile" icon="mdi-instagram" href="https://www.instagram.com/tehila_wigs/"></v-btn>
      <v-btn v-if="!isMobile" icon="mdi-facebook" href="https://www.facebook.com/TehilaWigs/"></v-btn>
      <v-btn to="/signin" v-if="isLoggedIn">{{ message }}</v-btn>
      <SignOut text="sign out" />
      <v-switch v-model="sticky" hide-details color="secondary" inset @click="toggleTheme"
        :prepend-icon="'mdi-theme-light-dark'"></v-switch>
    </template>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
  <v-navigation-drawer  theme="system" temporary v-model="drawer" app>
    <v-list>
      <!-- <v-avatar v-if="isLoggedIn" color="grey">
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar> -->
      <v-list-item 
        
        :prepend-avatar="userProfilePhoto"
        :title="appointmentDetails.name" 
        :subtitle="appointmentDetails.email">
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <router-link :style="{ color: sticky ? 'white' : 'black' }" v-for="(route, index) in routes" :key="index" :to="route.path" class="link">
        <v-list-item class="active-link" :prepend-icon="route.icon" :value="route.value">
          {{ route.name }}
        </v-list-item>
      </router-link>
    </v-list>
    <v-list v-if="userIsAdmin" density="compact" nav>
      <router-link :style="{ color: sticky ? 'white' : 'black' }" to="/admin/calendar" class="link">
        <v-list-item class="active-link" prepend-icon="mdi-account-multiple" value="5">
          See Scheduled Meetings
        </v-list-item>
      </router-link>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="black"  v-if="isLoggedIn" to="/signin" block>
          {{ message }}
        </v-btn>
        <SignOut text="sign out" block />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import { ref, Ref, onMounted } from 'vue';
import { useTheme } from 'vuetify'
import SignOut from '@/components/SignOutPageWorld.vue'

import { useAuth } from '@/components/useAuth';
import { db } from '@/firebase'

const { sticky, isMobile, appointmentDetails } = useAuth();
const drawer: Ref<boolean> = ref(false);
const theme = useTheme();
const isLoggedIn = ref<boolean>(true);
const message = ref<string>("Sign in");
let auth: any;
let userIsAdmin = false;

const routes = [
  { name: 'Home', path: '/', value: '1', icon: 'mdi-home' },
  { name: 'About', path: '/about', value: '2', icon: 'mdi-information-outline' },
  { name: 'Meeting Details', path: '/meetingDetails', value: '3', icon: 'mdi-calendar-month' },
  { name: 'Account Settings', path: '/accountSettings', value: '4', icon: 'mdi-account' },
];

let userProfilePhoto = '';

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = false;
      checkAdmin();
    } else {
      isLoggedIn.value = true;
      userIsAdmin = false;
      userProfilePhoto = 'https://graph.facebook.com/2239543659589371/picture';
      appointmentDetails.value.name = '';
      appointmentDetails.value.email = '';
    }
  });
  // Check the window width when the component is mounted
  checkIsMobile();
  // Attach a resize event listener to detect changes in screen size
  window.addEventListener('resize', checkIsMobile);
});

const checkIsMobile = () => {
  // Update the isMobile variable based on the screen width
  isMobile.value = window.innerWidth <= 450; // Adjust the breakpoint as needed
};

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

const checkAdmin = async () => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      const userInfoGoogle = user.providerData.find((provider) => provider.providerId === 'google.com');
      const userInfoTwitter = user.providerData.find((provider) => provider.providerId === 'twitter.com');
      const userInfoFacebook = user.providerData.find((provider) => provider.providerId === 'facebook.com');
      if (userInfoGoogle && userInfoGoogle.photoURL) {
        userProfilePhoto = userInfoGoogle.photoURL;
      } else if (userInfoTwitter && userInfoTwitter.photoURL) {
        userProfilePhoto = userInfoTwitter.photoURL;
      } else if (userInfoFacebook && userInfoFacebook.photoURL) {
        userProfilePhoto = userInfoFacebook.photoURL;
      }
      const appointmentsRef = collection(db, 'users');
      const appointmentsSnapshot = await getDocs(appointmentsRef);
      appointmentsSnapshot.docs.forEach((doc) => {
          if (doc.data().email === user.email) {
            appointmentDetails.value.name = doc.data().name;
            appointmentDetails.value.email = doc.data().email;
            if (doc.data().isAdmin === true) {
              userIsAdmin = true;
            }
          }
      });
      
      
    //   const usersRef = collection(db, 'users');
    //   const usersQuery = query(usersRef, where('email', '==', getAuth().currentUser?.email));
    //   const usersSnapshot = await getDocs(usersQuery);
    //   usersSnapshot.forEach((doc) => {
    //     if (doc.data().isAdmin === true) {
    //       userIsAdmin = true; // If user is an admin, set userIsAdmin to true.
    //     }
    //   });
    }
  } catch (error) {
    console.error('Error connecting to firebase:', error);
  }
};


</script>

<style>
ul,
.link {
  font-weight: 500;
  list-style: none;
  text-decoration: none;
}

li {
  text-transform: uppercase;
  padding: 16px;
  /* margin-left: 16px; */
}

.link {
  font-size: 14px;
  transition: .5 ease all;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
}

.link:hover {
  color: #00afea;
  border-color: #00afea;
}

.navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.branding {
  display: flex;
  align-items: center;
}

.branding:img {
  width: 50px;
  transition: .5 ease all;
}

.custom-drawer {
  display: flex;
  align-items: center;
  height: 200px;
  /* Set a fixed height for the drawer */
  position: absolute;
  top: 64px;
  /* Adjust the top value based on the app bar height */
  left: 0;
  right: 0;
  z-index: 9999;
  /* Make sure the drawer appears above the iframe */
}

.test {
  border-right: 4px solid #3cd1c2;
}

.active-link {
  border-right: 4px solid #ff0000; /* Add a border to the active item */
}
</style>