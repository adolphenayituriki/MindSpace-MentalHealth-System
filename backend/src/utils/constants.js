const MOODS = [
  { emoji: '😊', label: 'Murakoze cyane', labelEn: 'Great', value: 5 },
  { emoji: '🙂', label: 'Mesa', labelEn: 'Good', value: 4 },
  { emoji: '😐', label: 'Bisanzwe', labelEn: 'Okay', value: 3 },
  { emoji: '😔', label: 'Mbi', labelEn: 'Low', value: 2 },
  { emoji: '😢', label: 'Mbi cyane', labelEn: 'Very Low', value: 1 },
];

const COMMUNITY_TOPICS = [
  'Anxiety',
  'Depression',
  'Grief',
  'PTSD',
  'Burnout',
  'Relationships',
  'Trauma',
  'Stress',
];

const LANGUAGES = {
  KINYARWANDA: 'rw',
  ENGLISH: 'en',
};

const CRISIS_HOTLINES = [
  { name: 'Emergency Hotline', number: '112', type: 'emergency' },
  { name: 'Mental Health Support', number: '3002', type: 'mental_health' },
  { name: 'Gender Based Violence', number: '3425', type: 'gbv' },
];

module.exports = { MOODS, COMMUNITY_TOPICS, LANGUAGES, CRISIS_HOTLINES };
