<template>
<v-card class="grey lighten-4" :height="cardHeight" elevation="4">
  <div class="img-wrapper d-flex justify-center align-center">
  <v-progress-circular
      v-if="!imgSrc"
      :size="50"
      indeterminate>
  </v-progress-circular>
    <a class="anchor d-flex justify-center" v-else :href="imgSrc" target="_blank">
      <v-img max-width="95%" max-height="95%" contain :src="imgSrc"></v-img>
    </a>
  </div>
  <v-card-actions class="justify-center">
    <v-btn ref="btn" color="primary" dark @click="$emit('submitVote')">Vote</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  name: "image-card",
  props: {
    imgSrc: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      cardHeight: '88vh'
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  watch: {
    windowHeight(newHeight) {
      if (newHeight <= 400) {
        this.cardHeight = '100vh'
      } else {
        this.cardHeight = '88vh'
      }
    }
  },
  methods: {
    clickOverride () {
      this.ripple(this.$refs.btn.$el)
      this.$refs.btn.$el.click()
    },
    ripple ($el) {
      let ev = new Event("mousedown")
      let offset = $el.getBoundingClientRect()
      ev.clientX = offset.left + offset.width/2
      ev.clientY = offset.top + offset.height/2
      $el.dispatchEvent(ev)

      setTimeout(function() {
        $el.dispatchEvent(new Event("mouseup"))
      }, 300)
    },
    onResize() {
      this.windowHeight = window.innerHeight
    }
  }
}
</script>

<style scoped>
.img-wrapper {
  height: 80vh;
}
.anchor {
  max-width: 95%;
  max-height: 95%;
}
</style>