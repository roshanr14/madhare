// Vercel Serverless Function: /api/ai/understand
// Natural language understanding for women welfare schemes

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query = '', language = 'ta' } = req.body || {};
    const text = (query || '').toLowerCase().trim();

    // Map intent categories
    let intent = 'find_scheme';
    let category = 'all';
    let friendlySpeech = '';

    if (
      text.includes('பணம்') || text.includes('காசு') || text.includes('ரூபாய்') ||
      text.includes('पैसा') || text.includes('धन') || text.includes('money') || text.includes('cash')
    ) {
      intent = 'find_financial_support';
      category = 'financial';
      friendlySpeech = language === 'ta'
        ? 'பண உதவி மற்றும் நிதி ஆதரவு திட்டங்களை உங்கள் முன் வைக்கிறேன்.'
        : language === 'hi'
        ? 'पैसे की सहायता से जुड़ी योजनाएं दिखा रही हूँ।'
        : 'Showing financial assistance schemes.';
    } else if (
      text.includes('வீடு') || text.includes('கட்டிடம்') ||
      text.includes('घर') || text.includes('मकान') || text.includes('house') || text.includes('home')
    ) {
      intent = 'find_housing_support';
      category = 'housing';
      friendlySpeech = language === 'ta'
        ? 'வீடு கட்டும் அரசு உதவி திட்டங்களை காட்டுகிறேன்.'
        : language === 'hi'
        ? 'घर और आवास सहायता योजनाएं दिखा रही हूँ।'
        : 'Showing housing assistance schemes.';
    } else if (
      text.includes('தையல்') || text.includes('மெஷின்') || text.includes('வேலை') || text.includes('தொழில்') ||
      text.includes('सिलाई') || text.includes('काम') || text.includes('रोजगार') || text.includes('tailor') || text.includes('sewing')
    ) {
      intent = 'find_skill_training';
      category = 'job_skill';
      friendlySpeech = language === 'ta'
        ? 'இலவச தையல் மெஷின் மற்றும் சுயதொழில் திட்டங்களை காட்டுகிறேன்.'
        : language === 'hi'
        ? 'सिलाई मशीन और स्वरोजगार योजनाएं दिखा रही हूँ।'
        : 'Showing tailoring and skill training schemes.';
    } else if (
      text.includes('படிப்பு') || text.includes('கல்வி') || text.includes('குழந்தை') || text.includes('மகள்') ||
      text.includes('पढ़ाई') || text.includes('शिक्षा') || text.includes('बेटी') || text.includes('education') || text.includes('school')
    ) {
      intent = 'find_education_support';
      category = 'education';
      friendlySpeech = language === 'ta'
        ? 'பெண் குழந்தைகள் படிப்பு மற்றும் செல்வமகள் சேமிப்பு திட்டங்களை காட்டுகிறேன்.'
        : language === 'hi'
        ? 'बालिका शिक्षा और सुरक्षित भविष्य की योजनाएं दिखा रही हूँ।'
        : 'Showing education and savings schemes for girls.';
    } else if (
      text.includes('மருத்துவம்') || text.includes('ஆஸ்பத்திரி') || text.includes('சிகிச்சை') ||
      text.includes('इलाज') || text.includes('अस्पताल') || text.includes('स्वास्थ्य') || text.includes('health') || text.includes('hospital')
    ) {
      intent = 'find_health_service';
      category = 'health';
      friendlySpeech = language === 'ta'
        ? 'இலவச மருத்துவ சிகிச்சை மற்றும் தாய் சேய் நல திட்டங்களை காட்டுகிறேன்.'
        : language === 'hi'
        ? 'मुफ्त इलाज और स्वास्थ्य योजनाएं दिखा रही हूँ।'
        : 'Showing free healthcare and medical schemes.';
    } else if (
      text.includes('பெண்') || text.includes('மகளிர்') || text.includes('கேஸ்') ||
      text.includes('महिला') || text.includes('गैस') || text.includes('women') || text.includes('gas')
    ) {
      intent = 'find_women_support';
      category = 'women_empowerment';
      friendlySpeech = language === 'ta'
        ? 'பெண்களுக்கான சிறப்பு நலத்திட்டங்களை காட்டுகிறேன்.'
        : language === 'hi'
        ? 'महिलाओं के लिए विशेष योजनाएं दिखा रही हूँ।'
        : 'Showing welfare schemes for women.';
    } else {
      friendlySpeech = language === 'ta'
        ? 'உங்களுக்கான பயனுள்ள அனைத்து அரசு திட்டங்களையும் காட்டுகிறேன்.'
        : language === 'hi'
        ? 'आपके लिए सभी उपयोगी योजनाएं दिखा रही हूँ।'
        : 'Showing all relevant schemes for you.';
    }

    return res.status(200).json({
      success: true,
      query,
      intent,
      category,
      friendlySpeech,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to process understanding request',
    });
  }
}
