// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";

contract CollateralGroup {
	ILendingPool pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
	IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
	IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3); 

	uint depositAmount = 10000 ether;
	address[] members;
    // 7. Security
    mapping(address => bool) permittedMembers;

	constructor(address[] memory _members) {
        // 1. Collect DAI
        for(uint8 _i = 0; _i < uint8(_members.length) ; _i++) {
            dai.transferFrom(_members[_i],address(this),depositAmount);
            members.push(_members[_i]);
            // 7.1 Security
            permittedMembers[_members[_i]] = true;
        }
        // 2. Deposit
        dai.approve(address(pool), dai.balanceOf(address(this)));
        pool.deposit(address(dai), dai.balanceOf(address(this)), address(this), uint16(0));
	}

	function withdraw() external {
        // 7.2 Security
        require(permittedMembers[msg.sender]);
		// 3. Withdraw
        aDai.approve(address(pool), aDai.balanceOf(address(this)));
        uint256 equalaDAI= aDai.balanceOf(address(this))/members.length;
        for(uint _i = 0 ; _i < uint8(members.length) ; _i++) {
            pool.withdraw(address(dai), equalaDAI, members[_i]);
        }
	}

	function borrow(address asset, uint amount) external {
        // 7.3 Security
        require(permittedMembers[msg.sender]);
        // 4. Borrow
		pool.borrow(asset, amount, 1, uint16(0), address(this));
        
        // 6. Health Factor
        (,,,,,uint256 healthFactor) = pool.getUserAccountData(address(this));
        require(healthFactor > 2 ether);

        IERC20(asset).transfer(msg.sender, amount);
        
	}

	function repay(address asset, uint amount) external {
		// 5. Repay
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(address(pool), amount);
        pool.repay(asset, amount, 1, address(this));
	}
}
