export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const username = body.u;

    const r = await fetch(
      "https://auth.roblox.com/v1/usernames/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          birthday: "2001-01-01"
        })
      }
    );

    const j = await r.json();
    const available = j.code === 0;

    if (available) {
      await fetch(process.env.WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "✅ Available: `" + username + "`"
        })
      });
    }

    res.status(200).json({ available });
  } catch (e) {
    res.status(200).json({ available: false });
  }
}
