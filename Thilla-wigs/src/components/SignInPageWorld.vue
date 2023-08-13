<template>
  <v-row no-gutters>
    <v-col cols="12" class="h-100">
      <v-sheet min-width="50vh" justify="center" align="center" color="grey-lighten-5" height="93vh">
        <v-row no-gutters justify="center" align="center">
          <v-col cols="8">
            <v-card class="mt-5" color="grey-lighten-3" dark>
              <v-card class="text-h4 text-center pa-5" color="blue" dark>
                welcome
              </v-card>
              <v-card-text class="mt-5">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row justify="center">
                    <v-col cols="9">
                      <v-text-field v-model="userEmail" :readonly="loading" :rules="emailRules" label="User email"
                        variant="outlined" required />
                    </v-col>
                    <v-col cols="9">
                      <v-text-field v-model="password" :readonly="loading" :rules="passwordRules"
                        :append-inner-icon="eyeVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="eyeVisible ? 'text' : 'password'" label="Enter your password" variant="outlined"
                        @click:append-inner="eyeVisible = !eyeVisible" required />
                    </v-col>
                    <v-col cols="9">
                      <v-row no-gutters justify="space-between">
                        <v-col cols="5">
                          <v-btn block :disabled="!valid" :loading="loading" color="green-lighten-3"
                            @click="login(userEmail, password)">
                            Sign in
                          </v-btn>
                        </v-col>
                        <v-col cols="5">
                          <v-btn block :disabled="valid" color="green-lighten-3" to="/signup">
                            Sign up
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row> </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-12">
                    <v-col cols="4" class="text-end">
                      <v-btn icon="mdi-twitter" color="blue-lighten-3" variant="text" @click="signInWithTwitter()" />
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <v-btn icon="mdi-google-plus" color="black" variant="text" @click="signInWithGoogle()" />
                    </v-col>
                    <v-col cols="4" class="text-start">
                      <v-btn icon="mdi-facebook" color="blue-darken-3" variant="text" @click="signInWithFacebook()" />
                    </v-col>
                    <v-col cols="3">
                      <v-btn class="mt-5" color="green-lighten-1" @click="resetForm()">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import AxiosManager from "../plugins/AxiosManeger";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  linkWithCredential,
  fetchSignInMethodsForEmail,
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
import { db } from "../firebase";

import { useAuth } from "@/components/useAuth";

const { isMobile } = useAuth();

const userEmail = ref<string>("");
const password = ref<string>("");
const form = ref<any>();
const eyeVisible = ref<boolean>(false);
const loading = ref<boolean>(false);
const valid = ref<boolean>(false);
const router = useRouter();
const axiosManager = new AxiosManager();


// const q = query(collection(db, "users"), orderBy("time"));
// const unsubscribe = onSnapshot(q, (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//     let userChange = change.doc.data();
//     userChange.id = change.doc.id;
//     if (change.type === "added") {
//       console.log("New user: ", userChange);

//       usersArr.push(userChange);
//     }
//     if (change.type === "modified") {
//       console.log("Modified user: ", userChange);
//     }
//     if (change.type === "removed") {
//       console.log("Removed user: ", userChange);
//       let index = users.findIndex((us) => us.id === userChange.id);
//       users.splice(index, 1);
//     }
//   });
// });




// const unsubscribe1 = onSnapshot(q, (querySnapshot) => {
//   const users: any = [];
//   querySnapshot.forEach((doc) => {
//     users.push(doc.data().name);
//     users.push(doc.data().email);
//     users.push(doc.data().password);
//     users.push(doc.data().time);
//   });
//   console.log("Current users in firebase: ", users.join(",\n"));
// });


const login = (userEmail: string, password: string) => {
  signInWithEmailAndPassword(getAuth(), userEmail, password)
    .then(() => {
      console.log("good one");
      goto('Home');
      return alert("success"), onSubmit();
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};



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

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      addUserToCollection(result.user);
      console.log(result);
      goto('Home');
    })
    .catch((error) => {
      console.log(error.message);
    });
};

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    getRedirectResult(getAuth())
      .then(() => {
        goto('Home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
});

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
  let auth:any = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      addUserToCollection(result.user);
      console.log(result.user);
      goto('Home');
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const goto = (name: string) => {
  router.push({
    name,
  });
};

const twitter = async () => {
  const res = await axiosManager.getData("/users");
  console.log("res", res.data);
  console.log("shlomy");
};

const onSubmit = () => {
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
  resetForm();
};

const addUserToCollection = async (user: any) => {
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