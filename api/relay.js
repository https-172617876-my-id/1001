page = {
  domainV2: "https://kenja-ganteng.kenjaapublik.my.id",  // Ganti dengan domain panel kamu
  apikeyV2: "apixxx", // Ganti dengan API Key kamu
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
};
