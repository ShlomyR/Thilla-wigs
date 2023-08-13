<template>
  <v-row class="mt-5" cols="12" no-gutters justify="center" align="center">
    <v-col cols="8" justify="center" align="center">
      <VDatePicker key="date-picker" locale="he" :rules="rules" :disabled-dates="disabledDates" :min-date="new Date()"
        title-position="center" is-dark="system" v-model="date" mode="dateTime" is24hr expanded />
    </v-col>
  </v-row>
  <v-row cols="12" justify="center">
    <v-col cols="8" no-gutters justify="center" align="center">
      <v-btn @click="scheduleAppointment" :disabled="hasAppointment" max-width="150px" color="blue">
        זימון תור
      </v-btn>
    </v-col>
  </v-row>
</template>


<script lang="ts" setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import { addDoc, collection, onSnapshot, deleteDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import { useAuth } from '@/components/useAuth';

const { appointmentDetails } = useAuth()

const date: any = ref(new Date());

const usersTimeArr = ref<Array<Date>>([]);
const usersNameArr = ref<Array<string>>([]);
const usersEmailArr = ref<Array<string>>([]);
const router = useRouter();
let isProcessing = false;


const fetchUserScheduledDates = async () => {
  if (isProcessing) {
    return; // Return if changes are already being processed
  }

  isProcessing = true; // Set the processing flag

  const q = query(collection(db, "appointments"), orderBy("time"));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const currentDate = new Date();

    const updatedUsersTimeArr = [];
    const updatedUsersNameArr = [];
    const updatedUsersEmailArr = [];

    for (const doc of snapshot.docs) {
      const appointmentDate = doc.data().time.toDate();
      if (appointmentDate < currentDate) {
        try {
          const appointmentData = doc.data();
          await addDoc(collection(db, 'appointments_history'), appointmentData);
          await deleteDoc(doc.ref);
          console.log('Appointment moved to history:', appointmentData);
        } catch (error) {
          console.error('Error moving appointment to history:', error);
        }
      } else {
        updatedUsersTimeArr.push(appointmentDate);
        updatedUsersNameArr.push(doc.data().name);
        updatedUsersEmailArr.push(doc.data().email);
      }
    }

    usersTimeArr.value = updatedUsersTimeArr;
    usersNameArr.value = updatedUsersNameArr;
    usersEmailArr.value = updatedUsersEmailArr;

    isProcessing = false; // Reset the processing flag
  });

  // Detach the listener when it's no longer needed
  return unsubscribe;
};

// Call the fetchUserScheduledDates function when the component is mounted
onMounted(() => {
  fetchUserScheduledDates();
});

const disabledDates = ref<Array<{ start: Date; repeat: { weekdays: number[] } }>>([]);

const availabilityCache = new Map<string, boolean>();

// Function to check if all hours and minutes of a given day are occupied
const isDayFullyOccupied = (date: Date) => {
  const dateString = date.toISOString().slice(0, 10); // Use the date string as the cache key

  // Check if the availability is already cached for this date
  if (availabilityCache.has(dateString)) {
    return availabilityCache.get(dateString)!;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i); // Create an array of hours from 0 to 23
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // Create an array of minutes: [0, 5, 10, ..., 55]
  const weekday = date.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)

  const isFullyOccupied = hours.every((hour) => {
    if (weekday === 5) { // Check if it's Friday (weekday 5)
      // Check if the hour is within the range 8 to 11 for Friday
      if (hour >= 8 && hour <= 11) {
        return minutes.every((minute) => isMinuteOccupied(date, hour, minute));
      } else {
        return true; // For hours outside the range 8 to 11 on Friday, consider them as not occupied
      }
    } else { // For all other days of the week
      // Check if the hour is within the range 8 to 18
      if (hour >= 8 && hour <= 18) {
        return minutes.every((minute) => isMinuteOccupied(date, hour, minute));
      } else {
        return true; // For hours outside the range 8 to 18, consider them as not occupied
      }
    }
  });

  // Cache the result for this date
  availabilityCache.set(dateString, isFullyOccupied);

  return isFullyOccupied;
};

const updateDisabledDates = () => {
  const fullyOccupiedDates = new Set<string>(); // Store the dates that are fully occupied

  // Iterate through each user's scheduled date and add the fully occupied dates to the set
  for (const userDate of usersTimeArr.value) {
    const date = new Date(userDate);
    const dateString = date.toISOString().slice(0, 10);

    if (isDayFullyOccupied(date)) {
      fullyOccupiedDates.add(dateString);
    }
  }

  // Clear the disabledDates array
  disabledDates.value = [];
  disabledDates.value.push({ start: new Date('1994-27-06'), repeat: { weekdays: [7] } });

  // Add the fully occupied dates to the disabledDates array
  for (const dateString of fullyOccupiedDates) {
    const startDate = new Date(dateString);
    disabledDates.value.push({ start: startDate, repeat: { weekdays: [7] } });
  }
};


console.log("usersTimeArr: ", usersTimeArr);

watchEffect(() => {
  updateDisabledDates();
});

const isHourOccupied = (date: Date, hour: number) => {
  // Check if all minutes of the given hour are occupied
  for (let minute = 0; minute < 60; minute += 5) {
    if (!isMinuteOccupied(date, hour, minute)) {
      return false;
    }
  }
  return true;
};

const isMinuteOccupied = (date: Date | null, hour: number, minute: number) => {
  if (date === null) {
    return false;
  }

  return usersTimeArr.value.some(
    (userDate) =>
      new Date(userDate).toDateString() === date.toDateString() &&
      new Date(userDate).getHours() === hour &&
      new Date(userDate).getMinutes() === minute
  );
};


// Function to schedule an appointment
const scheduleAppointment = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  let userName;
  if (user) {
    if (appointmentDetails.value.name === '') {
      userName = user.displayName;

    } else {
      userName = appointmentDetails.value.name;
    }
    const userEmail = user.email;

    if (hasAppointment.value) {
      console.log('You already have an appointment scheduled.');
      return;
    }

    const selectedDateTime = new Date(date.value);

    try {
      await addDoc(collection(db, 'appointments'), {
        name: userName,
        email: userEmail,
        time: selectedDateTime,
        createdOn: serverTimestamp(),
      });

      console.log('Appointment scheduled successfully!');

      goto('MeetingDetails');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    }
  }
};

const hasAppointment = computed(() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return false;
  }


  const userEmail = user.email;

  return usersEmailArr.value.some((email) => email === userEmail);
});



const rules = ref({
  hours: (hour: any, { weekday }: { weekday: any }) => {
    if ([7].includes(weekday)) {
      return false; // Disable all hours on Sunday
    } else if (isHourOccupied(date.value, hour)) {
      return false; // Disable the hour if all minutes are occupied
    } else if ([6].includes(weekday)) {
      return hour >= 8 && hour <= 11;
    } else {
      const currentDateTime = new Date();
      const selectedDate = new Date(date.value);

      // Disable hours if the selected date is today and the hour is in the past
      if (
        selectedDate.toDateString() === currentDateTime.toDateString() &&
        hour < currentDateTime.getHours() // Change here to < instead of <=
      ) {
        return false;
      }

      return hour >= 8 && hour <= 18;
    }
  },
  minutes: (minute: any, { weekday }: { weekday: any }) => {
    if ([7].includes(weekday)) {
      return false; // Disable all minutes on Sunday
    } else if (date.value === null || isMinuteOccupied(date.value, date.value.getHours(), minute)) {
      return false; // Disable the minute if date.value is null or it's occupied
    } else {
      const currentDateTime = new Date();
      const selectedDate = new Date(date.value);

      // Disable minutes if the selected date is today and the minute is in the past
      if (
        selectedDate.toDateString() === currentDateTime.toDateString() &&
        selectedDate.getHours() === currentDateTime.getHours() &&
        minute <= currentDateTime.getMinutes()
      ) {
        return false;
      }

      return minute % 5 === 0; // Enable all other minutes
    }
  },
});

const goto = (name: string) => {
  router.push({
    name,
  });
};

</script>