const SHA256 = require('crypto-js/sha256')

// Represent one block of data
class Block {

    // index - indicates position of this block in the entire blockchain
    // timestamp - when this block was created
    // data - data this block holds, e.g. can be a transaction details 
    // {sender: 'x', receiver: 'y', amount: '100.0'}
    // previousHash - the hash of the previuos block in the chain
	constructor(index, timestamp, data, previousHash = '') {
      this.index = index
      this.timestamp = timestamp
      this.data = data
      this.previousHash = previousHash
      this.hash = this.calculateHash()
	}

	// Calculate hash of this block using SHA256 algorithm
	calculateHash() {
		return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString()
	}
}

// Represent a chain of blocks
class Blockchain {

	constructor() {
		this.chain = [this.createGenesisBlock()]
	}

	// Create the first block of the chain, i.e. the genesis block
	createGenesisBlock() {
		return new Block(0, "03/31/2018", "Genesis block", 0)
	}

	// Add a new block to the chain
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.hash = newBlock.calculateHash()
		this.chain.push(newBlock)
	}

	// Get the laast/latest block of the chain
	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	// Check if the chain is valid by comparing 
	// 1. checking if the hash of each block is intact - rule#1
	// 2. comparing the previous hash of a block to the hash of it's previous - rule#2
	// block
	isvalid() {
		for (let i = 1; i < this.chain.length; i++) {
			if (this.chain[i].hash !== this.chain[i].calculateHash())
				return false
			if (this.chain[i].previousHash !== this.chain[i-1].hash)
				return false
		}

		return true
	}
}

let coin = new Blockchain()
// adding blocks to the chain
coin.addBlock(new Block(1, "03/31/2018", {amount: 100}))
coin.addBlock(new Block(2, "03/31/2018", {amount: 200}))

console.log(JSON.stringify(coin, null, 4))
console.log("Is blockchain valid? " + coin.isvalid())

coin.chain[1].data = {amount: 1000} // tampering with the data - caught by rule 1
coin.chain[1].hash = coin.chain[1].calculateHash() // tampering with the hash - caught by rule#2
console.log("Is blockchain valid? " + coin.isvalid())
