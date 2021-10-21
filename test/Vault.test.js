const { expect } = require('chai');
const web3 = require('web3');

const AUDStablecoin = artifacts.require("AUDStablecoin");
const Vault = artifacts.require("Vault");

const getValueOfTokensInEther = async (tokensAmount) => {
    return await web3.utils.toWei(tokensAmount, 'Ether');
}

const ETH_VALUE = 4000
let accounts

contract('Vault', (accs) => {
  accounts = accs
})

// eslint-disable-next-line no-undef

function parseBN(bn) {
    return parseFloat(new web3.utils.BN(bn).toString())
}

const _name = "Vault"        

let audStablecoin
let vault

before(async () => {
    // Load contracts
    audStablecoin = await AUDStablecoin.new();
    vault = await Vault.new(audStablecoin.address);                
})

describe("Token attributes", () => {
    it('should has the correct name', async () => {   
        let instance = await Vault.deployed()         
        const name = await instance.name()            
        expect(name).equal(_name)
    })
})

describe("Token features", () => {

    it('should allow user to deposit some ether for Vault', async () => {            
        let instance = await Vault.deployed()
        
        const amount = 1

        console.log("AMOUNT: ",amount)

        await instance.deposit({ from: accounts[1], value: amount})        
        
          
        const collateralAmoun = await instance.getCollateralAmount({ from:  accounts[1] })
        const vaultBalance = await instance.getBalance({ from:  accounts[1] })                                
        
        // expect(new web3.utils.BN(collateralAmoun).toString()).equal(amount)       
        // expect(new web3.utils.BN(vaultBalance).toString()).equal(amount)

        expect(parseBN(collateralAmoun)).equal(amount)       
        expect(parseBN(vaultBalance)).equal(amount)
                              
    })

    it('should allow user to know how amount will receive by some collateral value', async () => {
        let instance = await Vault.deployed()                

        const eth_amount = 10                
        
        const possibleAUDC = await instance.getPossibleAUDC(eth_amount)
                
        expect(parseBN(possibleAUDC)).equal(eth_amount*ETH_VALUE)
    })

    it('should allow user to know how amount will receive by your collateral amount', async () => {
        let instance = await Vault.deployed()                
        
        const collateralAmoun = await instance.getCollateralAmount({ from:  accounts[1] })
        const audcAvailable = await instance.getAUDCAvailable({ from: accounts[1] })

        console.log("collateralAmoun: ",new web3.utils.BN(collateralAmoun).toString())
        console.log("AVAILABLE: ",new web3.utils.BN(audcAvailable).toString())
        const audcAvailableCalc = parseBN(collateralAmoun) * ETH_VALUE
        expect(audcAvailableCalc).equal(parseBN(audcAvailable))
    })
        
    it('should allow user to get some AUDC', async () => {
        let instance = await Vault.deployed()                
                
        const wantedCoins = 2000
        
        instance.generateAUDCoin(wantedCoins, { from:  accounts[1] })

        const collateralAmoun = await instance.getCollateralAmount({ from:  accounts[1] })
        const audAmount = await instance.getAUDAmount({ from:  accounts[1] })

        const audcAvailable = parseBN(await instance.getAUDCAvailable({ from: accounts[1] }))

        const audcAvailableCalc = (parseBN(collateralAmoun) * ETH_VALUE) - parseBN(audAmount)                
        
        expect(audcAvailable).equal(audcAvailableCalc)        
    })

    it('should allow user to get rest of AUDC', async () => {
        let instance = await Vault.deployed()                
        
        const wantedCoins = 1000
        
        instance.generateAUDCoin(wantedCoins, { from:  accounts[1] })

        const collateralAmoun = await instance.getCollateralAmount({ from:  accounts[1] })
        const audAmount = await instance.getAUDAmount({ from:  accounts[1] })

        const audcAvailable = parseBN(await instance.getAUDCAvailable({ from: accounts[1] }))

        const audcAvailableCalc = (parseBN(collateralAmoun) * ETH_VALUE) - parseBN(audAmount)        
        
        expect(audcAvailable).equal(audcAvailableCalc)        
    })

    /**
     * TODO: assert error
     */
    // it('should block user to get more AUDC than its have', async () => {
    //     let instance = await Vault.deployed()                
        
    //     const wantedCoins = 2000
                            
    //     expect(await instance.generateAUDCoin(wantedCoins, { from:  accounts[1] })).to.throw(
    //         new Error()
    //     )                                    
        
    // })

    // it('should allow user to see the not used collateral value', async () => {
    //     let instance = await Vault.deployed()

    //     const notUsedCollateral = await instance.getNotUsedCollateral({ from:  accounts[1] })        
    //     console.log(notUsedCollateral)
        
    //     const calcNotUsedCollateral = (parseBN(await instance.getAUDCAvailable({ from: accounts[1] })) / ETH_VALUE)

    //     expect(parseBN(notUsedCollateral)).equal(calcNotUsedCollateral)
        
    // })

    // it('should allow user to withdraw the not used collateral value', async () => {
    //     let instance = await Vault.deployed()
        
    //     const wantedCoins = 1000
        
    //     const collateralAmounBefore = await instance.getCollateralAmount({ from:  accounts[1] })
    //     instance.withdrawCollateralAvailable(wantedCoins, { from:  accounts[1] })

    //     const collateralAmounAfter = await instance.getCollateralAmount({ from:  accounts[1] })
    //     expect(parseBN(collateralAmounAfter))
    //     const audAmount = await instance.getAUDAmount({ from:  accounts[1] })

    //     const audcAvailable = parseBN(await instance.getAUDCAvailable({ from: accounts[1] }))

    //     const audcAvailableCalc = (parseBN(collateralAmoun) * ETH_VALUE) - parseBN(audAmount)        
        
    //     expect(audcAvailable).equal(audcAvailableCalc)        
    // })

})