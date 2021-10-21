// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;
import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AUDStablecoin is ERC20 {
    
    address public admin;

    constructor() ERC20("AUD Stable Coin", "AUDC") {
        _mint(msg.sender, 10000 * 10 ** 2);
        admin = msg.sender;
    }
    
    function mint(address to, uint256 amount) external {                
        _mint(to, amount);
    }

    function burn(uint256 amount) external {        
        require(msg.sender == admin, "Only admin");
        _burn(msg.sender, amount);
    }
}
