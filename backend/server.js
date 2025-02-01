// server.js

require("dotenv").config(); // Load .env file
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

// Import supabase-js
const { createClient } = require("@supabase/supabase-js");

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Make supabase accessible to your routes via app locals (optional but neat)
app.locals.supabase = supabase;

// Body parsing middleware (for JSON form data)
app.use(express.json());

// Import and mount the auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// const blockchainRoutes = require('./routes/blockchain');
// app.use('/blockchain', blockchainRoutes, authenticateSupabaseToken);


// Example root route
app.get("/", (req, res) => {
  res.send("Hello World from Express + Supabase!");
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
