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

  // pin id
  const newId = uuidv4();

  QRCode.toDataURL(
    // `codes/${newId}.png`,
    `${process.env.BACKEND_URL}/blockchain/scan/${userId}/${newId}`,
    async function (err, url) {
      let blob = await fetch(url).then((r) => r.blob());
      const supabase = req.app.locals.supabase;

      const response = await supabase.storage
        .from("codes")
        .upload(`codes/${newId}.png`, blob, {
          cacheControl: "3600",
          upsert: false,
        });

      const { data, error } = await supabase
        .from("pin")
        .insert([
          {
            name: name,
            lat: lat,
            lng: lng,
            userId: userId,
            id: newId,
            qrCode: response.data.path,
            numVisits: 0,
          },
        ])
        .select();

      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ "Pin created successfully": data.user });
      }
    }
  );
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

router.post("/getQR", async (req, res) => {
  const { pinId } = req.body;
  const supabase = req.app.locals.supabase;

  const { data, error } = await supabase
    .from("pin")
    .select("*")
    .eq("id", pinId);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res
      .status(200)
      .json(
        `https://vwdwawbkaxontmxkfvwr.supabase.co/storage/v1/object/public/codes/${data[0].qrCode}`
      );
  }
});

module.exports = router;
