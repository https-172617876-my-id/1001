const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Konfigurasi
const PTERO_API_KEY = 'ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z'; // Ganti dengan API Key kamu
const PTERO_URL = 'https://kenja-ganteng.kenjaapublik.my.id/';

// Axios instance dengan konfigurasi API Pterodactyl
const ptero = axios.create({
  baseURL: PTERO_URL,
  headers: {
    'Authorization': PTERO_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'Application/vnd.pterodactyl.v1+json'
  }
});

// Endpoint utama relay
app.post('/api/relay', async (req, res) => {
  const { action, payload } = req.body;

  try {
    if (action === 'create_user') {
      const response = await ptero.post('/users', payload);
      return res.json(response.data);
    }

    if (action === 'create_server') {
      const response = await ptero.post('/servers', payload);
      return res.json(response.data);
    }

    return res.status(400).json({ error: '❌ Aksi tidak dikenali.' });
  } catch (error) {
    console.error('[ERROR]', error.response?.data || error.message);
    return res.status(500).json({
      errors: error.response?.data || { message: error.message }
    });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 relay.js berjalan di port ${PORT}`);
});
