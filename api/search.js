/**
 * SCOUT — Gemini API Proxy (optional)
 * If GEMINI_API_KEY is set as a Vercel env var, this proxies requests server-side.
 * Otherwise the browser calls Gemini directly using the user's own key.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY not set on server' });

  try {
    const { contents, generationConfig } = req.body;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const r = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig }),
    });
    return res.status(r.status).json(await r.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
