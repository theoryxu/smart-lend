pragma solidity ^0.4.23;
//pragma experimental ABI EncoderV2
/*  功能规划：
		
		1.创建合约

		2.合约执行

		3.计算违约度 
*/
contract smartLend {
	//除了不变的信息，还包括变动信息：
	//还款额capitalToPay、待还利息interestToPay、上一次还款时间lastTime、累积计息、已还利息interestPayed、罚息defaultRate、借条是否关闭isClosed)
	//逾期加收万5的滞纳金
	struct Lend {
		
		string creditName;
		string creditId;
		string debitName;
		string debitId;
		uint monthRate;    	//月利率————万几
		uint defaultRate;  	//违约金月利率————万几
		uint totalToPay;		
		uint capitalToPay; 	//待付本金
		uint interestToPay;//0	//待付利息
		uint startTime; 
		uint dueTime;   
		uint lastTime; //startTime
		bool isClosed; //0
	} 

	//借方和贷方的地址
	struct Address {

		address credit;
		address debit;
	}

	mapping (uint=>Address) lendToOwner;

	mapping (address=>Lend[]) creditOfLend; // 地址对应的借入款借条信息 creditOfLend[address] = [Lend(1), Lend(2),...]
	mapping (address=>Lend[]) debitOfLend;  // 地址对应的借出款借条信息
	//mapping (Lend=>Address) public lendAdress;     // 每个借条对应的借款人和贷款人
	mapping (address=>uint) balances;       // 账户余额 balances[address] = uint;
	mapping (address=>uint) creditScore;	   // 每个账户的信用积分

	Lend[] lends;
	
	Lend newLend;
	Lend toPay;

	//创建借条 前端将时间戳转化为字符串
	function creatLend(address to,string isConfirmed, string creditName, string creditId, string debitName, string debitId, uint monthRate, uint defaultRate, uint totalToPay, uint startTime, uint dueTime) {

		newLend = Lend(creditName, creditId, debitName, debitId, monthRate, defaultRate, totalToPay, totalToPay, 0, startTime, dueTime, startTime, false);

		uint id = lends.push(newLend)-1;
		lendToOwner[id] = Address(msg.sender, to);

		require(confirmLend(isConfirmed)==1);

		debitOfLend[to].push(newLend);
		creditOfLend[msg.sender].push(newLend);
	}

	//借方确认——通过点击动作或者输入accept or refuse
	function confirmLend(string isConfirmed) returns(uint) {

		require(keccak256(isConfirmed) == keccak256("accept"));
		return 1;

	}

	//转账到账户
	function addMoney() public payable {

		balances[msg.sender] += msg.value;
	}

	//检查账户余额
	function checkBalance() public returns(uint value) {

		return balances[msg.sender];
	} 

	//检查待还款余额
	function checkLend(uint id) returns(uint) {
        toPay = lends[id];
		return toPay.capitalToPay;

	}

	//modifier checkId(Lend toPay) {

	//}

	//还款
	function payLoan(uint id) payable {
		//完成转账
		toPay = lends[id];

	/*	for(uint i=0;i<=lends.length;i++) {

			if(toPay == lends[i]) {

				id = i;
			}
		}*/

		balances[msg.sender] -= msg.value;
		balances[lendToOwner[id].debit] += msg.value;
		var nowTime = now;
		//更新Lend信息

		//更新待付利息

		//未逾期
		if(nowTime-toPay.dueTime <= 0) {

			toPay.interestToPay += toPay.capitalToPay * (toPay.monthRate/(12*1000)) *(nowTime-toPay.lastTime)/(3600*24*1000);
		}

		//现已逾期，上次还款未逾期
		if(nowTime-toPay.dueTime>0 && toPay.lastTime-toPay.dueTime<=0) {

			toPay.interestToPay += toPay.capitalToPay * (toPay.monthRate/(12*1000)) *(nowTime-toPay.lastTime)/(3600*24*1000) +  toPay.capitalToPay * (toPay.defaultRate/(12*1000))*(nowTime-toPay.dueTime)/(3600*24);

			creditScore[lendToOwner[id].credit] = 600 - (toPay.capitalToPay * (nowTime-toPay.dueTime)/(toPay.totalToPay * (nowTime-toPay.startTime)));  
		}

		//上次还款已逾期 
		if(nowTime-toPay.dueTime>0 && toPay.lastTime-toPay.dueTime>0) {

			toPay.interestToPay += toPay.capitalToPay * ((toPay.monthRate+toPay.defaultRate)/(12*1000)) *(nowTime-toPay.lastTime)/(3600*24*1000);
			creditScore[lendToOwner[id].credit] = 600 - toPay.capitalToPay * (nowTime-toPay.lastTime)/(toPay.totalToPay * (nowTime-toPay.startTime)); 
		}

		//更新待付本金
		if(msg.value-toPay.interestToPay > 0) {

			toPay.interestToPay = 0;
			toPay.capitalToPay -= msg.value-toPay.interestToPay;
		}
		else {

			toPay.interestToPay -= msg.value;

		}

		 //检查是否逾期，更新信用值

	}


	//逾期还款完成或到期之前还款完成或逾期超过两年未追溯
	function closeLend(uint id) returns(uint) {

        toPay = lends[id];
        
		var nowTime = now;

		if(toPay.capitalToPay == 0 || nowTime - toPay.dueTime >= 63072000000) {

			toPay.isClosed = true;

			return 1;
		}

		return 0;
	}



}
