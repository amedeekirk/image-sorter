<template>
  <v-dialog
      v-model="dialog"
      fullscreen
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          v-bind="attrs"
          v-on="on"
      >
        <v-icon>mdi-history</v-icon>
      </v-btn>

    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        <v-btn
            icon
            @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        History
      </v-card-title>

      <v-card-text class="mt-4">
        <h3>{{ activeEmoji }} You have voted {{ totalVotes }} times</h3>
        <hr class="my-4">

        <h3>Votes this session</h3>
        <v-data-table v-if="imgHistory.length"
                      :headers="headers"
                      :items="imgHistory"
                      disable-sort>
          <template #[`item.winner`]="{ item }">
            <a target="_blank" :href="`https://d30qdzipuz6ou2.cloudfront.net/${item.winner}`">
              {{ item.winner }}
            </a>
          </template>
          <template #[`item.loser`]="{ item }">
            <a target="_blank" :href="`https://d30qdzipuz6ou2.cloudfront.net/${item.loser}`">
              {{ item.loser }}
            </a>
          </template>

        </v-data-table>

        <h4 v-else>You haven't voted this session yet!</h4>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "history-modal",
  props: {
    imgHistory: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dialog() {
      const votes = parseInt(this.$cookies.get('totalVotes'))
      this.totalVotes = votes.toLocaleString("en-US")
      this.activeEmoji = '😄'
      if (votes > 19999) {
        this.activeEmoji = '🏆'
      }
      else if (votes > 9999) {
        this.activeEmoji = '🙀'
      }
      else if (votes > 4999) {
        this.activeEmoji = '🔥'
      }
      else if (votes > 999) {
        this.activeEmoji = '😎'
      }
    }
  },
  data() {
    return {
      activeEmoji: '',
      dialog: false,
      totalVotes: 0,
      headers: [
        {text: 'Winner', value: 'winner'},
        {text: 'Loser', value: 'loser'}
      ]
    }
  }
}
</script>
