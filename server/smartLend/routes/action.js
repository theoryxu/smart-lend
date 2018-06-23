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

web3.eth.getAccounts(function(error, accounts) {

    var contract = new web3.eth.Contract(abi);
    
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

//创建借条
router.get('/test', function(req, res, next) {
    console.log("contract.options.address: " + smartLend) // instance with the new contract address
    res.send(smartLend);
});


//创建借条
router.get('/creatLend', function(req, res, next) {
    console.log("contract.options.address: " + smartLend.options.address) // instance with the new contract address
    res.send(smartLend.options.address);
});

//借方确认
router.get('/confirmLend', function(req, res, next) {
    res.send('confirmLend');
});

//转账到账户
router.get('/addMoney', function(req, res, next) {
    res.send('addMoney');
});

//检查账户余额
router.get('/checkBalance', function(req, res, next) {
    res.send('checkBalance');
});

//检查待还款余额
router.get('/checkLend', function(req, res, next) {
    res.send('checkLend');
});

//还款
router.get('/payLoan', function(req, res, next) {
    res.send('payLoan');
});

//逾期还款完成或到期之前还款完成或逾期超过两年未追溯
router.get('/closeLend', function(req, res, next) {
    res.send('closeLend');
});


module.exports = router;
