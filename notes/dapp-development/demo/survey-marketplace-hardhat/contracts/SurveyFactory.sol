// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "./TrustedSurvey.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Survey Marketplace
/// @author Dhruvin
/// @notice A contract that creates survey
contract SurveyFactory is Ownable {
    /// @notice Details of the survey
    /// @param owner The address of the survey creator
    /// @param id    The id of the survey
    struct SurveyDetails {
        address owner;
        uint256 id;
    }

    /// @notice Mandatory fees charged to survey creator
    uint256 public surveyCreationFees;

    /// @notice Stores all the surveys
    /// @dev Array of survey contract addresses
    address[] public surveys;

    /// @notice List of all the surveys with there corresponding creator and id
    mapping(address => SurveyDetails) public surveyOwners;

    /// @notice Logs the initiliization of the survey factory
    /// @param surveyCreationFees The mandatory fees to be paid by survey creator
    event SurveyFactoryInitialized(uint256 indexed surveyCreationFees);

    /// @notice Logs when a new survey is created
    /// @param owner The address of the survey creator
    /// @param surveyId The id of the survey
    /// @param surveyAddress The contract address of the survey creator
    event SurveyCreated(address indexed owner, uint256 indexed surveyId, address indexed surveyAddress);

    /// @notice Sets the survey creation fees
    /// @dev survey creation fees should be greater than zero
    /// @param _surveyCreationFees The value to be charged to survey creator
    constructor(
        uint256 _surveyCreationFees /*, IERC20 _token, addres _wallet*/
    ) {
        require(_surveyCreationFees > 0, "!zero fees");
        surveyCreationFees = _surveyCreationFees;
        emit SurveyFactoryInitialized(surveyCreationFees);
        // token = _token;
        // wallet = _wallet;
    }

    // function withdrawETH()) onlyOwner {
    //     payable(wallet).send(address(this).balance)
    // }

    // function withdrawToken() {
    //     IERC20(token).transfer(wallet,IERC20(token).balanceOf(address(this)))
    // }

    /// @dev Check whether the caller is not owner
    modifier notTheOwner() {
        require(msg.sender != owner(), "SurveyFactory: restricted");
        _;
    }

    /// @notice Creates a surveys with a fee. It cannot be called by the owner
    /// @dev The value of ethers sent to this function should be greater tha survey creation fees
    ///      Emits an event with survey creator's address, survey Id and survey address
    /// @return surveyId The ID of the survey
    /// @return newSurveyAddress The address of the survey contract
    function createSurvey() external payable notTheOwner returns (uint256 surveyId, address newSurveyAddress) {
        require(msg.value > surveyCreationFees, "SurveyFactory: Not enough ethers");
        // solhint-disable-next-line
        TrustedSurvey newSurvey = new TrustedSurvey{ value: msg.value - surveyCreationFees }(msg.sender);
        newSurveyAddress = address(newSurvey);
        surveys.push(newSurveyAddress);
        surveyId = surveys.length - 1;
        surveyOwners[newSurveyAddress] = SurveyDetails({ owner: msg.sender, id: surveyId });
        emit SurveyCreated(msg.sender, surveyId, newSurveyAddress);
    }

    // function createSurvey(uint _amount) external notTheOwner returns(uint surveyId, address newSurveyAddress) {
    //     IERC20(_token).transferFrom(msg.sender, address(this),_amount);
    // require(msg.value > surveyCreationFees, "SurveyFactory: Not enough ethers");
    // // solhint-disable-next-line
    // TrustedSurvey newSurvey = new TrustedSurvey{value: msg.value-surveyCreationFees}(msg.sender);
    // newSurveyAddress = address(newSurvey);
    // surveys.push(newSurveyAddress);
    // surveyId = surveys.length - 1;
    // surveyOwners[newSurveyAddress] = SurveyDetails({owner:msg.sender, id:surveyId});
    // emit SurveyCreated(msg.sender, surveyId, newSurveyAddress);
    // }

    ////////////////////////////
    //// Helper Functions //////
    ////////////////////////////

    /// @notice Retrieve the list of surveys
    /// @return address[] Array of the survey contract addresses
    function getAllSurveys() public view returns (address[] memory) {
        return surveys;
    }
}

// contract SurveyMachine {
//     function createSurveyFactory(uint256 _fees,address _token,address _wallet) {
//         new SurveyFactory(_fees,_token,_wallet)
//     }
// }
