require("@nomicfoundation/hardhat-toolbox");


// const INFURA_API_KEY = "1c2959aaaaea48b29dcbd39b41844ef0";

const PRIVATE_KEY = "";


module.exports = {
  solidity: "0.8.23",
  networks: {
    SEPOLIA: {
      url: `https://sepolia.infura.io/v3/054db487dcd34b428893a1a277fc2c70`,
      accounts: [PRIVATE_KEY]
    },
     goerli: {
      url: `https://goerli.infura.io/v3/5e353b0ef7194418a7ab3ba91f8a9c90`,
      accounts: [PRIVATE_KEY]
    }  
  }
};