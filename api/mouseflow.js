export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path = '', ...query } = req.query;
  const params = new URLSearchParams(query).toString();
  const url = `https://api-us.mouseflow.com/${path}${params ? '?' + params : ''}`;

  const auth = Buffer.from(
    `${process.env.MOUSEFLOW_EMAIL}:${process.env.MOUSEFLOW_TOKEN}`
  ).toString('base64');

  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
