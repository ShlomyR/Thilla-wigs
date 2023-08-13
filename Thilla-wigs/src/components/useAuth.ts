import { ref } from "vue";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const user = ref(auth.currentUser);
const isLogin = ref(false);
const sticky = ref<boolean>(false);
const isMobile = ref(false);
const appointmentDetails = ref<{ name: string; email: string, time: Date, showTime: any , photo:any }>({ name: '', email: '' ,time: new Date(), showTime: '', photo: ''});

onAuthStateChanged(auth, (user) => {
    if (user) {
        isLogin.value = true;
    } else {
        isLogin.value = false;
    }
});


export const useAuth = () => {
    const handleSignOut = (router: any) => {
        signOut(auth).then(() => {
            router.push("/");
        });
    };

    return {
        user,
        sticky,
        isLogin,
        isMobile,
        appointmentDetails,
        handleSignOut,
    }

}