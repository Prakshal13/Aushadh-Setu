import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import inventoryRoutes from './routes/inventory.js';
import visionRoutes from './routes/vision.js';
import surveillanceRoutes from './routes/surveillance.js';
import forecastRoutes from './routes/forecast.js';
import climateRoutes from './routes/climate.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads directory exists (local only)
if (!process.env.VERCEL) {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (e) {}
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/surveillance', surveillanceRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/climate', climateRoutes);

// Root landing page (avoids "Cannot GET /" when opening localhost:5001 in browser)
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Aushadh Setu API Gateway</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1.25rem; border: 1px solid #334155; max-width: 480px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
            .pill { display: inline-block; background: rgba(20, 184, 166, 0.15); color: #2dd4bf; border: 1px solid rgba(20, 184, 166, 0.3); padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1.25rem; }
            h1 { font-size: 1.5rem; color: #f8fafc; margin: 0 0 0.5rem 0; font-weight: 800; }
            p { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.75rem; }
            a.btn { display: inline-flex; align-items: center; justify-content: center; background: #0d9488; color: white; font-weight: 700; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 0.75rem; font-size: 0.9rem; transition: background 0.15s ease; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.3); }
            a.btn:hover { background: #14b8a6; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="pill">Backend API Live • Port 5001</span>
            <h1>Aushadh Setu API Service</h1>
            <p>You have accessed the backend API server. The interactive web application interface runs on port 5173.</p>
            <a href="http://localhost:5173" class="btn">Open Web App on Port 5173 &rarr;</a>
          </div>
        </body>
      </html>
    `);
  }
  res.json({
    status: 'ACTIVE',
    system: 'Aushadh Setu Backend API',
    frontend: 'http://localhost:5173',
    version: '1.0.0-phase1',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'Aushadh Setu Intelligence Grid',
    version: '1.0.0-phase1',
    timestamp: new Date().toISOString(),
  });
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Aushadh Setu API] Backend server running on http://localhost:${PORT}`);
  });
}

