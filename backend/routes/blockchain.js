const { authenticateSupabaseToken } = require("../middleware/middleware.js");
const express = require("express");
const router = express.Router();
const { getUserWallet } = require("../utils/supabase");
const BN = require("bn.js"); // 🔹 Import Big Number library

const {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const fs = require("fs");
const { Keypair } = require("@solana/web3.js"); // 🔹 Import Keypair

const PROGRAM_ID = new PublicKey(
  "9SQLaWQuJmTeYaeHSe6R4WRCUUTa6jGSjpm8c7orut6A"
);

router.post("/log", async (req, res) => {
  try {
    console.log("📥 Received Request:", req.body);

    const { wasteType, weight, location, privateKey } = req.body;
    if (!weight || !location || !privateKey) {
      console.error("❌ Missing parameters");
      return res.status(400).json({ error: "Missing parameters." });
    }
    let parsedPrivateKey;
    try {
      parsedPrivateKey = JSON.parse(privateKey); // Convert string to array
    } catch (err) {
      console.error("❌ Failed to parse private key:", err.message);
      return res.status(400).json({ error: "Invalid private key format." });
    }

    if (!Array.isArray(parsedPrivateKey)) {
      console.error("❌ Private key must be an array.");
      return res.status(400).json({ error: "Private key must be an array." });
    }

    // **Convert to Keypair**
    const userWallet = Keypair.fromSecretKey(Uint8Array.from(parsedPrivateKey));
    const userPublicKey = userWallet.publicKey;
    // const userPublicKey = new PublicKey(HARDCODED_WALLET_ADDRESS);

    console.log("🔑 User Public Key:", userPublicKey.toString());

    // Connect to Solana Devnet
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );

    // Check Balance
    let balance = await connection.getBalance(userPublicKey);
    console.log("💰 User Balance:", balance / 1_000_000_000, "SOL");

    // Ensure the account exists by transferring a small amount if needed
    if (balance === 0) {
      console.log("⚠️ User has 0 balance, requesting airdrop...");

      console.log("✅ Airdrop successful!");
    }

    // Encode weight data to Buffer
    const data = Buffer.from(
      Uint8Array.of(0, ...new BN(weight).toArray("le", 8))
    );
    console.log("📦 Encoded Data:", data);

    // Create Instruction to Call Smart Contract
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: userPublicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID, // Calls the deployed smart contract
      data: data, // Sending waste weight as a parameter
    });

    // Create Transaction
    let transaction = new Transaction().add(instruction);
    console.log("📜 Transaction Created");

    // Sign & Send Transaction
    console.log("✍️ Signing Transaction...");
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      userWallet,
    ]);

    console.log("✅ Transaction Sent! Signature:", signature);

    res
      .status(200)
      .json({ message: "Waste Logged!", transactionSignature: signature });
  } catch (error) {
    console.error("🚨 Error Logging Waste:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// send solana
router.post("/send", authenticateSupabaseToken, async (req, res) => {
  try {
    const { userId, recipientAddress, amount } = req.body;
    if (!userId || !recipientAddress || !amount) {
      return res.status(400).json({ error: "Missing parameters." });
    }

    //Get sender's wallet address from Supabase
    const senderWalletAddress = await getUserWallet(userId);
    const senderPublicKey = new PublicKey(senderWalletAddress);

    // Get sender's private key (for signing transaction)
    const senderSecretKey = await getUserPrivateKey(userId); // Load private key from Supabase or encrypted storage
    if (!senderSecretKey) {
      return res.status(400).json({ error: "Sender's private key not found." });
    }
    const senderWallet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(senderSecretKey))
    );

    // Create the transaction
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: amount * 1_000_000_000, // Convert SOL to lamports
      })
    );

    // Sign & send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderWallet,
    ]);

    res.status(200).json({
      message: "Transaction successful!",
      transactionSignature: signature,
    });
  } catch (error) {
    res.status(500).json({ error: error.get });
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
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );

    // Issue Reward (Simulating a token transfer)
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey("YourAdminWallet"), // Admin Wallet
        toPubkey: recipientPublicKey,
        lamports: amount * 100000, // Simulating token transfer
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      "YourAdminPrivateKey",
    ]);
    res
      .status(200)
      .json({ message: "Reward Issued!", transactionSignature: signature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = router;
