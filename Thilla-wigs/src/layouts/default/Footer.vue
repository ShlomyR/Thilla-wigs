
<template>
    <v-footer class="bg-indigo-lighten-1 text-center d-flex flex-column">
        <div>
            <a style="text-decoration: none;" v-for="icon in icons" :key="icon" :href="getLink(icon)" target="_blank" class="mx-4">
                <v-btn color="white" :icon="icon" variant="text"></v-btn>
            </a>
        </div>

        <v-divider></v-divider>

        <v-row cols="12" no-gutters justify="center" align="center" style="font-size: 14px;">
            <v-col cols="12" justify="center" align="center">            
                <v-btn href="https://www.termsfeed.com/live/d0669ef2-c7a8-4641-a3cf-295bec8a71ac" target="_blank" rounded="xl" color="white" variant="text"><strong>Terms of use</strong></v-btn>
                <v-btn href="https://www.termsfeed.com/live/364a588b-6039-42ec-837d-0f827938efcf" target="_blank" rounded="xl" color="white" variant="text"><strong>Privacy policy</strong></v-btn>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row cols="12" no-gutters justify="center" align="center" style="font-size: 14px;">
            <v-col cols="12" justify="center" align="center">
                <strong>Copyright © {{ new Date().getFullYear() }} — Shlomi Romano All rights reserved.</strong>
            </v-col>
            <v-col>
                <v-icon class="mx-1">mdi-linkedin</v-icon>
                <a style="text-decoration: none;" href="https://www.linkedin.com/in/shlomy-romano-b608a01b4/"
                    target="_blank">
                    <v-btn rounded="xl" color="white" variant="text"><strong>contact me</strong></v-btn>
                </a>
            </v-col>
        </v-row>
    </v-footer>
</template>

<script lang="ts" setup>

import { ref } from 'vue';

const icons = ref([
    'mdi-facebook',
    'mdi-whatsapp',
    'mdi-instagram',
]);

const getLink = (icon: any) => {
    // Add logic to provide the appropriate links for each icon
    switch (icon) {
        case 'mdi-facebook':
            return 'https://www.facebook.com/TehilaWigs';
        case 'mdi-whatsapp':
            return 'https://api.whatsapp.com/send?phone=972552273020';
        case 'mdi-instagram':
            return 'https://www.instagram.com/tehila_wigs';
        default:
            return '#';
    }
};

</script>