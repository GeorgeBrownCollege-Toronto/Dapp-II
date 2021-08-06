const { task } = require("hardhat/config");

task("deploy-surveyfactory", "deploys the survey factory contract")
  .addParam("signeraddress", "address of the signer")
  .addParam("surveycreationfees", "survey creation fees in ETH")
  .setAction(async ({ signeraddress, surveycreationfees }, hre) => {
    
    // await hre.run("accounts");

    const signer = await hre.ethers.getSigner(
      hre.ethers.utils.getAddress(signeraddress)
    );

    const fees = hre.ethers.utils.parseUnits( surveycreationfees.toString() ,unit = "ether") 

    const SurveyFactory = await ethers.getContractFactory("SurveyFactory");
    const surveyFactory = await SurveyFactory.connect(signer).deploy(fees);
    await surveyFactory.deployed();


    const initSurveyCreationFees = await surveyFactory.surveyCreationFees();

    const surveyFactoryOwner = await surveyFactory.owner();

    console.log("Survey Factory Contract Address : ", surveyFactory.address)
    console.log("Survey creation fees in ETH : ", hre.ethers.utils.formatEther(initSurveyCreationFees.toString()))
    console.log("Survey Factory owner : ", surveyFactoryOwner)

  });
