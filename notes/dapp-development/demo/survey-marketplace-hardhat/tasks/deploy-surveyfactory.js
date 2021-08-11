const { task } = require("hardhat/config");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

task("deploy-surveyfactory", "deploys the survey factory contract")
  .addOptionalParam("signeraddress", "address of the signer")
  .addParam("surveycreationfees", "survey creation fees in ETH")
  .addParam("verify", "verify the contract on etherscan", false, boolean)
  .setAction(async ({ signeraddress, surveycreationfees, verify }, hre) => {
    // await hre.run("accounts");
    const fees = hre.ethers.utils.parseUnits(surveycreationfees.toString(), (unit = "ether"));

    const SurveyFactory = await ethers.getContractFactory("SurveyFactory");
    let surveyFactory;

    console.log("Migration started\n");
    console.log("1. Deploy survey factory");
    if (signeraddress == "" || signeraddress == undefined || signeraddress == null) {
      surveyFactory = await SurveyFactory.deploy(fees);
    } else {
      const signer = await hre.ethers.getSigner(hre.ethers.utils.getAddress(signeraddress));
      surveyFactory = await SurveyFactory.connect(signer).deploy(fees);
    }

    await surveyFactory.deployed();

    const initSurveyCreationFees = await surveyFactory.surveyCreationFees();

    const surveyFactoryOwner = await surveyFactory.owner();

    if (verify) {
      console.log("2. Verifying contracts");
      await delay(3000);
      await hre.run("verify:verify", {
        address: surveyFactory.address,
        constructorArguments: [fees.toString()],
      });
    }

    console.log("Survey Factory Contract Address : ", surveyFactory.address);
    console.log("Survey creation fees in ETH : ", hre.ethers.utils.formatEther(initSurveyCreationFees.toString()));
    console.log("Survey Factory owner : ", surveyFactoryOwner);
    console.log("\nFinished migrations");
  });
