var Ownable = artifacts.require("./Ownable.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var SmartLend = artifacts.require("./SmartLend.sol");


module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(SafeMath);
  deployer.link(Ownable, SmartLend);
  deployer.link(SafeMath, SmartLend);
  deployer.deploy(SmartLend);
};
