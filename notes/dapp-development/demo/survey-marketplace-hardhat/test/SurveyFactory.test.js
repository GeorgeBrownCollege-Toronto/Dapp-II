const { expect } = require("chai");

describe("SurveyFactory", () => {

    let factoryOwner;
    let surveyOwner;
    let SurveyFactory;
    let surveyFactory;
    let Survey

    before(async () => {
        const [addr1, addr2] = await ethers.getSigners();
        factoryOwner = addr1;
        surveyOwner = addr2;
        SurveyFactory = await ethers.getContractFactory("SurveyFactory");
        Survey = await ethers.getContractFactory("TrustedSurvey");
    })

    beforeEach(async () => {
        surveyFactory = await SurveyFactory.deploy("1000000000000000000");
    })

    describe("test cases for createSurvey()", () => {
        //test case #1
        it.only("Should be able to get survey Id and survey address of survey creator", async () => {
            const tx = await surveyFactory.connect(surveyOwner).createSurvey(
                { value: "2000000000000000000" });
            const receipt = await tx.wait();
            expect(receipt.events[1].args).to.have.property("owner");
            expect(receipt.events[1].args).to.have.property("surveyId");
            expect(receipt.events[1].args).to.have.property("surveyAddress");
        })

        //test case #2
        it("Should make the caller of createSurvey() function to be owner of survey contract", async () => {
            const tx = await surveyFactory.connect(surveyOwner).createSurvey({value:"2000000000000000000"});
            const receipt = await tx.wait();
            const surveyAddress = receipt.events[1].args["surveyAddress"];
            const survey = Survey.attach(surveyAddress);
            expect(await survey.owner()).to.equal(surveyOwner.address)
        })

        //test case #3
        it("Should not allow survey creation for free", async () => {
           await expect(surveyFactory.connect(surveyOwner).createSurvey()).to.be.reverted;
        })

        //test case #4
        it("Should not allow the factory owner to call createSurvey()", async () => {
            await expect(surveyFactory.connect(factoryOwner).createSurvey({value:"2000000000000000000"})).to.be.reverted;
        })
    })
})