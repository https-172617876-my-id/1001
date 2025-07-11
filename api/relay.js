const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const API_KEY = "Bearer ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z"; // ganti sesuai milikmu
const API_URL = "https://kenja-ganteng.kenjaapublik.my.id/api/application";

const headers = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
  Accept: "Application/vnd.pterodactyl.v1+json"
};

const routes = {
  create_user: "/users",
  create_server: "/servers"
};

app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;
  const endpoint = routes[action];

  if (!endpoint) {
    return res.status(400).json({ success: false, error: "Invalid action" });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const type = response.headers.get("content-type") || "";
    const isJson = type.includes("application/json");
    const data = isJson ? await response.json() : { raw: await response.text() };

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Pterodactyl API error",
        details: data
      });
    }

    if (!data.attributes) {
      return res.status(500).json({
        success: false,
        error: "Missing attributes",
        raw: data
      });
    }

    return res.json({ success: true, data });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Relay Crash",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ relay.js ready on http://localhost:${PORT}/api/relay`));
