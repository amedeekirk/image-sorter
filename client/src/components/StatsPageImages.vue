<template>
  <v-card flat class="grey lighten-2 pa-4">
    <v-col v-if="isLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-col>
    <v-data-iterator
        v-else
        :items="imageList"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{
          'items-per-page-options': [15, 30, 45, 60, 75]
        }">
      <template v-slot:header>
        <h3 class="mb-2">Top Rated Posts</h3>
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col
              v-for="i in props.items"
              :key="i.imgname"
              cols="12"
              sm="4"
              xl="3">
            <v-card
                elevation="4"
                height="300"
                max-height="300"
                min-height="300">
              <a :href="`https://d30qdzipuz6ou2.cloudfront.net/${i.imgname}`" target="_blank">
                <div style="height: 250px; border: 1px solid black"
                     class="d-flex justify-center align-center">
                  <v-img
                      max-height="100%"
                      contain
                      :src="`https://d30qdzipuz6ou2.cloudfront.net/${i.imgname}`"></v-img>
                </div>
              </a>
              <v-card-text :class="textObject(i)">
                <span v-if="i.updoots > 0">+</span>
                {{ i.updoots }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "StatsPageImages",
  data() {
    return {
      imageList: [],
      itemsPerPage: 15,
      isLoading: false
    }
  },
  beforeMount() {
    this.getImages()
  },
  methods: {
    getImages() {
      this.isLoading = true
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/ranking`, {params: {bottom: this.$route.path === '/analytics/bottom'}}).then((res) => {
        this.imageList = res.data.message
        this.isLoading = false
      })


    },
    textObject(i) {
      if (i.updoots > 0) {
        return 'green--text'
      }
      return 'red--text'
    }
  }
}
</script>

<style scoped>

</style>