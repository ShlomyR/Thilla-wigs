<template>
  <!-- <div class="hello" justify="center" align="center">
      <h1>"This is the Medium Wigs Category page"</h1>
  </div> -->
  <v-row class="mt-15" no-gutters cols="12" justify="center" align="center">
      <v-col :cols="isMobile ? 12 : 6" justify="center" align="center">
          <v-row justify="center" align="center">
              <v-btn variant="text" color="grey">Sort By:</v-btn>
              <v-btn v-for="colorOption in hairColorOptions" :key="colorOption.value" variant="text"
                  :color="selectedHairColor === colorOption.value ? 'black' : 'grey'"
                  @click="selectHairColor(colorOption.value)">
                  {{ colorOption.label }}
              </v-btn>
          </v-row>
      </v-col>
  </v-row>
  <!-- <v-col class="mt-15"></v-col> -->
  <v-row no-gutters cols="12" justify="center" align="center">
      <v-col :cols="isMobile ? 10 : 6">
          <v-card>
              <v-card-title>
                Medium Hair Gallery
              </v-card-title>
              <v-card-text>
                  <v-row no-gutters cols="12" justify="center" align="center">
                      <v-col v-for="(photo, index) in visiblePhotos" :key="index" cols="3">
                          <v-hover v-slot="{ isHovering }">
                              <div class="magnify-img" :class="{ 'clickable-icon': isHovering }"
                                  @click="() => openDialog(photo)">
                                  <v-img :src="photo.src" :alt="photo.alt"></v-img>
                                  <v-icon v-if="isHovering">mdi-magnify</v-icon>
                              </div>
                          </v-hover>
                      </v-col>
                  </v-row>
              </v-card-text>
              <v-card-actions>
                  <v-btn @click="loadMorePhotos" v-if="shouldShowLoadMoreButton" color="primary">Load More</v-btn>
              </v-card-actions>
          </v-card>
      </v-col>
  </v-row>
  <v-dialog v-model="showDialog" max-width="500">
      <v-card>
          <v-card-title>
              {{ selectedPhoto.alt }}
          </v-card-title>
          <v-card-text>
              <v-img :src="selectedPhoto.src" :alt="selectedPhoto.alt"></v-img>
          </v-card-text>
          <v-card-actions>
              <v-btn @click="closeDialog" color="blue">Close</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>


<script lang="ts" setup>

import { ref, onMounted, computed } from 'vue';
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "firebase/storage";
import { useAuth } from "@/components/useAuth";

const { isMobile } = useAuth();

const storage = getStorage();
const photos = ref<Array<{ src: string; alt: string | undefined; }>>([]);
const LongHairCatalogItems = ref<Array<{ src: string; alt: string }>>([]);
const showDialog = ref(false);
const selectedPhoto = ref({ src: "", alt: "" });
const photosToShow = ref(6); // Number of photos to show initially
const selectedHairColor: any = ref("show-all"); // Initialize with an empty string

const selectHairColor = (color: string) => {
  selectedHairColor.value = color;
  photosToShow.value = 6;
};

const openDialog = (photo: any) => {
  selectedPhoto.value = photo;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const extractColorFromFileName = (fileName: any) => {
  const parts: any = fileName.split(/[-.]/); // Split the file name by hyphens
  const colorIndex = parts.findIndex((part: any) => part.toLowerCase() === 'color'); // Find the index of the color part
  if (colorIndex !== -1 && colorIndex < parts.length - 1) {
      return parts[colorIndex + 1];
  }
  return null;
};

const fetchLongHairCatalogImages = async () => {
  const folderRef = storageRef(storage, '/photos/medium-wigs');

  const items = await listAll(folderRef);

  const urls = await Promise.all(items.items.map(async item => {
      const url = await getDownloadURL(item);
      const fileName = item.name;
      const color = extractColorFromFileName(fileName); // Implement your extraction logic
      return { src: url, alt: color ? `${color}` : 'wig' };
  }));

  LongHairCatalogItems.value = urls.map((url: any, index: any) => ({ src: url.src, alt: `Image ${index + 1}` }));

  photos.value = urls.map(url => ({ src: url.src, alt: url.alt }));
};

const hairColorOptions = [
  { value: 'show-all', label: 'Show All' },
  { value: 'light_brown', label: 'Light Brown' },
  { value: 'dark_brown', label: 'Dark Brown' },
  { value: 'blond', label: 'Blond' },
  { value: 'black', label: 'Black' },
  { value: 'chestnut', label: 'Chestnut' },
  { value: 'honey', label: 'Honey' },
];

const loadMorePhotos = () => {
  photosToShow.value += 6;

  if (selectedHairColor.value === 'show-all') {
      if (photosToShow.value >= photos.value.length) {
          photosToShow.value = photos.value.length;
      }
  } else {
      const filteredPhotos = photos.value.filter(photo => photo.alt === selectedHairColor.value);
      if (photosToShow.value >= filteredPhotos.length) {
          photosToShow.value = filteredPhotos.length;
      }
  }
};

onMounted(async () => {
  await fetchLongHairCatalogImages();
});

const visiblePhotos = computed(() => {
  if (selectedHairColor.value === 'show-all') {
      return photos.value.slice(0, photosToShow.value);
  } else if (selectedHairColor.value) {
      const filteredPhotos = photos.value.filter(photo => photo.alt === selectedHairColor.value);
      return filteredPhotos.slice(0, photosToShow.value);
  }
  return photos.value.slice(0, photosToShow.value);
});

const shouldShowLoadMoreButton = computed(() => {
  if (selectedHairColor.value === 'show-all') {
      return photosToShow.value < photos.value.length;
  } else {
      const filteredPhotos = photos.value.filter(photo => photo.alt === selectedHairColor.value);
      return photosToShow.value < filteredPhotos.length;
  }
});


</script>

<style scoped>
.v-row .v-col {
  margin: 10px;
  /* Adjust the value as per your desired spacing */
}

.clickable-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

/* Add style for the magnified image on hover */
.magnify-img:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}
</style>
