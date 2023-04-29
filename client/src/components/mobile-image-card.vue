<template>
  <v-card class="grey lighten-4 d-flex flex-column mobile-card"
          elevation="4">
    <div class="px-1 pt-1 flex-grow-1" style="height: 100%">
      <div v-if="!imgSrc[0] || !imgSrc[1]" class="d-flex align-center justify-center image-container">
        <v-progress-circular
            :size="50"
            indeterminate>
        </v-progress-circular>
      </div>

      <v-carousel
          v-else
          class="img-carousel"
          :continuous="false"
          height="100%"
          v-model="currentIndex"
          :touch="{
              right: () => currentIndex === 0 ? currentIndex = 0 : currentIndex--,
              left: () => currentIndex === 1 ? currentIndex = 1 : currentIndex++
          }"
          hide-delimiter-background
          delimiter-icon="mdi-minus">
        <v-carousel-item
            v-for="(image, i) in imgSrc"
            :key="i"
        >
          <v-row
              align="center"
              justify="center"
              style="height: 100%;"
          >
            <img class="img" :src="image" alt="image option">
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </div>
    <v-card-actions class="justify-center align-center">
      <v-btn icon disabled style="opacity: 0;">
        <v-icon>
          mdi-open-in-new
        </v-icon>
      </v-btn>
      <v-btn large color="primary" dark @click="submitVote">Vote</v-btn>
      <v-btn icon @click="openNewTab">
        <v-icon>
          mdi-open-in-new
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "mobile-image-card",
  props: {
    imgSrc: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    submitVote() {
      this.$emit('submitVote', this.currentIndex)
      this.currentIndex = 0
    },
    openNewTab() {
      window.open(this.imgSrc[this.currentIndex], '_blank');
    }
  }
}
</script>

<style lang="scss">
.mobile-card {
  height: 100%;

  .img-carousel {
    height: 70vh;
    height: calc(var(--vh, 1vh) * 70) !important;

    .img {
      max-height: 100% !important;
      max-width: 100% !important;
    }

  }
}

.v-carousel__controls {
  height: 30px !important;

  button {
    width: 40px !important;
    color: #9E9E9E !important;

    i {
      -webkit-text-fill-color: gray;
      text-shadow: 0 0 3px #000;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: black;
      font-size: 80px !important;
    }
  }

  .v-btn--active {
    color: white !important;

    i {
      -webkit-text-fill-color: white;
    }

    &::before {
      opacity: 0 !important;
    }
  }
}

.v-carousel__controls__item {
  width: 50%;
  color: #616161 !important;
  opacity: 1 !important;
}
</style>