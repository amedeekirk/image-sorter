<template>
  <v-card flat color="grey-lighten-2">
    <v-tabs
        background-color="white"
    >
      <v-tab to="top">Images</v-tab>
      <v-tab to="overview">Stats</v-tab>
    </v-tabs>

    <router-view></router-view>

<!--    <v-tabs-items v-model="tab" class="pa-4 grey lighten-2">-->
<!--      <v-tab-item class="h-100">-->
<!--        <StatsPageImages></StatsPageImages>-->
<!--      </v-tab-item>-->
<!--      <v-tab-item class="h-100">-->
<!--        <StatsPageData></StatsPageData>-->
<!--      </v-tab-item>-->
<!--    </v-tabs-items>-->
  </v-card>
</template>

<script>
// import StatsPageImages from "@/components/StatsPageImages";
// import StatsPageData from "@/components/StatsPageData";
export default {
  name: "StatsPage",
  data () {
    return {
      tab: null
    }
  }
}
</script>

<style>
.h-100 {
  min-height: calc( 100vh - 60px - 48px - 32px)
}
</style>