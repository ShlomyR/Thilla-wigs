<template>
    <v-btn @click="handleSignOut(router)" color="blue" class="text-end" v-if="isLogin">
        {{ text }}
    </v-btn>
</template>
  
<script lang="ts" setup>
  import { useRouter } from "vue-router";
  import {useAuth} from '@/components/useAuth';

  const router = useRouter();
  const { isLogin, handleSignOut } = useAuth()

  const props = defineProps({
    text: {
      type: String,
      default: "sign out",
    },
  });

</script>
