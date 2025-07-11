const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Konfigurasi Pterodactyl
const API_KEY = "Bearer ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z"; // Ganti dengan API key Application kamu
const API_URL = "https://kenja-ganteng.kenjaapublik.my.id/api/application";

const headers = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
  Accept: "Application/vnd.pterodactyl.v1+json"
};

const endpoints = {
  create_user: "/users",
  create_server: "/servers"
};

// Endpoint utama
app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;

  const endpoint = endpoints[action];
  if (!endpoint) {
    return res.status(400).json({ success: false, error: "❌ Invalid action" });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");

    const data = isJSON ? await response.json() : { raw: await response.text() };

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "❌ API Error",
        details: data
      });
    }

    if (!data.attributes) {
      return res.status(500).json({
        success: false,
        error: "❌ Missing attributes in response",
        raw: data
      });
    }

    return res.status(200).json({ success: true, data });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "❌ Internal relay error",
      message: err.message
    });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Relay server running on http://localhost:${PORT}/api/relay`);
});
