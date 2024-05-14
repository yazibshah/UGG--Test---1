// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address public owner;
    mapping(address => uint) public balances;
    mapping(address => bool) public authorizedUsers;

    event Deposit(address indexed account, uint amount);
    event Withdrawal(address indexed account, uint amount);

    constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Sender is not authorized");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function addAuthorizedUser(address user) public onlyOwner {
        authorizedUsers[user] = true;
    }

    function removeAuthorizedUser(address user) public onlyOwner {
        authorizedUsers[user] = false;
    }
}
