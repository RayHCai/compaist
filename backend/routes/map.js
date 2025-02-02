const express = require("express");
const router = express.Router();

const QRCode = require("qrcode");

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

router.post("/pin", async (req, res) => {
  const { name, lat, lng, userId } = req.body;

  const newId = uuidv4();

  QRCode.toFile(
    `codes/${newId}.png`,
    `${process.env.FRONTEND_URL}/scan/${userId}/${newId}`,
    function (err, url) {
      console.log(err, url);
    }
  );

  const supabase = req.app.locals.supabase;

  // set the file to a variable
  let imageId;

  (async function() {
    const { data, error } = await supabase.storage
    .from("codes")
    .upload(`codes/${newId}.png`, {
      cacheControl: "3600",
      upsert: false,
    });

    imageId = data.id;
  })();

  const { data, error } = await supabase
    .from("pin")
    .insert([
      {
        name: name,
        lat: lat,
        lng: lng,
        userId: userId,
        id: newId,
        qrCode: imageId,
        numVisits: 0
      },
    ])
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ "Pin created successfully": data.user });
  }
});

router.post("/getPin", async (req, res) => {
  const { userId } = req.body;

  const supabase = req.app.locals.supabase;

  const { data, error } = await supabase
    .from("pin")
    .select("*")
    .eq("userId", userId);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json(data);
  }
});

module.exports = router;
