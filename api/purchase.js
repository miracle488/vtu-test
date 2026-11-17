// api/purchase.js - Vercel Proxy Only
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const { service_type, provider_code, package_code, recipient } = req.body;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const datePart = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  const rand = Math.random().toString(36).substring(2, 10);
  const reference = `${datePart}${rand}`;
  try {
    const response = await fetch('https://app.wisesub.com.ng/api/partner/v1/purchase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WISESUB_API_KEY}`,
        'X-API-Secret': process.env.WISESUB_API_SECRET,
        'X-Environment': process.env.WISESUB_ENV || 'test',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ service_type, provider_code, package_code, recipient, reference })
    });
    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
