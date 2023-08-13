<template>
  <v-container fluid>
    <v-row class="flex-container">
      <!-- Carousel section -->
      <v-carousel progress="primary" hide-delimiters show-arrows="hover" cycle height="80vh" class="carousel-container">
        <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
          <v-img :src="item.src" :alt="item.alt" style="{ isMobile ? height: '0%' : height:'100%' }"></v-img>
        </v-carousel-item>
      </v-carousel>

      <!-- Image -->
      <!-- <v-img :src="tehilaImageSrc" alt="Tehila Image" class="tehila-image" /> -->

      <!-- Hero section -->
      <v-responsive class="text-center hero-section">
        <!-- <div class="py-16" /> -->
        <div class="hero-text">
          <div class="text-h2 font-weight-light mb-n1" style="color: white;">ברוכים הבאים</div>
        </div>
        <div class="hero-text-h1">
          <h1 class="text-h3 font-weight-bold" style="color: white;">פאות תהילה</h1>
        </div>
        <div class="customer-service" style="color: white;">
          <p class="text-h4 font-weight-light mb-n1">
            !חוויית לקוח מעולה - כי אתה הכוכב שלנו
          </p>
          <p class="font-weight-light">
            אנחנו מקדישים זמן והשקעה רבה לוודא שכל לקוח הוא לא רק לקוח, אלא חלק בלתי נפרד ממשפחתנו. עם צוות מנוסה ומקצועי,
            אנחנו מתחייבים להציע לך לא רק מוצרים איכותיים, אלא גם חוויית שירות מרשימה
            <br><br>
            בין אם אתה מחפש לשדרג את מראה השיער, לטפח פאה או תוספת שיער, או פתרונות רפואיים, אנחנו כאן כדי לספק לך את
            התמיכה והמדריך המיטביים. אנו מאמינים בלקוחות מרוצים שמשתפים בחווייתם החיובית, ולכן אנחנו כאן תמיד להקשיב לך,
            לייעץ ולשתף אותך בידע המקצועי שלנו.
          </p>
        </div>
        <!-- <div class="customer-service">
          <div class="text-h4 font-weight-light mb-n1" style="color: white;">שירות לקוחות מעולה</div>
        </div> -->
        <div class="py-5 px-8" />
        <v-btn rounded="xl" @click="clicked" size="x-large" color="blue" width="260px" class="hero-button">
          {{ isLogin ? 'קבעי פגישה עכשיו' : 'התחברי על מנת לקבוע פגישה' }}
        </v-btn>
        <div class="py-16" />
      </v-responsive>
    </v-row>

    <!-- Animated Content -->
    <template v-for="(slideType, index) in slideTypes" :key="index">
      <v-row :class="slideType.containerClass">
        <v-responsive class="first-image-slide-section">
          <transition name="slide-in">
            <v-card border :elevation="0" v-if="showAnimatedContent" class="text-center animated-content-headline">
              <v-img :src="slideType.imageSrc" :alt="slideType.imageAlt" class="animated-image" v-if="slideType.imageSrc"></v-img>
              <div class="animated-text">
                <h3 class="text-h4 font-weight-bold" style="color: black;">{{ slideType.title }}</h3>
                <p style="color: black;" v-if="isMobile"  class="font-weight-light">{{ slideType.text }}</p>
                <v-btn rounded="xl" class="mt-5" @click="() => goToCatalog('long')" v-if="isMobile && slideType.title === 'פאות ארוכות'" color="blue">הכנס לקטלוג פאות ארוכות</v-btn>
                <v-btn rounded="xl" class="mt-5" @click="() => goToCatalog('middle')" v-if="isMobile && slideType.title === 'פאות בינוניות'" color="blue">הכנס לקטלוג פאות בינוניות</v-btn>
                <v-btn rounded="xl" class="mt-5" @click="() => goToCatalog('short')" v-if="isMobile && slideType.title === 'פאות קצרות'" color="blue">הכנס לקטלוג פאות קצרות</v-btn>
              </div>
            </v-card>
          </transition>
        </v-responsive>
        <v-responsive v-if="!isMobile" class="text-center imege-slide-section">
          <transition name="slide-in">
            <v-card border :elevation="0" v-if="showAnimatedContent" class="animated-content">
              <!-- Add your image and text here -->
              <div class="animated-text">
                <p  style="color: black;" class="font-weight-light">
                  {{ slideType.text }}
                </p>
                <v-btn  rounded="xl" class="mt-5" @click="() => goToCatalog('long')" v-if="!isMobile && slideType.title === 'פאות ארוכות'" color="blue">הכנס לקטלוג פאות ארוכות</v-btn>
                <v-btn  rounded="xl" class="mt-5" @click="() => goToCatalog('middle')" v-if="!isMobile && slideType.title === 'פאות בינוניות'" color="blue">הכנס לקטלוג פאות בינוניות</v-btn>
                <v-btn  rounded="xl" class="mt-5" @click="() => goToCatalog('short')" v-if="!isMobile && slideType.title === 'פאות קצרות'" color="blue">הכנס לקטלוג פאות קצרות</v-btn>
              </div>
            </v-card>
          </transition>
        </v-responsive>
      </v-row>
    </template>

    <!-- About section -->
    
    <v-row class="pt-10"></v-row>
    <v-responsive class="text-center" height="100vh" :style="{ background: sticky ? 'black' : 'white' }">
      <v-card max-width="1000" class="mx-auto" color="blue-lighten-3">
        <v-card-title :style="{ color: sticky ? 'black' : '#42b983', background: sticky ? 'white' : 'black' }"
          class="text-h2 font-weight-light mb-n1">
          אודות
        </v-card-title>
        <div>
          <!-- Add your product and model photos here with animations -->
        </div>
        <div class="text-h4 font-weight-light mb-n1">
          רשת הפאות המצליחה אשר מנוהלת ע״י בני הזוג יצחק ותהילה גינדי משנת 1998. לרשת סניפים בירושלים וברחובות, בכל סניף
          אולם תצוגה מהמבחר הרחב של הפאות ותוספות השיער שלנו.
          הרשת מעניקה את כל הפתרונות לשיער, החל בנשים אשר משום הנהגה דתית מכסות את ראשן, נוסף על פתרונות רפואיים
          אשר נועדו לנשים שלצערנו חוות נשירה מסיבית עקב טיפולים רפואיים, וכלה בתוספות שיער אשר נועדו לכסות דלילות
          והתקרחות או פשוט לתת מראה מלא ושופע יותר מסיבות אסתטיות
        </div>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { useRouter } from "vue-router";
import { useAuth } from "@/components/useAuth";

const { isLogin, user, sticky, isMobile } = useAuth();
const router = useRouter();
const storage = getStorage();

const carouselItems = ref<Array<{ src: string; alt: string }>>([]);
const slideTypes = ref<Array<{ containerClass: string; imageSrc: string; imageAlt: string; title: string; text: string }>>([]);
const tehilaImageSrc = ref('');
const showAnimatedContent = ref(false);
let animationShown = false;

const goToCatalog = (wigType:any) => {
  let routePath;
  switch (wigType) {
    case "long":
      routePath = "/catalog/long-wigs";
      break;
    case "middle":
      routePath = "/catalog/middle-wigs";
      break;
    case "short":
      routePath = "/catalog/short-wigs";
      break;
    default:
      // Set a default route if needed
      routePath = "/catalog";
      break;
  }
  router.push(routePath);
};


const handleScroll = () => {
  const heroSection = document.querySelector('.imege-slide-container');
  if (heroSection?.getBoundingClientRect) {
    const bounding = heroSection.getBoundingClientRect();
    const isVisible = bounding.top <= window.innerHeight && bounding.bottom >= 0;
    if (isVisible && !animationShown) {
      showAnimatedContent.value = true;
      animationShown = true;
    }
  }  
};

const fetchTehilaImage = async () => {
  const tehilaImageRef = storageRef(storage, 'carosel_photos/TEHILA-448-600PX.jpg.webp');

  const url = await getDownloadURL(tehilaImageRef);

  tehilaImageSrc.value = url;
};

// Fetch image URLs and update carouselItems
const fetchCarouselImages = async () => {

  const carouselRef_1 = storageRef(storage, 'carosel_photos/פאות-ארוכות-פאות-תהילה-61.jpg.webp');
  const carouselRef_2 = storageRef(storage, 'carosel_photos/פאות-ארוכות-פאות-תהילה-99.jpg.webp');
  const carouselRef_3 = storageRef(storage, 'carosel_photos/פאות-בינוניות-פאות-תהילה-17-scaled.jpg.webp');
  const carouselRef_4 = storageRef(storage, 'carosel_photos/פאות-בינוניות-פאות-תהילה-36.jpg.webp');
  const carouselRef_5 = storageRef(storage, 'carosel_photos/פאות-קצרות-פאות-תהילה-84.jpg.webp');

  const urls = await Promise.all([
    getDownloadURL(carouselRef_1),
    getDownloadURL(carouselRef_2),
    getDownloadURL(carouselRef_3),
    getDownloadURL(carouselRef_4),
    getDownloadURL(carouselRef_5),
  ]);

  carouselItems.value = [
    { src: urls[0], alt: 'Image 1' },
    { src: urls[1], alt: 'Image 2' },
    { src: urls[2], alt: 'Image 3' },
    { src: urls[3], alt: 'Image 4' },
    { src: urls[4], alt: 'Image 5' },
  ];

  slideTypes.value = [
    {
      containerClass: "imege-slide-container",
      imageSrc: urls[0],
      imageAlt: "Animated Image",
      title: "פאות ארוכות",
      text: "אין ספק, פאה ארוכה היא פאה שנותנת שואו. הופעה אלגנטית מרשימה ויפייפה. שיער ארוך שגולש לאורך הגב, בין אם זה שיער חלק, ובין אם אלו גלים עדינים ורכים שנשפכים בצורה מדהימה שמקפיצה את הסטייל שלך גבוה גבוה.",
    },
    {
      containerClass: "imege-slide-container-1",
      imageSrc: urls[2],
      imageAlt: "Animated Image",
      title: "פאות בינוניות",
      text: "!פאה בינונית היא האיזון המושלם בין פאה ארוכה לבין פאה קצרה. קו האמצע המאפשר ליהנות משני העולמות ולהרוויח גם וגם",
    },
    {
      containerClass: "imege-slide-container-2",
      imageSrc: urls[4],
      imageAlt: "Animated Image",
      title: "פאות קצרות",
      text: "ימות הקיץ החמים, עבודת היום יום המסרבלת, שיער שנופל על הפנים ומפריע לך ואת רק רוצה להרגיש קלילה, לשים את הפאה על הראש ולצאת מהבית… במיוחד בשביל זה אנחנו מחזיקים מבחר גדול של פאות קצרות מהדגמים הכי שיקיים ועכשוויים. פאות קצרות בסטייל מטורף ונוחות עילאית.",
    },
  ];
};

const clicked = () => {
  try {
    if (user.value?.displayName === user.value?.displayName && user.value?.email === user.value?.email) {
      console.log("good one bro!!!");
      router.push("./meeting");
    } else {
      console.log("Not good bro!!!");
    }
  } catch (error) {
    console.log(error);
  }
};


onMounted(() => {
  fetchCarouselImages();
  fetchTehilaImage();
  window.addEventListener('scroll', handleScroll);
});

</script>

<style scoped>

.tehila-image {
  max-width: 25%;
  margin-left: 20px;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #061c29;
  padding: 20px 20px 20px 40px;
}

.hero-text {
  text-align: center;
  /* margin-right: 20px; */
  /* Add margin to move hero-text more to the left */
}

.hero-text-h1 {
  text-align: center;
  /* margin-right: 150px; */
}

.customer-service {
  text-align: center;
  /* margin-top: 15px; */
}

.hero-button {
  margin-left: 0px;
}

.carousel-container {
  max-width: 25%;
}

.hero-section {
  max-width: 40%;
  margin-right: 350px;
}

.pizza {
  color: #42b983;
  background-color: black;
}

.imege-slide-container {
  display: flex;
  justify-content: space-evenly;
  background-color: #6bb936;
  align-items: center;
  flex-direction: row-reverse;
  padding: 20px 20px 20px 20px;
}

.imege-slide-container-1 {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
  background-color: #99b48877;
  padding: 20px 20px 20px 20px;
}

.imege-slide-container-2 {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row-reverse;
  background-color: #809d58;
  padding: 20px 20px 20px 20px;
}
.imege-slide-section {
  max-width: 25%;
  /* margin-left: 350px; */
}

.slide-in-enter-active {
  transition: transform 1s;
}
.slide-in-enter-from {
  transform: translateX(100%);
}
.slide-in-leave-active {
  transition: transform 1s;
}
.slide-in-leave-to {
  transform: translateX(100%);
}

/* Add styles for the animated content card */
.animated-content {
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-left: 40px;
  /* height: 463px; */
}

.animated-content-headline {
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-left: 40px;
}

/* Add styles for the animated image */
.animated-image {
  width: 100%;
  height: auto;
}

/* Add styles for the text below the animated image */
.animated-text {
  margin-top: 10px;
  text-align: center;
}

.first-image-slide-section {
  max-width: 20%;
  /* padding-top: 15%; */
}

@media (min-width: 380px) and (max-width: 1025px) {
    .flex-container {
      flex-direction: column;
      padding: 20px 20px 20px 20px;
    }

    .hero-section {
      max-width: 100%;
      margin-right: 0;
      text-align: center;
    }

    .carousel-container {
      max-width: 100%;
      margin-bottom: 20px;
    }

    .imege-slide-container,
    .imege-slide-container-1,
    .imege-slide-container-2 {
      flex-direction: column;
    }

    .imege-slide-section {
      max-width: 100%;
      margin-left: 0;
    }
    .hero-text,
    .hero-text-h1 {
      text-align: center;
    }

    .customer-service {
      margin-top: 10px;
      text-align: center;
    }

    .hero-button {
      margin-left: 0;
    }

    .first-image-slide-section {
      max-width: 100%;
    }

    .animated-content-headline {
      margin-left: 0px;
    }

    .pt-10 {
      padding-top: 10px;
    }
  }
</style>
