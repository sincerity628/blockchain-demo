const sha256 = require('crypto-js/sha256');

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class  Block {
  constructor(timestamp, transaction, prevHash = '') {
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.transaction = transaction;
    // changeable
    this.random = 0;

    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(this.prevHash + this.timestamp + JSON.stringify(this.transaction) + this.random).toString();
  }

  mine(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(0)) {
      this.random ++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);

  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createNewBlock()];
    this.difficulty = 3;
    this.miningAward = 100;
    this.transactionQueue = [];
  }

  createNewBlock() {
    return new Block('1576067366730', [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  mineTheTransactionQueue(awardAddress) {
    let block = new Block(Date.now(), this.transactionQueue);
    block.prevHash = this.getLatestBlock().hash;
    block.hash = block.calculateHash();

    block.mine(this.difficulty);
    console.log('mining success.');

    this.chain.push(block);
    this.transactionQueue = [
      new Transaction(null, awardAddress, this.miningAward)
    ];
  }

  addTransaction(transaction) {
    this.transactionQueue.push(transaction);
  }

  getBalence(address) {
    let balence = 0;

    for(const block of this.chain) {
      for(const trans of block.transaction) {
        if(address === trans.from) {
          balence -= trans.amount;
        }

        if(address === trans.to) {
          balence += trans.amount;
        }
      }
    }

    return balence;
  }

  isChainValid() {
    for(let i = 0; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let prevBlock = this.chain[i - 1];

      // rehash it to specify if it is being changed.
      if(currentBlock.calculateHash() !== currentBlock.hash) {
        console.log('warning! The block(' + i + ') has been changed.');
        return false
      };

      // if the currentBlock is point to the prevBlock
      if(i > 0 && currentBlock.prevHash !== prevBlock.hash) {
        console.log('warning! the block(' + i + ') is not connected with the block(' + (i - 1) + ').');
        return false;
      }

      // check the original block
      let originBlock = JSON.stringify(this.createNewBlock());
      if(JSON.stringify(this.chain[0]) != originBlock) {
        console.log('warning! The block(0) has been changed.');
        return false;
      }
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
