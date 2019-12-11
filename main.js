const { Blockchain, Transaction } = require('./src/blockChain'); 
let beccaChain = new Blockchain();

beccaChain.addTransaction(new Transaction('Xu', 'Fei', 200));
beccaChain.addTransaction(new Transaction('Fei', 'Xu', 50));
beccaChain.addTransaction(new Transaction('Jia', 'Xu', 30));
beccaChain.addTransaction(new Transaction('Jia', 'Xu', 10));

console.log("Start the miner...");
beccaChain.mineTheTransactionQueue('becca');
console.log('The award of Xu is: ' + beccaChain.getBalence('Xu') + '.');

beccaChain.mineTheTransactionQueue('becca');
console.log('The award of Becca is: ' + beccaChain.getBalence('becca') + '.');


// console.log(JSON.stringify(beccaChain, null, 3));
