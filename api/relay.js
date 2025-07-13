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
    apikeyV2: "apixxx",
    eggV2: "15",
    nestidV2: "5",
    locV2: "1",
    dockerImage: "ghcr.io/parkervcp/yolks:nodejs_18"
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

    res.status(200).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
