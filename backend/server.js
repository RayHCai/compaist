require("dotenv").config();              // Load .env file
const express = require("express");      
const cors = require("cors");            
const { createClient } = require("@supabase/supabase-js"); // Supabase client

const app = express();
app.use(cors());                         // Enable CORS
app.use(express.json());                 // Middleware to parse JSON

const mapRoutes = require("./routes/map");


// ✅ Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.locals.supabase = supabase;          // Make Supabase accessible globally

// ✅ Import and Mount Auth Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// ✅ Root Route for Testing

app.locals.supabase = supabase;

// ✅ Import and Mount Routes
const blockchainRoutes = require("./routes/blockchain");
app.use("/blockchain", blockchainRoutes);

app.use("/map", mapRoutes);

// ✅ Root Route for Testing
app.get("/", (req, res) => {
  res.send("Hello from Express + Supabase + QR Scanner!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
