// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlsToken is ERC20, Ownable {
    uint256 private constant _initialSupply = 1000000 * 10 ** 18; // Initial total supply of BLS tokens
    uint8 private constant _decimals = 18; // Number of decimals

    constructor() ERC20("BLS Token", "BLS") Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply);
    }

}

