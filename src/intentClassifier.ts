import { ClassifiedIntent, Language, IntentType } from './types';

// Keyword definitions for each intent in all languages
const intentKeywords: Record<IntentType, string[]> = {
  'send-photo': [
    // English
    'photo', 'picture', 'image', 'send photo', 'share photo', 'whatsapp photo',
    'send picture', 'send image', 'share image', 'share picture', 'send a photo',
    'share a photo', 'sending photo', 'sending a photo', 'how to send photo',
    'how to share photo', 'show me how to send', 'photo share', 'pic send',
    // Hindi
    'फोटो', 'तस्वीर', 'भेजना', 'भेजो', 'भेजें', 'शेयर', 'फोटो भेजना',
    'फोटो भेजो', 'तस्वीर भेजो', 'व्हाट्सएप फोटो', 'फोटो भेजना सिखाओ',
    'फोटो कैसे भेजें', 'भेजना सिखाओ',
    // Telugu
    'ఫోటో', 'చిత్రం', 'పంపు', 'పంపాలి', 'పంపండి', 'షేర్', 'ఫోటో పంపు',
    'ఫోటో పంపండి', 'చిత్రం పంపు', 'ఫోటో ఎలా పంపాలో', 'చూపించు',
    'పంపాలో', 'ఫోటో పంపాలి',
  ],
  'set-alarm': [
    // English
    'alarm', 'set alarm', 'wake up', 'morning alarm', 'alarm clock',
    'set an alarm', 'set the alarm', 'create alarm', 'add alarm',
    'how to set alarm', 'wake me up', 'alarm set',
    // Hindi
    'अलार्म', 'अलार्म सेट', 'अलार्म लगाओ', 'अलार्म लगाना', 'जगाना',
    'सुबह', 'अलार्म कैसे', 'अलार्म बजाओ', 'अलार्म सेट करें',
    'अलार्म कैसे सेट करें',
    // Telugu
    'అలారం', 'అలారం సెట్', 'అలారం పెట్టు', 'అలారం పెట్టండి',
    'లేపు', 'ఉదయం', 'అలారం ఎలా', 'అలారం ఎలా సెట్',
    'అలారం సెట్ చేయాలి', 'అలారం సెట్ చేయండి',
  ],
  'turn-on-wifi': [
    // English
    'wifi', 'wi-fi', 'wireless', 'internet', 'turn on wifi', 'enable wifi',
    'connect wifi', 'wifi on', 'turn on wi-fi', 'enable wi-fi',
    'how to turn on wifi', 'wifi connect', 'net on', 'internet on',
    // Hindi
    'वाईफाई', 'वाई-फाई', 'इंटरनेट', 'वाईफाई चालू', 'वाईफाई ऑन',
    'नेट चालू', 'इंटरनेट चालू', 'वाईफाई कैसे', 'wifi चालू',
    // Telugu
    'వైఫై', 'వై-ఫై', 'ఇంటర్నెట్', 'వైఫై ఆన్', 'వైఫై చేయి',
    'నెట్ ఆన్', 'ఇంటర్నెట్ ఆన్', 'వైఫై ఎలా',
  ],
  'unknown': [],
  'ambiguous': [],
};

/**
 * Detect the dominant language from input text.
 */
export function detectLanguage(input: string): Language {
  const hindiPattern = /[\u0900-\u097F]/;
  const teluguPattern = /[\u0C00-\u0C7F]/;

  const hindiCount = (input.match(/[\u0900-\u097F]/g) || []).length;
  const teluguCount = (input.match(/[\u0C00-\u0C7F]/g) || []).length;

  if (teluguCount > 0 && teluguCount >= hindiCount) return 'te';
  if (hindiCount > 0 && hindiCount > teluguCount) return 'hi';
  return 'en';
}

/**
 * Classify user intent using keyword matching.
 * Works offline with English, Hindi, Telugu, and mixed-language input.
 */
export function classifyIntent(input: string): ClassifiedIntent {
  const detectedLanguage = detectLanguage(input);
  const normalizedInput = input.toLowerCase().trim().replace(/\s+/g, ' ');

  const scores: Record<string, number> = {};

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (intent === 'unknown' || intent === 'ambiguous') continue;

    let score = 0;
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase();
      if (normalizedInput.includes(normalizedKeyword)) {
        // Longer keyword matches get higher scores
        score += normalizedKeyword.length;
      }
    }
    if (score > 0) {
      scores[intent] = score;
    }
  }

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return { type: 'unknown', confidence: 0, detectedLanguage };
  }

  // If top two scores are very close, it's ambiguous
  if (entries.length >= 2) {
    const ratio = entries[1][1] / entries[0][1];
    if (ratio > 0.8) {
      return { type: 'ambiguous', confidence: 0.4, detectedLanguage };
    }
  }

  const topIntent = entries[0][0] as IntentType;
  const confidence = Math.min(entries[0][1] / 15, 1); // Normalize

  return { type: topIntent, confidence, detectedLanguage };
}

/**
 * Example requests for each language - used for suggestion chips
 */
export const exampleRequests: Record<Language, string[]> = {
  en: [
    'Show me how to send a photo on WhatsApp.',
    'How do I set an alarm?',
    'Turn on Wi-Fi.',
  ],
  hi: [
    'मुझे WhatsApp पर फोटो भेजना सिखाओ।',
    'अलार्म कैसे सेट करें?',
    'Wi-Fi चालू करो।',
  ],
  te: [
    'WhatsApp లో ఫోటో ఎలా పంపాలో చూపించు.',
    'అలారం ఎలా సెట్ చేయాలి?',
    'Wi-Fi ఆన్ చేయి.',
  ],
};
