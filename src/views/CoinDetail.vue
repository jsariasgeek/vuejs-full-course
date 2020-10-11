<template>
  <div class="flex-col">
    <bounce-loader :loading="isLoading" :color="`#68d391`" :size="100" />
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            v-if="asset"
            class="w-20 h-20 mr-5"
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
          />
          <h1 class="text-5xl">
            <small class="sm:mr-2 text-gray-500"></small>
          </h1>
        </div>
        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                v-model="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? `USD` : asset.symbol}`"
              />
            </label>
          </div>
          <span class="text-xl"
            >{{ convertedResult }} {{ fromUsd ? asset.symbol : 'USD' }}</span
          >
        </div>
      </div>
      <line-chart
        class="my-10"
        colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      ></line-chart>
      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          class="border-b"
          :key="`${m.exchangeId}-${m.priceUsd}`"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :is-loading="m.isLoading"
              v-if="!m.url"
              @custom-click="getWebsite(m)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blank">{{
              m.url
            }}</a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from '@/api'
import PxButton from '../components/PxButton'

export default {
  name: 'CoinDetail',
  components: { PxButton },
  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      routeId: this.$route.params.id,
      isLoading: false,
      fromUsd: true,
      convertValue: null
    }
  },
  created() {
    this.isLoading = true
    this.getCoin().finally(() => (this.isLoading = false))
    this.getPriceHistory()
    this.getMarkets()
  },
  methods: {
    async getCoin() {
      this.asset = await api.getAsset(this.routeId)
    },
    async getPriceHistory() {
      this.history = await api.getAssetHistory(this.routeId)
    },
    async getMarkets() {
      this.markets = await api.getMarkets(this.routeId)
    },
    async getWebsite(exchange) {
      this.$set(exchange, 'isLoading', true)
      const { exchangeId } = exchange
      const { exchangeUrl } = await api.getExchange(exchangeId)
      this.$set(exchange, 'isLoading', false)
      this.$set(exchange, 'url', exchangeUrl)
    },
    toggleConverter() {
      this.fromUsd = !this.fromUsd
    }
  },
  computed: {
    min() {
      return Math.min(
        ...this.history.map(p => parseFloat(p.priceUsd).toFixed(2))
      )
    },
    max() {
      return Math.max(
        ...this.history.map(p => parseFloat(p.priceUsd).toFixed(2))
      )
    },
    avg() {
      return Math.avg(
        ...this.history.map(p => parseFloat(p.priceUsd).toFixed(2))
      )
    },
    convertedResult() {
      if (!this.convertValue) {
        return 0
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd
      return result.toFixed(4)
    }
  },
  watch: {
    $route() {
      this.getCoin()
    }
  }
}
</script>
<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
