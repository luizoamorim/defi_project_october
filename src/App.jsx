import React, { useEffect, useState } from 'react'
import './App.css'
import Web3 from 'web3'
import Vault from './abis/Vault.json'  


const App = () => {  

  const [account, setAccount] = useState('0x0')
  const [vault, setVault] = useState({})  
  const [audcAvaialble, setAudcAvaialble] = useState(0)
  const [ethAvailable, setEthAvailable] = useState(0)
  const [totalCollateral, setTotalCollateral] = useState(0)
  const [audcAmount, setAudcAmount] = useState(0)
    
  useEffect(() => {
    loadWeb3()
    loadBlockchainData()    
  }, [])

  const loadValues = async () => {
    setTotalCollateral(await vault.methods.getCollateralAmount().call({ from: account }))
    setAudcAmount(await vault.methods.getAUDAmount().call({ from: account }))
    setEthAvailable(await vault.methods.getNotUsedCollateral().call({ from: account }))
    setAudcAvaialble(await vault.methods.getAUDCAvailable().call({ from: account }))    
  }
  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    
    if(account.length > 0){
      setAccount(accounts[0])
    }

    const networkId = await web3.eth.net.getId()
    console.log("NETWORKID: ",networkId)
    // Load Dai Token
    const vaultData = Vault.networks[networkId]
    console.log("vaultData: ",vaultData)
    if(vaultData){      
      const vault = new web3.eth.Contract(Vault.abi, vaultData.address)      
      setVault(vault)
      // let daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call()
      // setDaiTokenBalance(daiTokenBalance.toString())      
    }else{
      window.alert("Dai Token contract not deployed to detected network")
    }    
    
  }

  const loadWeb3 = async () => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying Metamask!")
    }
  }

  const deposit = async () => {    
    await vault.methods.deposit().send({ from: account, value: window.web3.utils.toWei('1', 'ether')})
    setTotalCollateral(await vault.methods.getCollateralAmount().call({ from: account }))
    setAudcAmount(await vault.methods.getAUDAmount().call({ from: account }))
    setEthAvailable(await vault.methods.getNotUsedCollateral().call({ from: account }))
  }

  // const loadValtBalance = async () => {
  //   setVaultBalance(await vault.methods.getBalance().call({ from: account }))    
  // }

  const generateStableCoin = async () => {
    await vault.methods.generateAUDCoin(window.web3.utils.toWei('0.1', 'ether')).send({ from: account })
    setAudcAvaialble(await vault.methods.getAUDCAvailable().call({ from: account }))
    setEthAvailable(await vault.methods.getNotUsedCollateral().call({ from: account }))
  }

  const withdraw = async () => {
    await vault.methods.transfer(account, window.web3.utils.toWei('0.5', 'ether'))
  }

  return (
    <div className="App">
      <header className="App-header">        
        <h1>ETH Balance: {totalCollateral}</h1>
        <h1>ETH Available: {ethAvailable}</h1>
        <h1>AUDC Balance: {audcAmount}</h1>
        <h1>AUDC Available{audcAvaialble}</h1>        
        <button onClick={() => deposit()}>Depoist</button>        
        <button onClick={() => generateStableCoin()}>Generate AUDC</button>
        <button onClick={() => withdraw()}>Withdraw Available ETH</button>
        
      </header>
    </div>
  )
}

export default App
