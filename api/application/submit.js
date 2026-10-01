// Vercel Serverless Function: /api/application/submit
// Secure server-side application submission handler

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

  try {
    const {
      serviceId,
      serviceTitle,
      formData = {},
      userId = 'guest-user',
    } = req.body || {};

    const { name, district, hasAadhaar, phone } = formData;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const applicationRefNumber = `SAKHI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    return res.status(200).json({
      success: true,
      applicationId: applicationRefNumber,
      serviceId,
      serviceTitle,
      status: 'submitted',
      applicantName: name.trim(),
      district: district || 'Not specified',
      submissionDate: new Date().toISOString(),
      message: 'Application registered successfully.',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
