({
  domainV2: "https://kenja-ganteng.kenjaapublik.my.id",
  apikeyV2: "apixxx", // Ganti dengan API key asli milikmu
  capikeyV2: "pltaxxx", // (Optional) client API key jika perlu
  eggV2: "15",
  nestidV2: "5",
  locV2: "1",
  dockerImage: "ghcr.io/parkervcp/yolks:nodejs_18",
  environment: {
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
  io: 500
})
