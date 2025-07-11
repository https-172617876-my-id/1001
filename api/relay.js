const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi API Pterodactyl
const PANEL_URL = "https://kenja-ganteng.kenjaapublik.my.id/"; // Ganti dengan domain panel Pterodactyl kamu
const API_KEY = "ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z"; // Ganti dengan Admin API Key Pterodactyl

app.use(bodyParser.json());

// Fungsi untuk buat user
async function createUser(payload) {
  const response = await axios.post(
    `${PANEL_URL}/api/application/users`,
    {
      email: payload.email,
      username: payload.username,
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password
    },
    {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );
  return response.data;
}

// Fungsi untuk buat server
async function createServer(payload) {
  const response = await axios.post(
    `${PANEL_URL}/api/application/servers`,
    {
      name: payload.name,
      user: payload.user,
      egg: payload.egg,
      nest: payload.nest,
      docker_image: payload.docker_image,
      startup: payload.startup,
      limits: payload.limits,
      feature_limits: payload.feature_limits,
      deploy: payload.deploy,
      environment: payload.environment
    },
    {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }
  );
  return response.data;
}

// Endpoint utama untuk relay
app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;

  try {
    if (action === "create_user") {
      const data = await createUser(payload);
      return res.json(data);
    } else if (action === "create_server") {
      const data = await createServer(payload);
      return res.json(data);
    } else {
      return res.status(400).json({ error: "Aksi tidak dikenal!" });
    }
  } catch (error) {
    const err = error.response?.data || error.message;
    return res.status(500).json({ errors: err });
  }
});

app.listen(PORT, () => {
  console.log(`✅ relay.js jalan di http://localhost:${PORT}`);
});
