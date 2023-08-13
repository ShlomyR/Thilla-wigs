<template>
    <v-row no-gutters>
      <v-col cols=" 12" class="h-100">
        <v-sheet min-width="50vh" justify="center" align="center" color="grey-lighten-5" height="93vh">
          <v-row no-gutters justify="center" align="center">
            <v-col cols="8">
              <v-card max-height="700px" class="mt-5" color="grey-lighten-3" dark>
                <v-card class="text-h4 text-center pa-5" color="blue" dark>
                  welcome
                </v-card>
                <v-card-text class="mt-5">
                  <v-snackbar v-model="snackbar1" absolute top right color="success">
                    <span>Registration successful!</span>
                    <v-icon dark class="ma-2"> mdi-checkbox-marked-circle </v-icon>
                  </v-snackbar>
                  <v-snackbar v-model="snackbar2" absolute top right color="error">
                    <span> Registration failed!</span>
                    <v-icon light class="ma-2"> mdi-alpha-x-circle-outline </v-icon>
                  </v-snackbar>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row justify="center">
                      <v-col cols="9">
                        <v-text-field
                          v-model="userName"
                          :readonly="loading"
                          :rules="nameRules"
                          label="User name"
                          variant="outlined"
                          required
                        />
                      </v-col>
                      <v-col cols="9">
                        <v-text-field
                          v-model="userEmail"
                          :readonly="loading"
                          :rules="emailRules"
                          label="User email"
                          variant="outlined"
                          required
                        />
                      </v-col>
                      <v-col cols="9">
                        <v-text-field
                          v-model="password"
                          :readonly="loading"
                          :rules="passwordRules"
                          :append-inner-icon="eyeVisible ? 'mdi-eye-off' : 'mdi-eye'"
                          :type="eyeVisible ? 'text' : 'password'"
                          label="Enter your password"
                          variant="outlined"
                          @click:append-inner="eyeVisible = !eyeVisible"
                          required
                        />
                      </v-col>
                      <v-col cols="9">
                        <v-row no-gutters justify="space-between">
                          <v-col cols="5">
                            <v-btn
                              block
                              :disabled="!valid"
                              color="green-lighten-3"
                              @click="register()"
                            >
                              Register
                            </v-btn>
                          </v-col>
                          <v-col cols="5">
                            <v-btn
                              block
                              :disabled="valid"
                              color="green-lighten-3"
                              to="/signin"
                            >
                              go back
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-12">
                      <v-col cols="4" class="text-end">
                        <v-btn
                          icon="mdi-twitter"
                          color="blue-lighten-3"
                          variant="text"
                          @click="signInWithTwitter()"
                        />
                      </v-col>
                      <v-col cols="4" class="text-center">
                        <v-btn
                          icon="mdi-google-plus"
                          color="black"
                          variant="text"
                          @click="signInWithGoogle()"
                        />
                      </v-col>
                      <v-col cols="4" class="text-start">
                        <v-btn
                          icon="mdi-facebook"
                          color="blue-darken-3"
                          variant="text"
                          @click="signInWithFacebook()"
                        />
                      </v-col>
                      <v-col cols="3">
                        <v-btn
                           
                          class="mt-5"
                          color="green-lighten-1"
                          @click="resetForm()"
                        >
                          Cancel
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
</template>

<script lang="ts" setup>
  import {  ref } from "vue";
  import { useRouter } from "vue-router";

  import {
    getAuth,
    updateProfile,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
  } from "firebase/auth";

  import {
    collection,
    getDocs,
    query,
    where,
    addDoc
  } from "firebase/firestore";
  import {db} from "../firebase";


  
  const userName = ref<string>("");
  const userEmail = ref<string>("");
  const password = ref<string>("");
  const form = ref<any>();
  const eyeVisible = ref<boolean>(false);
  const snackbar1 = ref<boolean>(false);
  const snackbar2 = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const valid = ref<boolean>(false);
  const router = useRouter();
  
          
  const register = async () => {
    await createUserWithEmailAndPassword(getAuth(), userEmail.value, password.value)
    .then(async (userCredential) => {
        let newUser = {
          name: userName.value,
          email: userEmail.value,
          time: Date.now(),
        };
      
        const docRef = await addDoc(collection(db, "users"), newUser);
        console.log("Document written with ID: ", docRef.id);
        alert(`user email: ${userEmail.value} Successfully added`);
        console.log("good one Successes");
        goto('Home');
        
      const user = userCredential.user;
      updateProfile(user, {
        displayName: userName.value,
      })
      .then( () => {
        
        console.log("User name set successfully.");

      })
      .catch((error:any) => {
        console.log("Error setting user name:", error.message);
      });
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
      submit_registerFailed();
    });
    
  };

      
      

  const nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) => (v && v.length <= 30) || "Name must be less than 30 characters",
  ];

  const passwordRules = [
    (v: string) => !!v || "password is required",
    (v: string) =>
      (v && v.length >= 6) ||
      "Password must be contain at least 6 characters",
    (v: string) =>
      (v && v.length <= 15) ||
      "Password must be contain at most 15 characters",
  ];

  const emailRules = [
    (v: string) => !!v || "E-mail is required",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  ];

  const resetForm = () => {
    form.value.reset();
  };

  const submit_register = () => {
    snackbar1.value = true;
    resetForm();
  };

  const submit_registerFailed = () => {
    snackbar2.value = true;
    resetForm();
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        const auth = getAuth();
        const user = auth.currentUser;
        addUserToCollection(user);
        console.log(result);
        goto('Home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        addUserToCollection(result.user);
        console.log(result.user);
        goto('Home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        addUserToCollection(result.user);
        console.log(result.user);
        goto('Home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const addUserToCollection = async (user:any) => {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(query(usersRef, where("email", "==", user.email)));

    if (!usersSnapshot.empty) {
      console.log("User with the same email already exists!");
      return;
    }
    let newUser = {
      name: user?.displayName,
      email: user?.email,
      time: Date.now(),
    };
  
    const docRef = await addDoc(collection(db, "users"), newUser);
    console.log("Document written with ID: ", docRef.id);
  };

  const goto = (name: string) => {
    router.push({
      name,
    });
  };

</script>

<style scoped>
.v-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-card {
  max-width: 400px;
  width: 100%;
}
</style>