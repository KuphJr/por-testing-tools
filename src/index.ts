import axios from 'axios'
import wbtcQuery from './wbtcQuery.json'

const url = 'https://example.com'

const instance = axios.create()

instance.interceptors.request.use((config: any) => {
    config.headers['request-startTime'] = process.hrtime()
    return config
})

instance.interceptors.response.use((response: any) => {
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    return response
})
const addresses = [
  "1zgmvYi5x1wy3hUh7AjKgpcVgpA8Lj9FA"
]

const requestAddresses = addresses.map((a: any) => { return { address: a, chainId: "mainnet", network: "bitcoin" } })
console.log(requestAddresses)

instance.post("https://adapters.main.prod.cldev.sh/por-indexer",
{
  "jobID": "1",
  "data": {
    "endpoint": "index",
    "addresses": wbtcQuery.result,
    //"addresses": requestAddresses,
    "minConfirmations": 1
  }
}
).then((response) => {
    console.log(response.data)
    console.log(`Duration: ${response.headers['request-duration']} ms`)
}).catch((error) => {
    console.error(`Error`)
})