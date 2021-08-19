//SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";

contract Lottery {
	// the timestamp of the drawing event
	uint public drawing;
	// the price of the ticket in DAI (100 DAI)
	uint ticketPrice = 100 ether;

    // 2. Purchasing
	address[] public purchaserIndexes;
    mapping(address => uint256) public purchasers;

	ILendingPool pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
	IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3); 
	IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

	constructor() {
        // 1. drawing
        drawing = block.timestamp + 1 weeks;
	}

	function purchase() external {
        // 2.1 Purchasing 
        dai.transferFrom(msg.sender, address(this), ticketPrice);
        require(_isNewPurchaser(msg.sender));
        purchaserIndexes.push(msg.sender);
		purchasers[msg.sender] = purchaserIndexes.length - 1;
        // 3. Earn Interest
        dai.approve(address(pool), ticketPrice);
        pool.deposit(address(dai), ticketPrice, address(this), uint16(0));
	}

	// 2.2 Purchasing
	function _isNewPurchaser(address _purchaser) private view returns(bool) {
        if (purchaserIndexes.length == 0) {
        return true;
        }
        return (purchaserIndexes[purchasers[_purchaser]] != _purchaser);
    }

	event Winner(address);

	// 4. Pick winner 
	function pickWinner() external {
		require(block.timestamp > drawing);
        uint256 _winner = _generateRandomNumber() % purchaserIndexes.length;
		emit Winner(purchaserIndexes[_winner]);
		// 5. Winner Payout
		aDai.approve(address(pool), aDai.balanceOf(address(this)));
		pool.withdraw(address(dai), aDai.balanceOf(address(this)), address(this));
		for(uint8 _i = 0 ; _i < uint8(purchaserIndexes.length) ; _i++) {
			dai.transfer(purchaserIndexes[_i], ticketPrice);	
		}
		dai.transfer(purchaserIndexes[_winner], dai.balanceOf(address(this)));
	}

	// 4.1 Pick winner
	function _generateRandomNumber() private view returns(uint) {
		return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, purchaserIndexes.length)));
    }
}
