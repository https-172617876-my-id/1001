export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, payload } = req.body;

  const API_KEY = "Bearer ptla_RKC13A19K8mEKJrJidUtlKyFZrkh1dkTqCGymPvxM5Z"; // Ganti dengan key kamu
  const API_URL = "https://kenja-ganteng.kenjaapublik.my.id/api/application";

  const headers = {
    Authorization: API_KEY,
    "Content-Type": "application/json",
    Accept: "Application/vnd.pterodactyl.v1+json"
  };

  const routes = {
    create_user: "/users",
    create_server: "/servers"
  };

  const endpoint = routes[action];
  if (!endpoint) {
    return res.status(400).json({ success: false, error: "❌ Invalid action" });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");

    const data = isJSON ? await response.json() : { raw: await response.text() };

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Pterodactyl API error",
        details: data
      });
    }

    if (!data.attributes) {
      return res.status(500).json({
        success: false,
        error: "Missing attributes",
        raw: data
      });
    }

    return res.status(200).json({ success: true, data });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Relay Error",
      message: err.message
    });
  }
}
