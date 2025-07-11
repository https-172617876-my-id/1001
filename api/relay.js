const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const API_KEY = "Bearer ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z";
const API_URL = "https://kenja-ganteng.kenjaapublik.my.id/";

const headers = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
  Accept: "Application/vnd.pterodactyl.v1+json"
};

const endpointMap = {
  create_user: "/users",
  create_server: "/servers"
};

app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;

  const endpoint = endpointMap[action];
  if (!endpoint) {
    return res.status(400).json({ error: "❌ Invalid action." });
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

    if (!data || !data.attributes) {
      return res.status(500).json({
        success: false,
        error: "Response missing expected 'attributes'",
        raw: data
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal relay error",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 relay.js running on http://localhost:${PORT}/api/relay`);
});
