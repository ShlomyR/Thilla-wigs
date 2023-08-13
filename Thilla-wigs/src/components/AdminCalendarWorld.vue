<!-- src/views/AdminCalendar.vue -->
<template>
    <div>
      <FullCalendar ref="calendar" :options="calendarOptions" />
    </div>
</template>
  
<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { collection, query, getDocs } from 'firebase/firestore';
    import FullCalendar from '@fullcalendar/vue3';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import listPlugin from '@fullcalendar/list';
    import interactionPlugin from '@fullcalendar/interaction';

    import { db } from '../firebase';

    const appointments = ref([]);

    // Define the FullCalendar options
    const calendarOptions = ref({
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin], // Include timeGridPlugin and listPlugin
        initialView: 'dayGridMonth', // You can choose the initial view as per your preference
        events: [], // This will be populated with the appointments fetched from the database
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // Add the view options
        },
        locale: 'he',
    });

    onMounted(async () => {
        try {
            const q = query(collection(db, 'appointments'));
            const querySnapshot = await getDocs(q);

            const events:any = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                events.push({
                    id: doc.id,
                    title: data.name,
                    start: data.time.toDate(),
                });
            });

            // Set the events to the calendar
            calendarOptions.value.events = events;
            appointments.value = events;
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    });
</script>
  
<style>
/* Add your custom CSS styles for the calendar here if needed */
</style>