const express = require("express");
const router = express.Router();

const { Web3 } = require("web3");

async function sendEth(senderPublic, senderPrivate, receiverPublic, amount) {
  const w3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/e65c23a9d95d4d78bd30120b9b0eab1c"
    )
  );

  const address1 = Web3.utils.toChecksumAddress(senderPublic);

  const address2 = Web3.utils.toChecksumAddress(receiverPublic);

  try {
    const nonce = await w3.eth.getTransactionCount(address1, "latest");

    const tx = {
      nonce: nonce,
      to: address2,
      from: address1,
      value: w3.utils.toWei(amount, "ether"),
      gas: 21000,
      gasPrice: w3.utils.toWei("40", "gwei"),
    };

    // Sign the transaction with the private key
    const signedTx = await w3.eth.accounts.signTransaction(tx, senderPrivate);

    // Send the signed transaction
    const receipt = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log("Transaction Hash:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("Transaction Error:", error);
  }
}

// send eth
router.post("/send", async (req, res) => {
  const { senderPublic, senderPrivate, receiverPublic, amount } = req.body;

  await sendEth(senderPublic, senderPrivate, receiverPublic, amount);

  res.status(200).json({ message: "Transaction sent successfully" });
});

router.post("/scan/:userId/:pinId", async (req, res) => {
  const userId = req.params.userId;
  const pinId = req.params.pinId;

  const supabase = req.app.locals.supabase;

  const userResponse = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId);

  const pinResponse = await supabase.from("pin").select("*").eq("id", pinId);

  const user = userResponse.data[0];
  const pin = pinResponse.data[0];

  const senderPublic = user.publicKey;
  const senderPrivate = user.privateKey;

  const pinCreatorResponse = await supabase
    .from("profile")
    .select("*")
    .eq("id", pin.userId);

  const pinCreator = pinCreatorResponse.data[0];

  const receiverPublic = pinCreator.publicKey;

  sendEth(senderPublic, senderPrivate, receiverPublic, 0.1);

  // increase the numVisits

  const { data, error } = await supabase
    .from("pin")
    .update({ numVisits: pin.numVisits + 1 })
    .eq("id", pinId)
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ "Success": data.user });
  }
});

router.post("/balance", async (req, res) => {
  const { senderPublic } = req.body;

  const w3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/e65c23a9d95d4d78bd30120b9b0eab1c"
    )
  );

  const address1 = Web3.utils.toChecksumAddress(senderPublic);

  async function getBalance() {
    try {
      const balance = await w3.eth.getBalance(address1);

      res.status(200).json(Number(balance) / 1e18);
      return balance;
    } catch (error) {
      console.error("Balance Error:", error);
    }
  }

  getBalance();
});

module.exports = router;
