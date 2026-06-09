export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return res.status(500).json({ error: 'MISTRAL_API_KEY not set on server' });
  try {
    const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify(req.body),
    });
    return res.status(r.status).json(await r.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
