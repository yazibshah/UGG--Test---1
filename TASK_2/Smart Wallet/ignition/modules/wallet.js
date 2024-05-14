const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m) => {
  const wallet = m.contract("Wallet");
  
  return { wallet };
});

module.exports = TokenModule;