async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deloying contracts with the accounts :", deployer.address);

  console.log("Account balance before contract deployment:", (await deployer.getBalance()).toString());

  const SurveyFactory = await ethers.getContractFactory("SurveyFactory");
  const surveyFactory = await SurveyFactory.deploy("1000000000");
  await surveyFactory.deployed();

  console.log("Survey Factory address :", surveyFactory.address);
  console.log("Account balance after contract deployment:", (await deployer.getBalance()).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
