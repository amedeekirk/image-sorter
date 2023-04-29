<template>
  <div class="voting-wrapper">
    <v-main v-if="concludedVoting" class="pt-12 px-4 grey lighten-2">
      <v-row style="height: calc(100% - 60px)" v-if="!error">
        <v-col class="d-flex justify-center" cols="12">
          Voting has concluded, thank you for your participation!
        </v-col>
        <v-col class="d-flex justify-center" cols="12">
        <span>
          Please check the <a href="/analytics/top">top images page</a> for the final results.
        </span>
        </v-col>
      </v-row>
    </v-main>
    <v-main v-else class="pt-2 px-4 grey lighten-2">
      <v-row style="height: calc(100% - 60px)" v-if="!error">
        <template v-if="!isMobile">
          <v-col cols="6">
            <image-card ref="img1" :imgSrc="image1" @submitVote="submitVote(0)"></image-card>
          </v-col>
          <v-col cols="6" class="mb-12 mb-md-0">
            <image-card ref="img2" :imgSrc="image2" @submitVote="submitVote(1)"></image-card>
          </v-col>
        </template>
        <v-col cols="12" v-else>
          <mobile-image-card :imgSrc="[image1, image2]" @submitVote="submitVote($event)"></mobile-image-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12" class="d-flex justify-center mt-16">
          <v-img max-width="50vw" src="../../src/assets/sad-fumo.jpg"></v-img>
        </v-col>
        <v-col cols="12" class="d-flex justify-center text-center">
          <div class="red--text text-center">{{ error }}</div>
        </v-col>
        <v-col cols="12" class="d-flex justify-center text-center">
          <div>There was an error with the API request. Please refresh, or yell at XY if it persists.</div>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import ImageCard from "@/components/image-card";
import MobileImageCard from "@/components/mobile-image-card";
import axios from "axios";
import EventBus from "../bus"

export default {
  name: "VotingPage",
  components: {
    ImageCard,
    MobileImageCard
  },
  beforeMount() {
    this.getDuel()
  },
  data() {
    return {
      error: false,
      image1: null,
      image2: null,
      uuid: null,
      preload1: null,
      preload2: null,
      preloadUuid: null,
      imgHistory: [],
      concludedVoting: false,
    }
  },
  created() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('keypress', this.onKeyPress);
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.onKeyPress);
    window.removeEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  },
  watch: {
    imgHistory: {
      deep: true,
      handler(val) {
        EventBus.$emit('BusUpdateHistory', val)
      }
    }
  },
  methods: {
    onKeyPress(e) {
      if (e.charCode === 49 && !e.repeat) {
        this.$refs.img1.clickOverride()
        // this.submitVote(0)
      }
      if (e.charCode === 50 && !e.repeat) {
        this.$refs.img2.clickOverride()
        // this.submitVote(1)
      }
    },
    getDuel() {
      if (this.preload1 !== null && this.preload2 !== null) {
        this.image1 = this.preload1
        this.image2 = this.preload2
        this.uuid = this.preloadUuid
        this.getPreload()
      } else {
        axios.get(`${process.env.VUE_APP_API_BASE_URL}/duel`).then((res) => {
          if (res.data.status === 'accepted') {
            this.concludedVoting = true
          } else {
            this.image1 = res.data.message.images[0]
            this.image2 = res.data.message.images[1]
            this.uuid = res.data.message.uuid

            if (this.preload1 === null && this.preload2 === null) {
              this.getPreload()
            }
          }
        }).catch((err) => {
          this.error = err
        })
      }
    },
    getPreload() {
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/duel`).then((res) => {
        if (res.data.status === 'success') {
          const img1 = new Image()
          const img2 = new Image()
          this.preload1 = res.data.message.images[0]
          this.preload2 = res.data.message.images[1]
          this.preloadUuid = res.data.message.uuid
          // Attempt to preload images
          img1.src = this.preload1
          img2.src = this.preload2
        } else {
          this.preloadUuid = null
          this.preload1 = null
          this.preload2 = null
        }
      }).catch((err) => {
        this.error = err
      })
    },
    submitVote: function (winner) {
      let win = null
      let loss = null
      const i1 = this.image1
      const i2 = this.image2
      this.image1 = null
      this.image2 = null
      if (winner === 0) {
        win = i1.split('/').pop()
        loss = i2.split('/').pop()
      } else {
        win = i2.split('/').pop()
        loss = i1.split('/').pop()
      }
      this.imgHistory.unshift({
        winner: win,
        loser: loss
      })
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/results`, {
        winner: win,
        loser: loss,
        uuid: this.uuid
      }).then(() => {
        this.winner = null
        this.loser = null

        //Track total vote count
        if (this.$cookies.isKey('totalVotes')) {
          const votes = this.$cookies.get('totalVotes')
          this.$cookies.set('totalVotes', parseInt(votes) + 1)
        } else {
          this.$cookies.set('totalVotes', 1)
        }

        this.getDuel()
      }).catch((err) => {
        this.error = err
      })
    }
  }
}
</script>

<style scoped lang="scss">
.voting-wrapper {
  height: calc(100vh - 60px);
  height: calc(var(--vh, 1vh) * 100 - 60px);
  overflow: hidden;
}

@media only screen and (max-height: 400px) {
  .voting-wrapper {
    overflow: auto !important;
  }
}
</style>