<template>
    <v-card flat class="grey lighten-2 pa-4">
      <h3 class="mb-3">Stats</h3>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-text class="pb-0">Total Votes</v-card-text>
            <v-card-title v-if="stats && stats.totalVotes">{{ stats.totalVotes.toLocaleString("en-US") }}</v-card-title>
            <v-card-title v-else>
              <v-progress-circular indeterminate></v-progress-circular>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-text class="pb-0">Average Votes Per Session</v-card-text>
            <v-card-title v-if="stats && stats.averageVotes">
              {{ Number(stats.averageVotes).toLocaleString("en-US", {maximumFractionDigits: 2}) }}
            </v-card-title>
            <v-card-title v-else>
              <v-progress-circular indeterminate></v-progress-circular>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-text class="pb-0">Total Images</v-card-text>
            <v-card-title v-if="stats && stats.totalImages">{{ stats.totalImages.toLocaleString("en-US") }}</v-card-title>
            <v-card-title v-else>
              <v-progress-circular indeterminate></v-progress-circular>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Votes Over Time
              <v-spacer></v-spacer>
              <div style="max-width: 200px">
                <v-select
                    v-model="graphDateRangeSelected"
                    :items="graphDateRangeOptions"
                    outlined
                    dense
                    hide-details
                ></v-select>
              </div>
            </v-card-title>
            <v-card-text>
              <LineChartGenerator
                  :height="300"
                  :key="updateChart"
                  :chart-options="chartOptions"
                  :chart-data="chartData">
              </LineChartGenerator>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import _isEqual from 'lodash/isEqual'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'
import axios from "axios";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
)

export default {
  name: "StatsPageData",
  components: {LineChartGenerator},
  data() {
    return {
      updateChart: 0,
      stats: null,
      statsApiTimeout: null,
      graphDateRangeSelected: 'Last 7 Days',
      graphDateRangeOptions: [
          'Last 7 Days',
          'Last 30 Days',
          'All Time (Weekly)',
          'All Time (Daily)',
      ],
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    }
  },
  beforeMount() {
    this.getStats()
    this.statsApiTimeout = setInterval(() => {this.getStats()}, 15000)
  },
  beforeDestroy() {
    clearInterval(this.statsApiTimeout)
  },
  watch: {
    stats: {
      deep: true,
      handler (newVal) {
        this.updateGraph(newVal)
      }
    },
    graphDateRangeSelected: {
      handler() {
        this.updateGraph(this.stats)
      }
    }
  },
  methods: {
    getStats() {
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/stats`).then((res) => {
        this.stats = res.data.message
      })
    },

    updateGraph (newVal) {
      let selected = 'chartData7Day'
      if( this.graphDateRangeSelected === 'Last 7 Days') {
        selected = 'chartData7Day'
      } else if (this.graphDateRangeSelected === 'Last 30 Days') {
        selected = 'chartData30Day'
      } else if ( this.graphDateRangeSelected === 'All Time (Weekly)') {
        selected = 'chartDataWeekly'
      } else if ( this.graphDateRangeSelected === 'All Time (Daily)') {
        selected = 'chartData'
      }
      if (newVal[selected]) {
        let labels = []
        let data = []
        newVal[selected].forEach((day) => {
          labels.push(new Date(day.Date.replace(/-/g, "/")).toLocaleDateString('en-us', { month:"short", day:"numeric"}) )
          data.push(day.totalCount)
        })

        if (!_isEqual(this.chartData.labels, labels) || !_isEqual(this.chartData.datasets[0].data, data)) {
          this.chartData.labels = labels
          this.chartData.datasets = [{
            backgroundColor: '#1976d2',
            data: data
          }]
          this.updateChart++
        }
      }
    },
  }
}
</script>

<style scoped>


</style>