const responses = {
  greeting: {
    rw: [
      'Murakaza neza kuri MindSpace. Aha ni ahantu hatekanye. None wumva ute?',
      'Mwaramutse. Ndi hano nkumve. Ushaka kuvuga ibiri ku mutima wawe?',
      'Muraho. Urakaza neza. Niba hari ikintu kiri ku mutima wawe, uraketse kukivuga.',
    ],
    en: [
      'Welcome to MindSpace. This is a safe place. How are you feeling right now?',
      'Hello. I am here to listen. Would you like to share what is on your heart?',
      'Hi there. You are welcome here. If something is on your mind, you are free to share it.',
    ],
  },
  sad: {
    rw: [
      'Mbona utameze neza. Niba ushaka kuvuga, ndi hano. Hari ikintu kiguteye agahinda?',
      'Birababaje kumva utameze neza. Wumva ute ubwo utekereza ibiri mu buzima bwawe?',
      'Agahinda ni ikintu gisanzwe. Ntugire ubwoba bwo kuvuga ibiri ku mutima. Aha uri umutekanye.',
    ],
    en: [
      'I can sense you are not feeling well. I am here if you want to talk. Is something bringing you sadness?',
      'It is hard when you feel this way. How does it feel when you think about what is going on in your life?',
      'Sadness is a normal human emotion. Do not be afraid to share what is in your heart. You are safe here.',
    ],
  },
  crisis: {
    rw: [
      "Ndemuka, mbona uri mu kiza. Nyamuneka uhamagare 3002 cyangwa 112 vuba. Agaciro kawe ni ngombwa kurusha ibindi.",
      'Mbabaro, ibyo urimo kuvuga biragoye cyane. Ntugume wenyine. Hamagara 3002 cyangwa wiyise uwo wizeye.',
    ],
    en: [
      'I am concerned about what you are sharing. Please call 3002 or 112 right now. Your safety matters most.',
      'I hear you, and what you are feeling is real. Please do not stay alone. Call 3002 or reach out to someone you trust right now.',
    ],
  },
  trauma: {
    rw: [
      'Ibyo urimo kuvuga byerekana ko hari ibintu bikomeye wanyuzeho. Uraketse kuvuga. Ntugende wenyene muri byo.',
      'Gukira mu byaha bikomeye ni urugendo. Ntirugenda vuba, ariko buri ntambwe yo kwishyira hanze ni ngombwa. Urakoze kugira ubutinyabwoba.',
    ],
    en: [
      'What you are sharing shows you have been through difficult experiences. You do not have to carry them alone.',
      'Healing from trauma is a journey. It does not happen overnight, but every step of expressing yourself matters. Thank you for your courage.',
    ],
  },
  anxiety: {
    rw: [
      'Umutima wawe uradunda. Ibyo bisanzwe. Uzi gukora icyitegererezo cyo guhumeka? Ihumeke neza. Hosa hosa.',
      'Kubona ubwoba ari byinshi birushya. Urakoze kubivuga. None se ubwo bwoba bugira iki kuri wowe?',
    ],
    en: [
      'Your heart is racing. That is normal. Do you know the breathing exercise? Breathe in slowly, hold, and release. You are okay.',
      'Carrying so much anxiety is exhausting. Thank you for naming it. What does this anxiety tell you about what matters to you?',
    ],
  },
  grief: {
    rw: [
      'Agahinda ni urugendo. Nta gihe gikwiye cyo gukira. Uraketse kurira, urakose kuvuga. Urahari.',
      'Gutakaza nta magambo abivuga byose. Ariko kuvuga ibyo wibuka biratabara. Ushaka kumbwira ibyo wibuka?',
    ],
    en: [
      'Grief is a journey with no timeline. You are allowed to cry, to speak, to be still. You are here, and that is enough.',
      'Loss cannot be fully expressed in words. But sharing memories can help. Would you like to tell me what you remember?',
    ],
  },
  general: {
    rw: [
      'Urakoze kumbwira. Niba ubishaka, ushaka kuvuga byinshi kuri ibyo?',
      'Mbyumva. None se ibi bikugiriraho ingaruka zite mu buzima bwawe bwa buri munsi?',
      'Ni byiza kwishyira hanze. Niba ubishaka, hari ikintu runaka cyaguteye icyizere?',
      'Uzi ko kwitaho umutima bishobora gutangira n\'ibintu byoroheje? Nko gufata akanya ugahumeka cyangwa kugenderera.',
      'Urakomeye. N\'ubwo ushobora kumva utameze neza, ukomeye. Kuvuga ibiri ku mutima ni ikimenyetso cy\'ubutinyabwoba.',
      'Ntugire ubwoba bwo kugaruka. Ndi hano buri gihe ukeneye kuvuga.',
    ],
    en: [
      'Thank you for sharing that with me. Would you like to tell me more?',
      'I hear you. How does this affect your daily life?',
      'It is good that you are expressing yourself. Is there something that gives you hope, even a small thing?',
      'You know, caring for your mind can start with simple things. Like taking a moment to breathe, or going for a short walk.',
      'You are strong. Even if you do not feel it right now, you are strong. Choosing to speak takes real courage.',
      'Do not be afraid to come back. I am here whenever you need to talk.',
    ],
  },
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectMood(message) {
  const lower = message.toLowerCase();
  const greetingWords = ['hello', 'hi', 'hey', 'muraho', 'mwaramutse', 'bite', 'amakuru'];
  const sadWords = ['sad', 'down', 'lonely', 'agahinda', 'munsi', 'rakaye', 'scared', 'fear', 'cry', 'tears', 'depressed'];
  const traumaWords = ['trauma', 'ptsd', 'flashback', 'nightmare', 'genocide', 'attack', 'abuse', 'hurt', 'painful memory', 'ibiza', 'traumatisme'];
  const anxietyWords = ['anxiety', 'anxious', 'panic', 'worried', 'nervous', 'racing heart', 'ubwoba', 'umuhangayiko', 'guhahamuka'];
  const griefWords = ['grief', 'grieve', 'loss', 'died', 'lost', 'funeral', 'missing', 'agahinda', 'gutakaza', 'gushyingura', 'not here'];

  if (greetingWords.some((w) => lower.includes(w))) return 'greeting';
  if (sadWords.some((w) => lower.includes(w))) return 'sad';
  if (traumaWords.some((w) => lower.includes(w))) return 'trauma';
  if (anxietyWords.some((w) => lower.includes(w))) return 'anxiety';
  if (griefWords.some((w) => lower.includes(w))) return 'grief';
  return 'general';
}

exports.generateResponse = async (message, { language = 'rw', userName } = {}) => {
  const mood = detectMood(message);
  const responseSet = responses[mood] || responses.general;
  const text = getRandom(responseSet[language] || responseSet.en);
  return userName ? `${userName}, ${text}` : text;
};

exports.generateInsight = async (moods, { language = 'rw' } = {}) => {
  if (!moods || moods.length === 0) {
    return language === 'rw'
      ? 'Nta makuru arahari yo gusesengura. Tangira gukurikirana uko wumva kugirango tubone icyo twigira.'
      : 'Not enough data yet. Start tracking your moods so we can learn your patterns together.';
  }
  const total = moods.length;
  const recent = moods.slice(-7);
  const avg = moods.reduce((s, m) => s + m.value, 0) / total;
  const recentAvg = recent.length > 0 ? recent.reduce((s, m) => s + m.value, 0) / recent.length : avg;

  if (avg >= 4) {
    return language === 'rw'
      ? 'Umeze neza muri iki gihe. Komeza witaho, kandi uzirikane ibintu bigufasha kumera neza.'
      : 'You are doing well lately. Keep nurturing what helps you feel good, and notice what supports your wellbeing.';
  }
  if (avg <= 2) {
    return language === 'rw'
      ? 'Muri iki gihe bishobora kuba bigoye. Wibuke ko n\'ibintu byoroheje nko guhumeka cyangwa kugana mu nzira bishobora gutabara. Ntugende wenyene.'
      : 'Things seem tough right now. Remember that small actions like breathing or a short walk can help. You do not have to go through this alone.';
  }
  if (recentAvg > avg) {
    return language === 'rw'
      ? 'Hari iterambere rito. Umeze neza kurusha mbere. Komeza ukurikiranire uko wumva, kandi wibuke gukomeza kwitaho.'
      : 'There is a small upward trend. You are doing better than before. Keep tracking, and remember to keep caring for yourself.';
  }
  return language === 'rw'
    ? 'Hari amajwi yiza n\'amabi muri iki gihe. Ni ibisanzwe. icy\'ingenzi ni ugukomeza kwitaho no kwiyumvamo.'
    : 'There have been ups and downs lately. That is normal. What matters is that you keep showing up for yourself.';
};
