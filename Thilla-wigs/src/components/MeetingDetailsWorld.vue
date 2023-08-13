<template>
    <v-sheet class="pppp">
        <v-row no-gutters cols="12" class="mt-0" justify="center" align="center">
            <v-col cols="9" justify="center" align="center">
                <div class="h-150 w-70 bg-green flex ">
                    <div>
                        <h1 class="text-red text-center">{{ appointmentDetails.name }}</h1>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="right">
                <div class="h-150 w-70 bg-blue flex text-black">
                    :תור שקבעתי
                </div>
            </v-col>
        </v-row>
        <v-row v-if="value" justify="center">
            <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="center">
                <v-card :elevation="6" justify="center" align="center">
                    <v-card-title class="text-right text-blue">
                        :מיקום
                    </v-card-title>
                    <v-card-text class="text-right">
                        <div class="grey--text">
                            רחוב עזרא 4, רחובות (בניין משרדים קומה ב')
                        </div>
                    </v-card-text>
                    <v-card-title class="text-right text-blue">
                        :תאריך
                    </v-card-title>
                    <v-card-text class="text-right">
                        <div class="grey--text">
                            {{ appointmentDetails.showTime }}
                        </div>
                    </v-card-text>
                    <v-col class="text-right">
                        <v-btn @click="cancelAppointment" :disabled="!value" color="blue">
                            ביטול פגישה
                        </v-btn>
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="right">
                <div class="h-150 w-70 bg-blue flex text-black">
                    :היסטורית תורים
                </div>
            </v-col>
        </v-row>
        <v-row v-if="isLoading">
            <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="center">
                <div class="h-150 w-70 bg-blue flex text-black">
                    Loading...
                </div>
            </v-col>
        </v-row>
        <v-row v-else-if="appointmentHistory.length > 0 && appointmentHistory.at(0).showTime < new Date()" cols="12"
            justify="center">
            <v-col :cols="isMobile ? 9 : 3" no-gutters justify="center" align="center">

                <v-card class="mt-5" :elevation="6" v-for="(appointment, index) in appointmentHistory" :key="index">
                    <v-card-title class="text-right text-blue">
                        :מיקום
                    </v-card-title>
                    <v-card-text class="text-right">
                        <div class="grey--text">
                            רחוב עזרא 4, רחובות (בניין משרדים קומה ב')
                        </div>
                    </v-card-text>
                    <v-card-title class="text-right text-blue">
                        :תאריך
                    </v-card-title>
                    <v-card-text class="text-right">
                        {{ formatDateTime(appointment.showTime) }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-sheet>
</template>
    
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from "vue-router";
import { db } from '../firebase';
import { useAuth } from '@/components/useAuth';

const { appointmentDetails, isMobile } = useAuth();

const auth = getAuth();
const user = auth.currentUser;

const router = useRouter();
const isLoading = ref<boolean>(true);
const value = ref<boolean>(false);
const appointmentHistory = ref<Array<any>>([{
    showTime: '',
}]);


const formatDateTime = (timestamp: any) => {
    if (timestamp && timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        const day = date.toLocaleDateString('he-IL', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: '2-digit' });
        const formattedTime = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        return `ב${day} ${formattedDate} בשעה ${formattedTime}`;
    }
    return '';
};

const fetchAppointmentDetails = async () => {
    if (!user) {
        return;
    }

    const usersRef = collection(db, 'users');
    const queryByEmail = query(usersRef, where('email', '==', user.email));
    const usersSnapshot = await getDocs(queryByEmail);

    usersSnapshot.docs.forEach((doc) => {
        appointmentDetails.value.name = doc.data().name;
        appointmentDetails.value.email = doc.data().email;
    });

    const appointmentsRef = collection(db, 'appointments');
    const queryByUserAndTime = query(
        appointmentsRef,
        where('email', '==', user.email),
        orderBy('time'),
        limit(1)
    );

    const appointmentsSnapshot = await getDocs(queryByUserAndTime);

    if (!appointmentsSnapshot.empty) {
        const appointmentData = appointmentsSnapshot.docs[0].data();
        appointmentDetails.value.time = appointmentData.time;
        appointmentDetails.value.showTime = formatDateTime(appointmentData.time);
        value.value = true;
    } else {
        value.value = false;
    }
};



const fetchAppointmentHistory = async () => {
    if (!user) {
        return;
    }

    const appointmentsRef = collection(db, 'appointments_history');
    const queryByUserAndTime = query(
        appointmentsRef,
        where('email', '==', user.email),
        orderBy('time', 'desc')
    );

    const appointmentsSnapshot = await getDocs(queryByUserAndTime);
    const history = appointmentsSnapshot.docs
        .filter(doc => doc.data().time < new Date())
        .map(doc => ({
            showTime: doc.data().time,
        }));

    appointmentHistory.value = history;
};

onMounted(() => {
    fetchAppointmentDetails();
    fetchAppointmentHistory();
    isLoading.value = false;
});

// const viewAppointmentHistory = (appointment: any) => {
//     console.log('Viewing appointment:', formatDateTime(appointment.showTime));
// };



const cancelAppointment = async () => {
    if (!user) {
        return;
    }
    const appointmentsRef = collection(db, 'appointments');
    const queryByUser = query(appointmentsRef, where('email', '==', user.email));
    const appointmentsSnapshot = await getDocs(queryByUser);

    appointmentsSnapshot.docs.forEach((doc) => {
        deleteDoc(doc.ref)
        .then(() => {
            console.log('Appointment deleted successfully.');
            router.push("./meeting")
        })
        .catch((error: any) => {
            console.error('Error deleting appointment:', error);
        });
    });
};

</script>
    
<style scoped>
.pppp {
    /* background-color: rgb(0,31,31); */
}
</style>