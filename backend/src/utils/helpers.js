const generateAnonymousId = () => {
  const adjectives = ['Mutezi', 'Umuhanga', 'Intwali', 'Kirebe', 'Icyiza'];
  const nouns = ['Inyenyeri', 'Umuyaga', 'Ikivuguto', 'Akanyoni', 'Urusobe'];
  const num = Math.floor(Math.random() * 999);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${num}`;
};

const detectCrisisKeywords = (text) => {
  const keywords = [
    'kill', 'suicide', 'die', 'end my life', 'don\'t want to live',
    ' hurting myself', 'self-harm', 'cutting', 'no reason to live',
    'better off dead', 'want to die',
  ];
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
};

module.exports = { generateAnonymousId, detectCrisisKeywords };
