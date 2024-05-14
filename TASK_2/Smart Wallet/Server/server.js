// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { setPasscode, verifyPasscode } = require('./passcode');
const ABI=require("../artifacts/contracts/Wallet.sol/Wallet.json")

const app = express();
app.use(bodyParser.json());

// Connect to Ethereum network (localhost for development)
const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Update with your RPC endpoint

// Wallet contract instance
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Update with your deployed contract address
const walletContract = new ethers.Contract(contractAddress, ABI.abi, provider);
const private_key="";
const user_PrivateKey=new ethers.Wallet(Private_key,provider);
const user_address="0x55A76042391Fbe0a268B6903B9caA2E974AE35c8"

// Protect wallet route with authentication
app.get('/wallet', ensureAuthenticated, async (req, res) => {
    try {
        const balance = await walletContract.balances(user_address);
        res.json({ balance: ethers.formatEther(balance) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Deposit funds endpoint
app.post('/deposit', ensureAuthenticated, async (req, res) => {
    try {
        const { amount } = req.body;
        const tx = await walletContract.connect(user_PrivateKey).deposit({ value: ethers.parseEther(amount) });
        await tx.wait();
        res.json({ message: 'Deposit successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Withdraw funds endpoint
app.post('/withdraw', ensureAuthenticated, async (req, res) => {
    try {
        const { amount } = req.body;
        const tx = await walletContract.connect(user_PrivateKey).withdraw(ethers.parseEther(amount));
        await tx.wait();
        res.json({ message: 'Withdrawal successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Set passcode endpoint
app.post('/set-passcode', (req, res) => {
    const { passcode } = req.body;
    setPasscode(passcode);
    res.json({ message: 'Passcode set successfully' });
});

// Verify passcode endpoint
app.post('/verify-passcode', (req, res) => {
    const { passcode } = req.body;
    const isValidPasscode = verifyPasscode(passcode);
    if (isValidPasscode) {
        res.json({ message: 'Passcode verified successfully' });
    } else {
        res.status(401).json({ error: 'Invalid passcode' });
    }
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
