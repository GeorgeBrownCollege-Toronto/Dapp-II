const shell = require("shelljs");

const mnemonic = process.env.MNEMONIC;

module.exports = {
  istanbulReporter: ["html", "lcov"],
  onIstanbulComplete: async function (_config) {
    shell.rm("-rf", "./artifacts");
  },
  providerOptions: {
    mnemonic,
  },
  skipFiles: ["test"],
};
