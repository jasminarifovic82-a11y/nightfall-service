import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userRes.data;

    // Save user info in cookie
    res.setHeader("Set-Cookie", [
      `discordId=${user.id}; Path=/`,
      `discordName=${user.username}; Path=/`
    ]);

    res.writeHead(302, { Location: "/" });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
}