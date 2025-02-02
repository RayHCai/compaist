require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// ✅ Middleware
app.use(cors());                         // Enable CORS
app.use(express.json());                 // Middleware to parse JSON

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
app.locals.supabase = supabase;

// ✅ Import and Mount Routes
const authRoutes = require("./routes/auth");
const blockchainRoutes = require("./routes/blockchain");
app.use("/blockchain", blockchainRoutes);

app.use("/auth", authRoutes);


// ✅ Route to Handle QR Code Scanning
app.post("/api/qr-scan", async (req, res) => {
  const { image_path } = req.body; // Frontend sends the image path

  try {
    const response = await axios.post("http://localhost:5000/scan-qr", { image_path });
    res.status(200).json({
      message: "✅ QR code scanned successfully!",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error communicating with Python service:", error.message);
    res.status(500).json({ error: "Failed to scan QR code." });
  }
});

// ✅ Additional QR Code Route
app.post("/api/qr-code", async (req, res) => {
  const { image_path } = req.body;

  try {
    const response = await axios.post("http://localhost:5000/api/scan-qr", { image_path });
    res.status(200).json({
      message: "✅ QR code scanned successfully!",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error communicating with Python service:", error.message);
    res.status(500).json({ error: "Failed to scan QR code." });
  }
});

// ✅ Root Route for Testing
app.get("/", (req, res) => {
  res.send("Hello from Express + Supabase + QR Scanner!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
