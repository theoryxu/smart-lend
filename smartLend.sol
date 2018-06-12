pragma solidity ^0.4.23;

/*  功能规划：
		
		1.创建合约

		2.合约执行

		3.计算违约度
*/
contract smartLend {

	struct Lend {
		
		string creditName;
		string creditId;
		string debitName;
		string creditId;
		...(other info)
	}

	mapping (address=>Lend[]) creditOfLend;
	mapping (address=>Lend[]) debitOfLend;

	//创建借条
	function creatLend(address to,...all lendInfo) {

		Lend[] newLend = [...lendInfo];
		require(confirmLend(...)==1);
		creditOfLend(msg.sender).push([...all lendInfo]);
		debitOfLend(to).push([...all lendInfo]);

	}

	//借方确认——通过点击动作或者输入accept or refuse
	function confirmLend(string isConfirm) returns(uint) {

		require(keccak256(isConfirm) == keccak256("同意"));
		return 1;

	}

	//逾期还款完成或到期之前还款完成或逾期超过两年未追溯
	function closeLend() {


	}

	//
	function checkLoan() {


	}

}