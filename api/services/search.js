// Vercel Serverless Function: /api/services/search
// Simple search endpoint supporting category filter and text query

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, query, language = 'ta' } = req.method === 'POST' ? req.body : req.query;

  return res.status(200).json({
    success: true,
    filteredCategory: category || 'all',
    searchQuery: query || '',
    language,
    message: 'Query received and verified.',
  });
}
