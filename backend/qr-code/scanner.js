const express = require("express");
const router = express.Router();

router.post("/qr-scan", (req, res) => {
  const { data, latitude, longitude } = req.body;
  console.log("Received QR Data:", data, latitude, longitude);

  res.status(200).json({ message: "QR code received successfully!" });
});

router.post("/qr-scan", (req, res) => {
  console.log("QR-Scan Route Hit"); // Add this line
  const { data, latitude, longitude } = req.body;
  console.log("Received QR Data:", data, latitude, longitude);
  res.status(200).json({ message: "QR code received successfully!" });
});

module.exports = router;
