const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// GANTI DENGAN MILIKMU
const PANEL_URL = 'https://kenja-ganteng.kenjaapublik.my.id/'; // HARUS HTTPS!
const API_KEY = 'ptla_ciMjgQ3JNtpomlFwyoMlCiCAK0I4P8H0e0KrYN3kLf2'; // Application API Key

app.use(bodyParser.json());

async function createUser(payload) {
  try {
    const res = await axios.post(`${PANEL_URL}/api/application/users`, {
      email: payload.email,
      username: payload.username,
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return res.data;
  } catch (error) {
    console.error("❌ createUser error:", error.response?.data || error.message);
    throw new Error(JSON.stringify(error.response?.data || { message: "Gagal buat user" }));
  }
}

async function createServer(payload) {
  try {
    const res = await axios.post(`${PANEL_URL}/api/application/servers`, {
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
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    return res.data;
  } catch (error) {
    console.error("❌ createServer error:", error.response?.data || error.message);
    throw new Error(JSON.stringify(error.response?.data || { message: "Gagal buat server" }));
  }
}

app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;

  if (!action || !payload) {
    return res.status(400).json({ error: "Request tidak lengkap!" });
  }

  try {
    let data;

    if (action === 'create_user') {
      data = await createUser(payload);
    } else if (action === 'create_server') {
      data = await createServer(payload);
    } else {
      return res.status(400).json({ error: "Aksi tidak dikenali" });
    }

    return res.json(data);
  } catch (err) {
    console.error("❌ relay error:", err.message);
    try {
      return res.status(500).json({ errors: JSON.parse(err.message) });
    } catch {
      return res.status(500).json({ errors: { message: err.message } });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 relay.js running on http://localhost:${PORT}`);
});
