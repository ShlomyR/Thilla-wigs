<template>
    <v-row no-gutters cols="12" class="mt-5" justify="center" align="center">
        <v-col cols="9"  justify="center" align="center">
            <div class="h-150 w-70 bg-green flex">
                <div>
                    <h1 class="text-red text-center">This is the Account Settings page</h1>
                </div>
            </div>
        </v-col>
    </v-row >
    <v-row justify="center">
        <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="center">
            <v-card :elevation="6" justify="center" align="center">
                <v-card-title class="text-right text-blue">
                    :שם נוכחי 
                </v-card-title>
                <v-card-text class="text-right">
                    <div class="grey--text">
                        {{ appointmentDetails.name }}
                    </div>
                    <v-btn class="mt-5" color="blue" @click="showNameDialog = true" v-if="!isGoogleUser">שנה שם</v-btn>
                </v-card-text>
                <v-card-title class="text-right text-blue">
                    :אימייל
                </v-card-title>
                <v-card-text class="text-right">
                    <div class="grey--text">
                        {{ appointmentDetails.email }} 
                    </div>
                    <v-btn class="mt-5" color="blue" @click="showEmailDialog = true" v-if="!isGoogleUser">עדכן אמייל</v-btn>
                </v-card-text>
                <v-col class="text-right">
                    <v-btn color="blue" @click="showPasswordDialog = true" v-if="!isGoogleUser">שנה סיסמא</v-btn>
                </v-col>
                <v-col class="text-right">
                    <template v-if="user?.providerData[0].providerId != 'google.com'">
                        <v-btn color="blue" @click="showDeleteAccountDialog = true">מחק חשבון</v-btn>
                    </template>
                    <template v-if="user?.providerData[0].providerId === 'google.com'">
                        <v-btn color="blue" @click="reauthenticateAndDeleteAccount">מחק חשבון</v-btn>
                    </template>
                </v-col>
            </v-card>
        </v-col>
    </v-row>
        <!-- Name Update Dialog -->
        <v-dialog v-model="showNameDialog">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Change Name</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="newName" label="New Name"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue" @click="updateName">Save</v-btn>
                    <v-btn @click="showNameDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Email Update Dialog -->
        <v-dialog v-model="showEmailDialog">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Change Email</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="currentPassword" label="Current Password" type="password"></v-text-field>
                    <v-text-field v-model="newEmail" label="New Email"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue" @click="updateEmails">Save</v-btn>
                    <v-btn @click="showEmailDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showPasswordDialog">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Change Password</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="currentPassword" label="Current Password" type="password"></v-text-field>
                    <v-text-field v-model="newPassword" label="New Password" type="password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue" @click="changePassword">Change Password</v-btn>
                    <v-btn @click="showPasswordDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

        <v-dialog v-model="showDeleteAccountDialog">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Confirm Password</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="currentPassword" label="Current Password" type="password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue" @click="reauthenticateAndDeleteAccount">Confirm</v-btn>
                    <v-btn @click="showDeleteAccountDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    
</template>

<script lang="ts" setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { collection, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
    import { getAuth, reauthenticateWithCredential, signInWithPopup, GoogleAuthProvider, EmailAuthProvider, unlink, updateEmail, updatePassword } from 'firebase/auth';
    import { db } from '../firebase';
    import {useAuth} from '@/components/useAuth';

    const { appointmentDetails, isMobile } = useAuth()

    // const appointmentDetails = ref<{ name: string; email: string }>({ name: '', email: '' });
    const newName = ref('');
    const newEmail = ref('');
    const showNameDialog = ref(false);
    const showEmailDialog = ref(false);
    const showDeleteAccountDialog = ref(false);
    const currentPassword = ref('');
    const showPasswordDialog = ref(false);
    const newPassword = ref('');

    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;

    const changePassword = async () => {
        if (!user) {
            return;
        }

        try {
            if (user.email) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword.value);
                showPasswordDialog.value = false;
                console.log('Successfully change account password.');
            } else {
                console.log('User email is null. Cannot change account password.');
            }
        } catch (error) {
            console.log('Error changing password:', error);
        }
    };

    const reauthenticateAndDeleteAccount = async () => {
        if (!user) {
            return;
        }

        try {
            if (user.providerData[0].providerId === 'google.com') {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            }
            // Find and delete documents in the "appointments" collection where the email matches
            const appointmentsRef = collection(db, 'appointments');
            const appointmentsQuery = query(appointmentsRef, where('email', '==', user.email));
            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            appointmentsSnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });

            const appointmentsHistoryRef = collection(db, 'appointments_history');
            const appointmentsHistoryQuery = query(appointmentsHistoryRef, where('email', '==', user.email));
            const appointmentsHistorySnapshot = await getDocs(appointmentsHistoryQuery);
            appointmentsHistorySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });

            // Find and delete documents in the "users" collection where the email matches
            const usersRef = collection(db, 'users');
            const usersQuery = query(usersRef, where('email', '==', user.email));
            const usersSnapshot = await getDocs(usersQuery);
            usersSnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });

            showDeleteAccountDialog.value = false;
            if (user.email) {
                if (user.providerData[0].providerId === 'google.com') {
                    await user.delete();
                    router.push('./');
                } else {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
                    console.log("credential: ",credential);
                    await reauthenticateWithCredential(user, credential);
                    await user.delete();
                    router.push('./');
                }
            } else {
                console.log('User email is null. Cannot delete account.');
            }
        } catch (error) {
            console.log('Error re-authenticating:', error);
        }
    }

    const fetchAppointmentDetails = async () => {
        if (!user) {
            return;
        }

        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, where('email', '==', user.email));
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.docs.forEach((doc) => {
            appointmentDetails.value.name = doc.data().name;
            appointmentDetails.value.email = doc.data().email;
        });
    };

    const updateName = async () => {
        if (!user) {
            return;
        }

        const appointmentsRef = collection(db, 'appointments');
        const appointmentsQuery = query(appointmentsRef, where('email', '==', user.email));
        
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, where('email', '==', user.email));

        try {
            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            if (!appointmentsSnapshot.empty) {
                const appointmentDoc = appointmentsSnapshot.docs[0]; // Assuming there is only one matching document
                await updateDoc(appointmentDoc.ref, { name: newName.value });
            }

            const usersSnapshot = await getDocs(usersQuery);
            if (!usersSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0]; // Assuming there is only one matching document
                await updateDoc(userDoc.ref, { name: newName.value });
            }
            appointmentDetails.value.name = newName.value;
            showNameDialog.value = false;
            
        } catch (error) {
            console.log('Error updating name:', error);
        }
    };
    
    const updateEmails = async () => {
        if (!user) {
            return;
        }

        try {

            // Update email in the Firestore document
            const appointmentsRef = collection(db, 'appointments');
            const appointmentsQuery = query(appointmentsRef, where('email', '==', user.email));
            const appointmentsSnapshot = await getDocs(appointmentsQuery);

            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('email', '==', user.email));
            const usersSnapshot = await getDocs(userQuery);

            appointmentsSnapshot.docs.forEach((doc) => {
                updateDoc(doc.ref, { email: newEmail.value });
            });

            usersSnapshot.docs.forEach((doc) => {
                    updateDoc(doc.ref, { email: newEmail.value });
                    const credential = EmailAuthProvider.credential(doc.data().email, currentPassword.value);
                    reauthenticateWithCredential(user, credential)
                    .then(() => {
                        return updateEmail(user, newEmail.value);
                    })
                        .then(() => {
                            console.log('Email updated successfully.');
                        })
                    .catch((error) => {
                        console.log('Error updating email:', error.message);
                    });
                    alert(`user email: ${newEmail.value} Successfully changed`);
            });

            appointmentDetails.value.email = newEmail.value;
            showEmailDialog.value = false;
        } catch (error) {
            console.log("Error setting user email:", error);
        }
    };

    onMounted(() => {
        fetchAppointmentDetails();
    });

    const isGoogleUser = computed(() => {
        if (user && user.providerData.length > 0) {
            if (user.providerData[0].providerId === 'google.com') {
                return user.providerData[0].providerId === 'google.com';
            } else if (user.providerData[0].providerId === 'twitter.com') {
                return user.providerData[0].providerId === 'twitter.com';
            } else if (user.providerData[0].providerId === 'facebook.com') {
                return user.providerData[0].providerId === 'facebook.com';
            }
        }
        return false;
    });
</script>

<style scoped>
/* Your component's styles */
</style>
