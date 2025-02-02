const express = require("express");
const router = express.Router();

router.post("/pin", async (req, res) => {
  const { name, lat, lng, userId } = req.body;

  const supabase = req.app.locals.supabase;

  const { data, error } = await (supabase
    .from("pin")
    .insert([{
      name: name,
      lat: lat,
      lng: lng,
      id: userId,
    }])
    .select());

  console.log(data, error);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ "Pin created successfully": data.user });
  }
});

module.exports = router;
