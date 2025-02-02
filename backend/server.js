
// server.js

const axios = require("axios");          // For making HTTP requests to Python service
require("dotenv").config();              // Load .env file
const express = require("express");      
const cors = require("cors");            
const { createClient } = require("@supabase/supabase-js"); // Supabase client

const app = express();
app.use(cors());                         // Enable CORS
app.use(express.json());                 // Middleware to parse JSON

require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const axios = require("axios");

const cors = require("cors");
app.use(cors());


// Import supabase-js
const { createClient } = require("@supabase/supabase-js");


// ✅ Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.locals.supabase = supabase;          // Make Supabase accessible globally

// ✅ Import and Mount Auth Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// 🗑️ Removed redundant blockchain route (add back when needed)
// const blockchainRoutes = require('./routes/blockchain');
// app.use('/blockchain', blockchainRoutes);

// ✅ Route to Handle QR Code Scanning
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

app.locals.supabase = supabase;

// Route to handle QR scanning request
app.post("/api/qr-scan", async (req, res) => {
  const { image_path } = req.body; // Frontend sends the image path

  try {
    // Sending request to Python microservice
    const response = await axios.post("http://localhost:5000/scan-qr", {
      image_path,
    });
    res
      .status(200)
      .json({ message: "QR code scanned successfully!", data: response.data });
  } catch (error) {
    console.error("Error communicating with Python service:", error.message);
    res.status(500).json({ error: "Failed to scan QR code." });
  }
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const blockchainRoutes = require("./routes/blockchain");
app.use("/blockchain", blockchainRoutes);

// Root route for testing

app.get("/", (req, res) => {
  res.send("Hello from Express + Supabase + QR Scanner!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
