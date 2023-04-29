<template>
  <v-app class="app-wrapper">
    <v-app-bar
        color="primary"
        dark
        max-height="60"
    >
      <div class="d-flex align-center text-h6">
        <router-link to="/" class="route">
          XY's Image Sorter
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <history-modal :imgHistory="imgHistory"></history-modal>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list nav>

            <v-list-item to="/">
              <v-list-item-icon>
                <v-icon>mdi-image-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Voting</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/analytics/top">
              <v-list-item-icon>
                <v-icon>mdi-trophy-award</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Top Posts</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/analytics/overview">
              <v-list-item-icon>
                <v-icon>mdi-chart-bar</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Stats</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <hr/>

            <v-list-item @click.stop="showHelpDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-help</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Help</v-list-item-title>
              </v-list-item-content>
              <help-modal :show="showHelpDialog" @close="showHelpDialog = false"></help-modal>
            </v-list-item>

            <v-list-item @click.stop="showChangelogDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-file-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Changelog</v-list-item-title>
              </v-list-item-content>
              <changelog-modal :show="showChangelogDialog" @close="showChangelogDialog = false"></changelog-modal>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <router-view></router-view>
  </v-app>
</template>

<script>
import HelpModal from "@/components/help-modal";
import EventBus from './bus'
import HistoryModal from "@/components/history-modal";
import ChangelogModal from "@/components/changelog-modal";

export default {
  name: 'App',

  components: {
    ChangelogModal,
    HelpModal,
    HistoryModal,
  },

  data() {
    return {
      imgHistory: [],
      showHelpDialog: false,
      showChangelogDialog: false
    }
  },

  created() {
    EventBus.$on('BusUpdateHistory', (data) => {
      this.imgHistory = data
    })
  }

};
</script>

<style lang="scss">
.app-wrapper {
  background-color: #E0E0E0 !important;

  .route {
    text-decoration: none;
    color: white;
  }
}
</style>