export default function handler(req, res) {
  const redirect = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=identify`;

  res.writeHead(302, { Location: redirect });
  res.end();
}