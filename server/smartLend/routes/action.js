fs = require('fs')
var express = require('express');
var solc = require('solc');
var router = express.Router();

var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
//var abi = [];
//var address = "";
//var smartLend = web3.eth.contract(abi).at(address);

var source = fs.readFileSync('../../smartLend.sol', 'utf8').toString();
var output = solc.compile(source, 1);

const bytecode = output.contracts[':smartLend'].bytecode;
const abi = JSON.parse(output.contracts[':smartLend'].interface);

var smartLend;
var accos;
web3.eth.getAccounts(function(error, accounts) {

    var contract = new web3.eth.Contract(abi);
    accos = accounts;
    console.log("create smartLend from accounts[0]: " + accounts[0])

    contract.deploy({data: '0x' + bytecode}).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000000'
    }, function(error, transactionHash) {
        if(error){
            console.log("error: " + error)
        }
    })
    .on('transactionHash', function(transactionHash){ 
        console.log("transactionHash: " + transactionHash)
    })
    .then(function(newContractInstance){
        smartLend = newContractInstance;
        console.log("newContractInstance.options.address: " + newContractInstance.options.address) // instance with the new contract address
    });

});



/* GET action page. */

//获取Available Accounts
router.get('/accounts', function(req, res, next) {
    web3.eth.getAccounts(function(error, accounts) {
        res.send(accounts);
    });
});


//创建借条
router.get('/creatLend/:from/:to', function(req, res, next) {
    const from = req.params.from
    const to = req.params.to
    smartLend.methods.creatLend(to, "accept", "creditName", "creditId", "debitName", "debitId", 12345, 54321, 3333333, 100, 200).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});

//借方确认
router.get('/confirmLend/:isConfirmed/:from', function(req, res, next) {
    const isConfirmed = req.params.isConfirmed
    const from = req.params.from
    smartLend.methods.confirmLend(isConfirmed).call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//转账到账户
router.get('/addMoney/:from', function(req, res, next) {
    const from = req.params.from
    smartLend.methods.addMoney().send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })

});

//检查账户余额
router.get('/checkBalance/:from', function(req, res, next) {
    const from = req.params.from
    smartLend.methods.checkBalance().call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//检查待还款余额
router.get('/checkLend/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.checkLend(id).call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//还款
router.get('/payLoan/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.payLoan(id).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});

//逾期还款完成或到期之前还款完成或逾期超过两年未追溯
router.get('/closeLend/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.closeLend(id).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});


module.exports = router;
