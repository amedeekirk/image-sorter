<template>
  <v-dialog
      v-model="dialog"
      width="500"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        <v-icon @click="dialog=false">mdi-close</v-icon>
        About
      </v-card-title>

      <v-card-text class="mt-4">
        <div>Thanks for using the this image sorter! There are over 20,000 images available. You will be presented with two at a time. Please pick your favorite between them!</div>
        <h3 class="mt-4">Shortcuts</h3>
        <div>
          <span class="font-weight-bold">1</span>: Vote for the left image
        </div>
        <div>
          <span class="font-weight-bold">2</span>: Vote for the right image
        </div>
        <div>Click on an image to open it at full size on a new tab</div>

        <h3 class="mt-4">Inappropriate images</h3>
        <div>
          If you come across an image that is one of the following:
          <ol>
            <li>Inappropriate (lewd, racist imagery, or similar)</li>
            <li>Does not load</li>
            <li>Is a duplicate of the other image in the duel</li>
          </ol>
          Please send me the url of the image(s) on discord at null. I have hand sorted as best as I could, but there bound to be things that I missed.
        </div>
        <h3 class="mt-4">Disclaimer/Contact/Kudos</h3>
        <div>Images are not my own. Please contact me on discord if you experience persistent issues or suggestions. Thank you to the PPals community for the images</div>
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
  name: "help-modal",
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