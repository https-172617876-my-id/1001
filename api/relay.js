export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, payload } = req.body;

  const PTERO_API_KEY = "ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z";
  const PTERO_URL = "https://kenja-ganteng.kenjaapublik.my.id/";

  const headers = {
    'Authorization': PTERO_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'Application/vnd.pterodactyl.v1+json'
  };

  const endpoints = {
    create_user: "/users",
    create_server: "/servers"
  };

  const endpoint = endpoints[action];
  if (!endpoint) {
    return res.status(400).json({ error: "❌ Invalid action" });
  }

  try {
    const response = await fetch(`${PTERO_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const raw = await response.text();
      return res.status(500).json({ error: "Server did not return JSON", raw });
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "Request failed", details: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Relay error", message: err.message });
  }
}
