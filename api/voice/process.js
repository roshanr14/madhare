// Vercel Serverless Function: /api/voice/process
// Cleans speech transcript and categorizes into navigation, form-filling, or query

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript = '', language = 'ta', context = 'global' } = req.body || {};
  const cleanText = transcript.trim();

  let action = 'SEARCH';
  let target = '';

  const lower = cleanText.toLowerCase();
  if (lower.includes('முகப்பு') || lower.includes('home') || lower.includes('ghar')) {
    action = 'NAVIGATE';
    target = '/';
  } else if (lower.includes('பின்னால்') || lower.includes('back') || lower.includes('peeche')) {
    action = 'GO_BACK';
  } else if (lower.includes('உதவி') || lower.includes('help') || lower.includes('madad')) {
    action = 'HELP';
  }

  return res.status(200).json({
    success: true,
    originalText: cleanText,
    action,
    target,
    language,
    context,
  });
}
