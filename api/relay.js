export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end("Only POST allowed");

  const { username, plan } = req.body;

  const specs = {
    "1gb-v2": { ram: 1000, disk: 1000, cpu: 40 },
    "2gb-v2": { ram: 2000, disk: 2000, cpu: 60 },
    "unlimited-v2": { ram: 0, disk: 0, cpu: 0 }
  };

  const config = {
    domainV2: "https://kenja-ganteng.kenjaapublik.my.id",
    apikeyV2: "ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z",
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

  try {
    const userRes = await fetch(config.domainV2 + "/api/application/users", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.apikeyV2,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: username + "@gmail.com",
        username,
        first_name: username,
        last_name: "Server",
        password: username + "123",
        language: "en"
      })
    });

    const user = await userRes.json();
    if (user.errors) return res.status(400).json({ error: user.errors[0].detail });

    const userId = user.attributes.id;

    const eggRes = await fetch(`${config.domainV2}/api/application/nests/${config.nestidV2}/eggs/${config.eggV2}`, {
      headers: {
        Authorization: "Bearer " + config.apikeyV2,
        "Content-Type": "application/json"
      }
    });
    const egg = await eggRes.json();
    if (egg.errors) return res.status(400).json({ error: egg.errors[0].detail });

    const serverRes = await fetch(config.domainV2 + "/api/application/servers", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.apikeyV2,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: username + " Server",
        user: userId,
        egg: parseInt(config.eggV2),
        docker_image: config.dockerImage,
        startup: egg.attributes.startup,
        environment: config.environment,
        limits: {
          memory: specs[plan].ram,
          swap: 0,
          disk: specs[plan].disk,
          io: config.io,
          cpu: specs[plan].cpu
        },
        feature_limits: config.feature_limits,
        deploy: {
          locations: [parseInt(config.locV2)],
          dedicated_ip: false,
          port_range: []
        }
      })
    });

    const server = await serverRes.json();
    if (server.errors) return res.status(400).json({ error: server.errors[0].detail });

    res.status(200).json({
      message: "Panel created successfully",
      user: user.attributes,
      server: server.attributes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
      }
o
