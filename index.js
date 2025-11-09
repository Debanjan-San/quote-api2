 
const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const QuoteGenerate = require("./quote-generate.js"); 

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

// 🟢 Create instance of quote generator
const quote = new QuoteGenerate("6230570474:AAEc3BHqR-MIENRVt3EHqKTEFnFd54ROHhA");

// 🎨 Default design settings
const SIZE = 1024; // square canvas
const BUBBLE_COLOR = "#303030"; // solid chat bubble
const BACKGROUND_IMAGE =
  "https://i.pinimg.com/564x/d3/6b/cc/d36bcceceaa1d390489ec70d93154311.jpg";

// 🧩 POST /quote/generate
app.post("/quote/generate", async (req, res) => {
  try {
    const message = req.body;

    if (!message || !message.from || !message.text) {
      return res.status(400).json({ error: "Invalid message payload" });
    }

    // 🖼️ Load wallpaper
    const bgImage = await loadImage(BACKGROUND_IMAGE);

    // 🎨 Create square canvas
    const baseCanvas = createCanvas(SIZE, SIZE);
    const ctx = baseCanvas.getContext("2d");

    // Draw background (cover style)
    const aspect = bgImage.width / bgImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (aspect > 1) {
      drawHeight = SIZE;
      drawWidth = SIZE * aspect;
      offsetX = -((drawWidth - SIZE) / 2);
      offsetY = 0;
    } else {
      drawWidth = SIZE;
      drawHeight = SIZE / aspect;
      offsetX = 0;
      offsetY = -((drawHeight - SIZE) / 2);
    }

    ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);

    // 🧠 Generate the quote bubble using your class
    const quoteCanvas = await quote.generate(
      BUBBLE_COLOR, // solid bubble
      BUBBLE_COLOR, // both same => no gradient
      message,
      512,
      512,
      2,
      "apple"
    );

    // Center it
    const x = (SIZE - quoteCanvas.width) / 2;
    const y = (SIZE - quoteCanvas.height) / 2;
    ctx.drawImage(quoteCanvas, x, y);

    // Convert to PNG buffer
    const buffer = baseCanvas.toBuffer("image/png");

    // Return image as response
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error generating quote:", err);
    res.status(500).json({ error: "Failed to generate quote", details: err.message });
  }
});

// 🟢 Start server
const PORT = process.env.PORT || 4887;
app.listen(PORT, () => {
  console.log(`✅ Quote generator API running on http://localhost:${PORT}/quote/generate`);
});
