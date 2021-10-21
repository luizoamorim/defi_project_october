/* eslint-disable no-undef */
const AUDStablecoin = artifacts.require("AUDStablecoin");
const Vault = artifacts.require("Vault");

module.exports = async function(deployer, network, accounts) {
  
  await deployer.deploy(AUDStablecoin);
  const audStablecoin = await AUDStablecoin.deployed();

  
  await deployer.deploy(Vault, audStablecoin.address);        
};
