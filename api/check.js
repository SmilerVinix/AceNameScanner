export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const username = body.u;
    if (!username) {
      return res.json({ available: false });
    }

    const robloxRes = await fetch(
      "https://auth.roblox.com/v1/usernames/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RBX-Name-Sniper"
        },
        body: JSON.stringify({
          username: username,
          birthday: "2001-01-01"
        })
      }
    );

    const data = await robloxRes.json();
    const available = data.code === 0;

    // Send webhook ONLY if available
    if (available && process.env.WEBHOOK) {
      await fetch(process.env.WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "✅ **Available Username**: `" + username + "`"
        })
      });
    }

    res.status(200).json({
      available,
      code: data.code
    });

  } catch (err) {
    res.status(200).json({ available: false });
  }
}
