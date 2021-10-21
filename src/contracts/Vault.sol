// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "./AUDStablecoin.sol";

contract Vault {        

    string public name = "Vault";
    uint256 private ETH_VALUE = 4000;
    address public owner;
    
    AUDStablecoin public audStablecoin;                        

    mapping(address => uint256) public collateralAmount;
    mapping(address => uint256) public audCoinAmount;
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function transfer(address _to, uint256 _amount) public returns (bool success) {                        
        require((((collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender]) / ETH_VALUE) > _amount, 'User cannot withdraw more collateralized value than its have');
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool success) {        
        require((((collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender]) / ETH_VALUE) > _amount, 'User cannot withdraw more collateralized value than its have');
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    constructor(AUDStablecoin _audStablecoin) {
        audStablecoin = _audStablecoin;
        owner = msg.sender;
    }

    function deposit() payable public {
        //require(msg.value == _amount);
        collateralAmount[msg.sender] = collateralAmount[msg.sender] + msg.value;        
    }

    function getCollateralAmount() public view returns (uint256) {
        return collateralAmount[msg.sender];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function generateAUDCoin(uint256 _amount) public {        
        require(_amount > 0, "amount cannot be 0");
        require(((collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender]) >= _amount, "Cannot generate more AUD than collateral allow.");
        
        audStablecoin.mint(msg.sender, _amount);        
        audCoinAmount[msg.sender] = audCoinAmount[msg.sender] + _amount;
    }

    function getAUDCAvailable() public view returns (uint256) {        
        return (collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender];
    }

    function getPossibleAUDC(uint _ether_amount) public view returns (uint256) {
        return _ether_amount * ETH_VALUE;
    }

    function getAUDAmount() public view returns (uint256) {
        return audCoinAmount[msg.sender];
    }

    function getNotUsedCollateral() public view returns (uint256) {        
        
        return (((collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender]) / ETH_VALUE);
    }    

    function withdrawEthAvailable(uint _amount) public {
        require(_amount > 0, 'Amount might be greater than zero');
        require((((collateralAmount[msg.sender] * ETH_VALUE) - audCoinAmount[msg.sender]) / ETH_VALUE) > _amount, 'User cannot withdraw more collateralized value than its have');

        transfer(msg.sender, _amount);
        collateralAmount[msg.sender] = collateralAmount[msg.sender] - _amount;        
    }
}