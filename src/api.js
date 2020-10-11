const url = 'https://api.coincap.io/v2'

const getAssets = async () => {
  const response = await fetch(`${url}/assets?limit=20`)
  const { data } = await response.json()
  return data
}

const getAsset = async coin => {
  const response = await fetch(`${url}/assets/${coin}`)
  const { data } = await response.json()
  return data
}

const getAssetHistory = async coin => {
  const now = new Date()
  const end = now.getTime()
  now.setDate(now.getDate() - 1)
  const start = now.getTime()
  const response = await fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  )
  const { data } = await response.json()
  return data
}

export const getMarkets = async coin => {
  const response = await fetch(`${url}/assets/${coin}/markets?limit=5`)
  const { data } = await response.json()
  return data
}

export const getExchange = async id => {
  const response = await fetch(`${url}/exchanges/${id}`)
  const { data } = await response.json()
  return data
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange
}
