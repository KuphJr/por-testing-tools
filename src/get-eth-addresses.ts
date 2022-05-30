import fs from 'fs'
import Web3 from 'web3'

const web3 = new Web3(new Web3.providers.HttpProvider(''))

let blockNum = 14870349

let run = async () => {
  let addresses: Record<string, boolean> = {}
  let addressCount = 0

  while (true) {
    let blck = blockNum++
    let block = await web3.eth.getBlock(blck)
    if (!block)
      break
    if (addressCount >= 12000)
      break

    console.log('block', blck, 'transactions', block.transactions.length)
    for(let i = 0; i < block.transactions.length; i++) {
      let tx = await web3.eth.getTransaction(block.transactions[i])
      if (parseInt(tx.value) > 0 && tx.to) {
        addresses[tx.to] = true
        addressCount++
      }
    }
    console.log(addressCount)
  }

  let addressArr = []
  for (const address in addresses) {
    addressArr.push(address)
  }
  fs.writeFileSync('valid-eth-addresses.json', JSON.stringify(addressArr))
}

run()