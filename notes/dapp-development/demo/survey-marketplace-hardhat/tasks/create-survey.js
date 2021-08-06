const { task } = require("hardhat/config");

task("create-survey", "creates new survey")
  .addParam("factory", "address of the survey factory")
  .addParam("value", "survey creation fees + reward in ETH")
  .addParam("user", "address of survey creator")
  .setAction(async ({ factory, user, value }, hre) => {
    
    const signer = await hre.ethers.getSigner(
      hre.ethers.utils.getAddress(user)
    );

    const valueInWei = hre.ethers.utils.parseUnits( value.toString() ,unit = "ether") 

    const surveyFactory = await hre.ethers.getContractAt("SurveyFactory",factory,signer)
    const tx = await surveyFactory.createSurvey({value:valueInWei})
    const receipt = await tx.wait(1);
    

    console.log("Survey Owner : ", receipt.events[1].args["owner"])
    console.log("Survey Id : ", receipt.events[1].args["surveyId"].toString())
    console.log("Survey address : ", receipt.events[1].args["surveyAddress"])

  });
