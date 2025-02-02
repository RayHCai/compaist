const express = require("express");
const router = express.Router();

// All of our routes will be prefixed with /auth, these are for registering and logging in users
router.post("/register", async (req, res) => {
  console.log("/register called", req.body);
  const {
    email,
    password,
    firstName,
    LastName,
    privateKey,
    publicKey,
    firstBalance,
  } = req.body;

  const supabase = req.app.locals.supabase;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  const response = await supabase
    .from("profile")
    .insert([
      {
        privateKey: privateKey,
        publicKey: publicKey,
        id: data.user.id,
        firstAmount: firstBalance,
      },
    ])
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ user: data.user, profile: response.data[0] });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("/login called", req.body);
    const { email, password } = req.body;

    const supabase = req.app.locals.supabase;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const response = await supabase
      .from("profile")
      .select("*")
      .eq("id", data.user.id);

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: data.user,
      session: data.session,
      profile: response.data[0],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
