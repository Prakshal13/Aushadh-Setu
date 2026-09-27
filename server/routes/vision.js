import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/scan-carton', upload.single('image'), async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const file = req.file;

    // If Gemini API Key is configured, run live Multimodal Vision
    if (apiKey && file) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const fileBuffer = fs.readFileSync(file.path);
      const imagePart = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: file.mimetype || 'image/jpeg',
        },
      };

      const prompt = `
        You are a pharmaceutical inspection assistant for India's public healthcare supply chain.
        Analyze this medicine carton, box, or blister strip image and extract the following details strictly in JSON format:
        {
          "generic_name": "String (e.g. Paracetamol 500mg, Metformin 500mg, ORS IP)",
          "brand_name": "String (e.g. PCM-500, Glyciphage)",
          "batch_no": "String (e.g. B10492)",
          "mfd": "YYYY-MM or YYYY-MM-DD",
          "expiry_date": "YYYY-MM or YYYY-MM-DD",
          "quantity": Number (total tablets, bottles, or sachets in pack),
          "pack_type": "String (Strips, Bottle, Vial, Sachet)",
          "manufacturer": "String (e.g. Karnataka Antibiotics, Cipla, Govt Medical Stores)",
          "cold_chain_required": Boolean (true if 2-8 C is mentioned)
        }
        Do not wrap in markdown quotes if possible, output raw valid JSON.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      
      // Clean JSON formatting
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const extractedData = JSON.parse(cleanJson);

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      return res.json({
        success: true,
        source: 'Gemini 1.5 Flash Vision',
        data: extractedData,
      });
    }

    // High-Fidelity Fallback Simulator when no API Key is provided
    // This guarantees the frontend works seamlessly out-of-the-box
    if (file) {
      fs.unlinkSync(file.path);
    }

    // Default realistic sample based on common public health blister pack
    const demoSamples = [
      {
        generic_name: "Ringer Lactate (RL) 500ml IV Infusion",
        brand_name: "RL Infusion IP Govt Supply",
        batch_no: "RL-2024-8821",
        mfd: "2024-02-15",
        expiry_date: "2026-11-05",
        quantity: 24,
        pack_type: "Carton of 24 Bottles",
        manufacturer: "Hindustan Laboratories Ltd.",
        cold_chain_required: false
      },
      {
        generic_name: "Metformin Hydrochloride 500mg Tablets",
        brand_name: "Glyci-500",
        batch_no: "MET-2024-4410",
        mfd: "2024-03-01",
        expiry_date: "2026-11-15",
        quantity: 500,
        pack_type: "Box of 50 Strips (10 Tabs each)",
        manufacturer: "Karnataka Antibiotics & Pharmaceuticals Ltd (KAPL)",
        cold_chain_required: false
      },
      {
        generic_name: "Anti-Snake Venom (ASV) Lyophilized Vial",
        brand_name: "Polyvalent Snake Antivenom",
        batch_no: "ASV-2024-0091",
        mfd: "2024-08-01",
        expiry_date: "2026-12-01",
        quantity: 10,
        pack_type: "Box of 10 Vials",
        manufacturer: "Bharat Serums and Vaccines Ltd.",
        cold_chain_required: true
      }
    ];

    const selected = demoSamples[Math.floor(Math.random() * demoSamples.length)];

    return res.json({
      success: true,
      source: 'Aushadh Setu Vision Engine (Simulator)',
      note: 'To use live Gemini 1.5 Flash, set GEMINI_API_KEY in your .env file',
      data: selected,
    });
  } catch (error) {
    console.error('Vision OCR Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse image with Gemini Vision',
    });
  }
});

export default router;
