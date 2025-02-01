// routes/blockchain.js
import { authenticateSupabaseToken } from '../middleware/middleware.js'

const express = require('express');
const router = express.Router();
const { getUserWallet } = require("../utils/supabaseUtils");
const { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = require("@solana/web3.js");



router.post("/log", authenticateSupabaseToken, async (req, res) => {

    try {
        const { userId, wasteType, weight, location } = req.body;
        if (!userId || !wasteType || !weight || !location) {
            return res.status(400).json({ error: "Missing parameters." });
        }

        // Get User's Wallet
        const userWalletAddress = await getUserWallet(userId);
        const userPublicKey = new PublicKey(userWalletAddress);

        // Connect to Solana Devnet
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // Create transaction
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userPublicKey, // User's Wallet Address
                toPubkey: new PublicKey("WasteSmartContractPublicKey"), // Replace with contract address
                lamports: 1000, // Small fee to register waste
            })
        );

        // Send transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [userPublicKey]);
        res.status(200).json({ message: "Waste Logged!", transactionSignature: signature });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// rewards for recycling
router.post("/reward", authenticateSupabaseToken, async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({ error: "Missing parameters." });
        }

        // Get User's Wallet
        const recipientWallet = await getUserWallet(userId);
        const recipientPublicKey = new PublicKey(recipientWallet);

        // Connect to Solana Devnet
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // Issue Reward (Simulating a token transfer)
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey("YourAdminWallet"), // Admin Wallet
                toPubkey: recipientPublicKey,
                lamports: amount * 100000, // Simulating token transfer
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, ["YourAdminPrivateKey"]);
        res.status(200).json({ message: "Reward Issued!", transactionSignature: signature });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
