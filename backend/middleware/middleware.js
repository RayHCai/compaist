const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL and Key must be provided");
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware to authenticate the Supabase token
const authenticateSupabaseToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token is missing. Access denied." });
    return;
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(403).send("Invalid or expired token");
    return;
  }

  req.user = user; // Attach user to the request object

  next(); // Proceed to the next middleware/route
};

module.exports = { authenticateSupabaseToken };
