var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('created by AndyBeHere theoryxu and boomstar');
});

module.exports = router;
