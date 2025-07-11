export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, payload } = req.body;

  const API_KEY = "Bearer ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z";
  const API_URL = "https://kenja-ganteng.kenjaapublik.my.id/";

  const headers = {
    Authorization: API_KEY,
    "Content-Type": "application/json",
    Accept: "Application/vnd.pterodactyl.v1+json"
  };

  const endpointMap = {
    create_user: "/users",
    create_server: "/servers"
  };

  const endpoint = endpointMap[action];
  if (!endpoint) {
    return res.status(400).json({ error: "❌ Invalid action" });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const raw = await response.text();
      return res.status(500).json({ error: "Invalid JSON response", raw });
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Pterodactyl API error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Relay error",
      message: err.message
    });
  }
}
