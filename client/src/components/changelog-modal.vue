<template>
  <v-dialog
      v-model="dialog"
      width="500"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        <v-icon @click="dialog=false">mdi-close</v-icon>
        Changelog
      </v-card-title>

      <v-card-text class="mt-4">

        <h3 class="mt-4">v1.6.0</h3>
        7/28/2022
        <div>
          <ul>
            <li>Activated 'Elimination Mode', which deletes the worst-voted image every 10 minutes</li>
            <li>Updated stats page graph</li>
            <li>Updated stats page 'average vote' decimals</li>
            Welcome to the (probably) third to last update! Elimination mode has been turned on, to increase the impactfulness of votes. Over the next 200 days, the worst image will be deleted until we reach our most curated finalists. Happy voting!
          </ul>
        </div>

        <h3 class="mt-4">v1.5.0</h3>
        4/21/2022
        <div>
          <ul>
            <li>Added most voted images page + routing/backend logic</li>
            <li>Added analytics page + routing/backend logic</li>
            <li>Reworked header icons</li>
            <li>Changed duel selection icons to sometimes grab less-seen images</li>
            <li>New changelog modal that no one is gonna read on purpose</li>
            <br/>
          </ul>
        </div>

        <h3 class="mt-4">v1.5.0</h3>
        4/15/2022
        <div>
          <ul>
            <li>Refactored mobile voting to a single-card system</li>
            <li>Updated history and added a total votes counter</li>
            <li>Removed mobile footer</li>
            <li>Version info moved to help modal for now</li>

          </ul>
        </div>

        <h3 class="mt-4">v1.4.0</h3>
        4/14/2022
        <div>
          <ul>
            <li>Set up Google Analytics</li>
          </ul>
        </div>

        <h3 class="mt-4">v1.3.0</h3>
        4/13/2022
        <div>
          <ul>
            <li>Changes to API and database to prevent duplicated submissions</li>
          </ul>
        </div>

        <h3 class="mt-4">v1.2.0</h3>
        4/13/2022
        <div>
          <ul>
            <li>Updated help popup to include text about reporting bad images</li>
            <li>Added history button to see images that you voted on during your current session</li>
            <li>Added some logic to attempt to preload images for the next duel to cut down on loading time</li>
            <li>Added footer to mobile with version to help with the issue of voting for bottom card needing two taps on iOS</li>
            <li>Header text and font size change</li>

          </ul>
        </div>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "changelog-modal",
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    dialog (val) {
      if (!val) {
        this.$emit('close', val)
      }
    },
    show (val) {
      if (this.dialog !== val) {
        this.dialog = val
      }
    }
  },
  data () {
    return {
      dialog: false,
    }
  }
}
</script>