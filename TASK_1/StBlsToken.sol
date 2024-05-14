// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BlsToken.sol";


contract StBlsToken is ERC20, Ownable {
    uint8 private constant _decimals = 18; // Number of decimals
    BlsToken private _blsToken;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address blsTokenAddress) ERC20("Staked BLS", "stBLS") Ownable(msg.sender){
        _blsToken = BlsToken(blsTokenAddress);
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_blsToken.balanceOf(tx.origin) >= _amount, "Insufficient BLS token balance");

        require(_blsToken.transferFrom(tx.origin, address(this), _amount), "Transfer of BLS tokens failed");
        require(_blsToken.balanceOf(address(this)) >= _amount, "Token transfer failed");

        uint256 stBlsAmount = _amount * 10; // Mint 10 stBLS tokens for each BLS token staked
        _mint(tx.origin, stBlsAmount);

        emit Staked(tx.origin, _amount);
    }

    function unstake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(tx.origin) >= _amount, "Insufficient stBLS balance");

        uint256 blsAmount = _amount / 10; // Unstake 1 BLS token for each 10 stBLS tokens
        _burn(tx.origin, _amount);
        _blsToken.transfer(tx.origin, blsAmount);

        emit Unstaked(tx.origin, blsAmount);
    }

    
}


// https://sepolia.etherscan.io/address/0x10faab02c3b7cffde5295cd5634383643b4b83ee#writeContract //BLS token
// https://sepolia.etherscan.io/address/0x5bd6a384971be4569948ed523fef6e145dd46dae //StBls
