const express = require('express');
const router = express.Router();

// All of our routes will be prefixed with /auth, these are for registering and logging in users
  router.post('/register', async (req, res) => {

    console.log(req.body);
   

    const {email, password, firstName, LastName} = req.body;

    console.log(email, password, firstName, LastName);

    const supabase = req.app.locals.supabase;


    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    
    if (error) {
      res.status(500).json({error: error.message});
    } else {
      res.status(200).json({"User registered successfully": data.user});
    }
  });


  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const supabase = req.app.locals.supabase;
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({
        message: 'User logged in successfully',
        user: data.user,
        session: data.session,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/link-wallet", async (req, res) => {
    const { userId, walletAddress } = req.body;

    if (!userId || !walletAddress) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({ wallet_address: walletAddress })
        .eq("id", userId);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: "Wallet linked successfully", wallet: walletAddress });
});


// Get user wallet


module.exports = router;
  