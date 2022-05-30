import axios from 'axios';
import type { AxiosResponse } from 'axios'
import ethAddresses from './valid-eth-addresses.json'
import process from 'process'
import fs from 'fs'

const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

// validate generated requests from http.json to ensure the adapter replies successfully
const testAdapterRequests = async () => {
  const URL = process.env.URL || 'http://localhost:8081/'
  const DELAY = process.env.DELAY ? parseInt(process.env.DELAY) : 5000

  const round = [1, 10, 100, 1000, 2500, 5000, 7500, 10000]
  let lastUsedIndex = 0
  let i = 0
  for (const numberOfAddressesToQuery of round) {
    const requestBody = {
      "id": "1",
      "data": {
        "indexer": "eth_balance",
        "protocol": "list",
        "addresses": ethAddresses.slice(lastUsedIndex, lastUsedIndex + numberOfAddressesToQuery),
        "confirmations": 5
      }
    }
    lastUsedIndex += numberOfAddressesToQuery
    try {
      console.log(`Trying with ${numberOfAddressesToQuery} addresses\n`)
      fs.appendFileSync('results.txt', `Trying with ${numberOfAddressesToQuery} addresses\n`)
      const startTime = Date.now()
      const response = await axios.post(URL, requestBody)
      console.log(`Elapsed time in ms: ${Date.now() - startTime}`)
      fs.appendFileSync('results.txt', `Elapsed time in ms: ${Date.now() - startTime}\n`)
      console.log('###################################\n' + JSON.stringify(response.data) + '\n###################################\n')
      if (response.data.providerStatusCode > 299 || response.data.providerStatusCode < 200)
        throw Error(`Provider status code: ${response.data.providerStatusCode}`)
    } catch (untypedError) {
      const error = untypedError as Error
      console.log(`❌ Error on request: ${JSON.stringify(requestBody.data)}`)
      console.log(error.message)
    }
    await waitFor(DELAY)
    i++
  }
}

testAdapterRequests()