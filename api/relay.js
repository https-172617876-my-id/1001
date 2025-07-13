({
  domainV2: "https://kenja-ganteng.kenjaapublik.my.id", // Panel Pterodactyl host
  apikeyV2: "apixxx",                                   // Application API Key (server creation)
  capikeyV2: "pltaxxx",                                 // Client API Key (jika diperlukan)
  eggV2: "15",                                           // Egg ID (misal: nodejs, python, dll)
  nestidV2: "5",                                         // Nest ID (kategori egg)
  locV2: "1",                                            // Lokasi server (ID location Pterodactyl)
  dockerImage: "ghcr.io/parkervcp/yolks:nodejs_18",     // Docker image default
  environment: {                                        // Environment variables default
    INST: "npm",
    USER_UPLOAD: "0",
    AUTO_UPDATE: "0",
    CMD_RUN: "npm start"
  },
  feature_limits: {
    databases: 5,
    backups: 5,
    allocations: 5
  },
  io: 500, // IO priority default
  node: 2, // Nomor node (opsional buat tampil di UI)
  info: {
    masaAktif: "30 Hari",
    garansi: "15 Hari (1x Replace)",
    catatan: "Jangan gunakan script DDoS di panel"
  }
})
