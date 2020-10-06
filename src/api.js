const url = 'https://api.coincap.io/v2'

const getAssets = async () => {
  const response = await fetch(`${url}/assets?limit=20`)
  const data = await response.json()
  return data.data
}

const getAsset = async coin => {
  const response = await fetch(`${url}/assets/${coin}`)
  const data = await response.json()
  return data.data
}

export default {
  getAssets,
  getAsset
}
