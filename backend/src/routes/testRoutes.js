// backend/src/routes/testRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const router = express.Router();

// MongoDB connection status
router.get('/test/mongo', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const map = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ readyState: state, status: map[state] || state });
});

// Gemini test: GET /test/gemini?prompt=Your%20text
router.get('/test/gemini', async (req, res) => {
  const prompt = req.query.prompt || 'Hello from backend test';
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY not set in .env' });
  }

  try {
    // ✅ Correct model name for your account
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    
    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    res.json({ success: true, output: text || response.data });
    
  } catch (err) {
    console.error('Gemini test error:', err?.response?.data || err.message);
    res.status(500).json({ success: false, error: err?.response?.data || err.message });
  }
});

module.exports = router;