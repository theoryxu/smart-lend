var express = require('express');
var router = express.Router();

/* GET action page. */

//创建借条
router.get('/creatLend', function(req, res, next) {
    res.send('creatLend');
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
