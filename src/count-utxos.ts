import axios from 'axios'
import fs from 'fs'

interface UTxO {
  address: string
  utxoCount: number
}

const main = async () => {
  const addresses = fs.readFileSync('bitcoin-addresses.txt').toString().split('\n')
  const formattedAddresses = addresses.map(addr => `addr(${addr})`)

  const data = {
    'API_key': "f61bd7a9-e23a-4b95-9f63-55b0c0abfc24",
    'jsonrpc': "2.0",
    'id': "nownodes.io",
    'method': "scantxoutset",
    'params': {"action":"start","scanobjects": formattedAddresses.slice(0, 1000) }
  }
  
  const response = await axios.post('https://btc.nownodes.io', data)

  const utxoCount: Record<string, number> = {}

  for (const utxo of response.data.result.unspents) {
    const rawAddress = utxo.desc.slice(5, utxo.desc.length - 10)
    if (!utxoCount[rawAddress])
      utxoCount[rawAddress] = 1
    else
      utxoCount[rawAddress] += 1
  }
  
  const addressesByUtxoCount: UTxO[] = []
  
  for (const address in utxoCount) {
    addressesByUtxoCount.push({ address, utxoCount: utxoCount[address] })
  }
  
  addressesByUtxoCount.sort((a, b) => { return (a.utxoCount - b.utxoCount) } )
  
  fs.writeFileSync('sortedBtcAddresses2.json', JSON.stringify(addressesByUtxoCount))
}

main()


