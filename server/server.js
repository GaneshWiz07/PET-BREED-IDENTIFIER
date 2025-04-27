import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Multer setup for single image upload (field name 'file')
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /predict route
app.post('/predict', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const apiUrl = 'https://api-inference.huggingface.co/models/microsoft/resnet-50';
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'HuggingFace API key not set in environment' });
    }
    const response = await axios.post(apiUrl, req.file.buffer, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/octet-stream',
      },
    });
    // HuggingFace returns an array of predictions
    const predictions = response.data;
    if (Array.isArray(predictions) && predictions.length > 0) {
      const top = predictions[0];
      res.json({ label: top.label, score: top.score });
    } else {
      res.status(500).json({ error: 'No predictions returned' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});