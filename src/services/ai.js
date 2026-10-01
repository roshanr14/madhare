// AI Intent Understanding Service
// Communicates with backend /api/ai/understand with instant offline client-side heuristic fallback

const INTENT_CATEGORY_MAP = {
  find_financial_support: 'financial',
  find_housing_support: 'housing',
  find_education_support: 'education',
  find_skill_training: 'job_skill',
  find_job: 'job_skill',
  find_health_service: 'health',
  find_women_support: 'women_empowerment',
  find_scheme: 'all',
};

// Client-side intent parser for fast local or offline processing
export function parseLocalIntent(query = '', language = 'ta') {
  const q = query.toLowerCase().trim();

  // Financial / Money intent
  if (
    q.includes('பணம்') ||
    q.includes('காசு') ||
    q.includes('உதவித்தொகை') ||
    q.includes('ரூபாய்') ||
    q.includes('ஆயிரம்') ||
    q.includes('पैसा') ||
    q.includes('धन') ||
    q.includes('राशि') ||
    q.includes('money') ||
    q.includes('cash') ||
    q.includes('financial') ||
    q.includes('డబ్బు') ||
    q.includes('ಹಣ')
  ) {
    return {
      intent: 'find_financial_support',
      category: 'financial',
      friendlySpeech: {
        ta: 'பண உதவி மற்றும் நிதி ஆதரவு திட்டங்களை உங்கள் முன் வைக்கிறேன்.',
        hi: 'पैसे की सहायता से जुड़ी योजनाएं दिखा रही हूँ।',
        en: 'Showing financial assistance and monetary support schemes.',
      }[language] || 'Showing financial support schemes.',
    };
  }

  // Housing intent
  if (
    q.includes('வீடு') ||
    q.includes('கட்டிடம்') ||
    q.includes('கூரை') ||
    q.includes('மண் வீடு') ||
    q.includes('घर') ||
    q.includes('मकान') ||
    q.includes('आवास') ||
    q.includes('छत') ||
    q.includes('house') ||
    q.includes('home') ||
    q.includes('housing') ||
    q.includes('ఇల్లు') ||
    q.includes('ಮನೆ')
  ) {
    return {
      intent: 'find_housing_support',
      category: 'housing',
      friendlySpeech: {
        ta: 'வீடு கட்டும் அரசு உதவி திட்டங்களை காட்டுகிறேன்.',
        hi: 'घर और आवास सहायता योजनाएं दिखा रही हूँ।',
        en: 'Showing housing assistance schemes.',
      }[language] || 'Showing housing assistance schemes.',
    };
  }

  // Education / Girl child intent
  if (
    q.includes('படிப்பு') ||
    q.includes('கல்வி') ||
    q.includes('குழந்தை') ||
    q.includes('மகள்') ||
    q.includes('பள்ளி') ||
    q.includes('கல்லூரி') ||
    q.includes('पढ़ाई') ||
    q.includes('शिक्षा') ||
    q.includes('बेटी') ||
    q.includes('बच्चे') ||
    q.includes('स्कूल') ||
    q.includes('education') ||
    q.includes('school') ||
    q.includes('college') ||
    q.includes('daughter') ||
    q.includes('study')
  ) {
    return {
      intent: 'find_education_support',
      category: 'education',
      friendlySpeech: {
        ta: 'பெண் குழந்தைகள் படிப்பு மற்றும் எதிர்கால சேமிப்பு திட்டங்களை காட்டுகிறேன்.',
        hi: 'बालिका शिक्षा और सुरक्षित भविष्य की योजनाएं दिखा रही हूँ।',
        en: 'Showing girl child education and savings schemes.',
      }[language] || 'Showing education schemes.',
    };
  }

  // Skill / Job / Tailoring intent
  if (
    q.includes('தையல்') ||
    q.includes('மெஷின்') ||
    q.includes('வேலை') ||
    q.includes('சுயதொழில்') ||
    q.includes('பயிற்சி') ||
    q.includes('தொழில்') ||
    q.includes('सिलाई') ||
    q.includes('मशीन') ||
    q.includes('काम') ||
    q.includes('रोजगार') ||
    q.includes('ट्रेनिंग') ||
    q.includes('sewing') ||
    q.includes('tailor') ||
    q.includes('job') ||
    q.includes('work') ||
    q.includes('skill') ||
    q.includes('business')
  ) {
    return {
      intent: 'find_skill_training',
      category: 'job_skill',
      friendlySpeech: {
        ta: 'இலவச தையல் மெஷின் மற்றும் சுயதொழில் திட்டங்களை காட்டுகிறேன்.',
        hi: 'सिलाई मशीन और स्वरोजगार से जुड़ी योजनाएं दिखा रही हूँ।',
        en: 'Showing sewing machine and self-employment skill schemes.',
      }[language] || 'Showing self-employment schemes.',
    };
  }

  // Health / Medical intent
  if (
    q.includes('மருத்துவம்') ||
    q.includes('ஆஸ்பத்திரி') ||
    q.includes('நோய்') ||
    q.includes('சிகிச்சை') ||
    q.includes('பிரசவம்') ||
    q.includes('கர்ப்பிணி') ||
    q.includes('इलाज') ||
    q.includes('अस्पताल') ||
    q.includes('दवा') ||
    q.includes('स्वास्थ्य') ||
    q.includes('गर्भवती') ||
    q.includes('health') ||
    q.includes('hospital') ||
    q.includes('treatment') ||
    q.includes('doctor') ||
    q.includes('medicine')
  ) {
    return {
      intent: 'find_health_service',
      category: 'health',
      friendlySpeech: {
        ta: 'இலவச மருத்துவ சிகிச்சை மற்றும் தாய் சேய் நல திட்டங்களை காட்டுகிறேன்.',
        hi: 'मुफ्त इलाज और स्वास्थ्य सहायता योजनाएं दिखा रही हूँ।',
        en: 'Showing healthcare and maternity support schemes.',
      }[language] || 'Showing health support schemes.',
    };
  }

  // Women / Gas / General women empowerment
  if (
    q.includes('பெண்') ||
    q.includes('மகளிர்') ||
    q.includes('தாய்') ||
    q.includes('கேஸ்') ||
    q.includes('அடுப்பு') ||
    q.includes('சிலிண்டர்') ||
    q.includes('महिला') ||
    q.includes('गैस') ||
    q.includes('सिलेंडर') ||
    q.includes('चूल्हा') ||
    q.includes('women') ||
    q.includes('gas') ||
    q.includes('cylinder')
  ) {
    return {
      intent: 'find_women_support',
      category: 'women_empowerment',
      friendlySpeech: {
        ta: 'பெண்களுக்கான சிறப்பு திட்டங்களை காட்டுகிறேன்.',
        hi: 'महिलाओं के लिए विशेष कल्याणकारी योजनाएं दिखा रही हूँ।',
        en: 'Showing special welfare schemes for women.',
      }[language] || 'Showing women support schemes.',
    };
  }

  // Generic fallback
  return {
    intent: 'find_scheme',
    category: 'all',
    friendlySpeech: {
      ta: 'உங்களுக்காக பயனுள்ள அனைத்து அரசு திட்டங்களையும் காட்டுகிறேன்.',
      hi: 'आपके लिए सभी उपयोगी सरकारी योजनाएं दिखा रही हूँ।',
      en: 'Showing all relevant government welfare schemes for you.',
    }[language] || 'Showing all relevant schemes.',
  };
}

// Full async service calling backend API if available, else local intent parser
export async function understandUserRequest(query, language = 'ta') {
  if (typeof window !== 'undefined' && navigator.onLine) {
    try {
      const response = await fetch('/api/ai/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      // Backend not running or offline; fall back gracefully
    }
  }

  return parseLocalIntent(query, language);
}
