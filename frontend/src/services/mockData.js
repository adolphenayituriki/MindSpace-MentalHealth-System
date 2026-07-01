import { getLanguage } from '../i18n/i18n';

let _user = null;
let _token = 'mock_token_' + Date.now();

function lang() {
  return getLanguage() || 'rw';
}



export const mockAuth = {
  anonymous: (language) => {
    const id = 'user_' + Math.random().toString(36).slice(2, 8);
    _user = {
      _id: id,
      anonymousId: 'MuteziInyenyeri' + Math.floor(Math.random() * 999),
      displayName: 'MuteziInyenyeri' + Math.floor(Math.random() * 999),
      language: language || 'rw',
      isAnonymous: true,
      onboardingComplete: false,
      preferredTopics: [],
      joinedCommunities: [],
      moodStreak: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: { user: _user, token: _token } };
  },

  register: (data) => {
    _user = {
      _id: 'user_reg_' + Date.now(),
      anonymousId: 'User' + Math.floor(Math.random() * 9999),
      email: data.email,
      displayName: data.displayName,
      language: 'rw',
      isAnonymous: false,
      onboardingComplete: false,
      preferredTopics: [],
      joinedCommunities: [],
      moodStreak: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: { user: _user, token: _token } };
  },

  login: (data) => {
    _user = {
      _id: 'user_login_' + Date.now(),
      anonymousId: 'User' + Math.floor(Math.random() * 9999),
      email: data.email,
      displayName: data.email.split('@')[0],
      language: 'rw',
      isAnonymous: false,
      onboardingComplete: false,
      preferredTopics: [],
      joinedCommunities: [],
      moodStreak: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: { user: _user, token: _token } };
  },

  profile: () => {
    return { data: { user: _user } };
  },

  updateProfile: (updates) => {
    if (_user) Object.assign(_user, updates);
    return { data: { user: _user } };
  },

  getCurrentUser: () => _user,
};



function generateMoods() {
  const moods = [];
  const emojis = { 5: '\u{1F60A}', 4: '\u{1F642}', 3: '\u{1F610}', 2: '\u{1F614}', 1: '\u{1F622}' };
  const notes = ['Had a good day', 'Felt tired', 'Productive morning', 'A bit anxious', 'Peaceful evening', 'Met with friends', 'Quiet day at home'];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const val = Math.random() < 0.2 ? 3 : [5, 4, 4, 3, 3, 3, 2][Math.floor(Math.random() * 7)];
    moods.push({
      _id: 'mood_' + i,
      user: _user?._id || 'mock_user',
      value: val,
      emoji: emojis[val],
      note: notes[Math.floor(Math.random() * notes.length)],
      tags: [],
      date: d.toISOString(),
    });
  }
  return moods;
}

const _moods = generateMoods();

export const mockMoods = {
  log: (data) => {
    const today = new Date().toISOString().slice(0, 10);
    const idx = _moods.findIndex((m) => m.date.slice(0, 10) === today);
    const entry = {
      _id: 'mood_' + Date.now(),
      user: _user?._id || 'mock_user',
      value: data.value,
      emoji: data.emoji,
      note: data.note || '',
      tags: data.tags || [],
      date: new Date().toISOString(),
    };
    if (idx >= 0) _moods[idx] = entry;
    else _moods.push(entry);
    const streak = Math.min(Math.floor(Math.random() * 14) + 1, _moods.length);
    return { data: { moods: [..._moods].reverse().slice(0, 30), streak } };
  },

  getAll: (days) => {
    const limit = days || 30;
    return { data: { moods: [..._moods].reverse().slice(0, limit), streak: 7 } };
  },

  getToday: () => {
    const today = new Date().toISOString().slice(0, 10);
    const mood = _moods.find((m) => m.date.slice(0, 10) === today);
    return { data: { mood: mood || null } };
  },

  getInsights: () => {
    const vals = _moods.map((m) => m.value);
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    return {
      data: {
        insights: {
          average: Math.round(avg * 10) / 10,
          trend: Math.round((avg + (Math.random() - 0.5) * 0.5) * 10) / 10,
          total: _moods.length,
          best: Math.max(...vals),
          worst: Math.min(...vals),
          weeklyAverages: [
            { week: '2026-06-22', average: 3.8 },
            { week: '2026-06-15', average: 3.2 },
            { week: '2026-06-08', average: 4.1 },
            { week: '2026-06-01', average: 3.5 },
          ],
        },
      },
    };
  },
};



const _journalEntries = [
  { _id: 'j1', title: 'Umutima wuje amahoro', content: 'Uyu munsi narose ndeba uko izuba rirashe. Nibutse ko buri munsi ari ikindi gitangaza. Nshimira akanya k\'amahoro nafite. Byambukijije ko n\'ubwo hari ibibazo, hari ibyiza.', prompt: 'Ni iki cyaguteye amahoro mu mutima wawe uyu munsi?', mood: 4, tags: ['gratitude', 'amahoro'], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: 'j2', title: 'Kugira ubwoba bw\'ibizamini', content: 'Ntekereza cyane ku bizamini biri imbere. Umutima wange uradunda iyo ntekereje. Nkeneye kwibuka guhumeka no gufata buri kintu gikurikiye ikindi. Sinifuza gukomeza kugira ubwoba.', prompt: 'Ni iki kiguteye ubwoba?', mood: 2, tags: ['anxiety', 'ubwoba'], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { _id: 'j3', title: 'Ikiganiro n\'inshuti', content: 'Nagize ikiganiro cyiza na Jean-Pierre. Twavuganye ku nzozi zacu n\'ibyo dutinya. Byumvikanye neza kumva ngo n\'umva. Nshimira kugira inshuti nk\'iyo.', prompt: 'Wumva ute ubwo utekereza abantu ukunda?', mood: 5, tags: ['friends', 'gratitude'], createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { _id: 'j4', title: 'Imvura y\'amahoro', content: 'Imvura iragwa. Nicaye iriya ndebe uko igwa. Rimwe na rimwe guceceka ni umuti mwiza. Ntekereje ku bintu byinshi, ariko numva mpumuye. Iyi mvura iransukura.', prompt: 'Ni iki kikuzanira amahoro?', mood: 3, tags: ['reflection', 'amahoro'], createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
  { _id: 'j5', title: 'Kwangara no gukomeza', content: 'Uyu munsi waranganye. Nibutse ibintu byinshi byabaye mu buzima. Ariko nzirikana ko nkomeye. Nanyuze mu byinshi ariko ndahari. Ubu ndiga kwitaho umutima wange.', prompt: 'Wibuka igihe wagombaga gukomeza n\'ubwo byari bigoye?', mood: 3, tags: ['strength', 'healing'], createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
];

export const mockJournals = {
  create: (data) => {
    const entry = {
      _id: 'j_' + Date.now(),
      user: _user?._id || 'mock_user',
      title: data.title || '',
      content: data.content,
      prompt: data.prompt || '',
      mood: data.mood || null,
      tags: data.tags || [],
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    _journalEntries.unshift(entry);
    return { data: { entry } };
  },

  getAll: (page) => {
    const pageNum = page || 1;
    const limit = 20;
    const start = (pageNum - 1) * limit;
    return {
      data: {
        entries: _journalEntries.slice(start, start + limit),
        total: _journalEntries.length,
        page: pageNum,
        pages: Math.ceil(_journalEntries.length / limit),
      },
    };
  },

  getOne: (id) => {
    const entry = _journalEntries.find((e) => e._id === id);
    return { data: { entry } };
  },

  update: (id, data) => {
    const entry = _journalEntries.find((e) => e._id === id);
    if (entry) Object.assign(entry, data, { updatedAt: new Date().toISOString() });
    return { data: { entry } };
  },

  delete: (id) => {
    const idx = _journalEntries.findIndex((e) => e._id === id);
    if (idx >= 0) _journalEntries.splice(idx, 1);
    return { data: { message: 'Entry deleted' } };
  },

  getPrompts: () => {
    const prompts = {
      rw: [
        'Ni iki cyaguteye amahoro mu mutima wawe uyu munsi?',
        'Hari ikintu kiva kera kikaba kikugiraho ingaruka ubu? Ushaka kukivuga?',
        'Wumva ute ubwo utekereza ejo hazaza hawe? Ni iki kugushisha?',
        'Ni iki wakora wiyitaho kugirango umere neza mu mutwe n\'umutima?',
        'Hari umuntu wizeye wakwiyisaho mu gihe ugoye?',
        'Ni iyihe nkuru ukora yo kwitaho umutima wawe igihe uhuye n\'ibibazo?',
        'Wibuka igihe wumvaga ukomeye n\'ubwo byari bigoye? Ni iki cyagufashije?',
        'Hari ikintu wifuza kureka kigutunga ubwoba?',
        'Ni iki wakwishimira muri iki cyumweru, n\'ubwo ari gito?',
        'Hari ikintu warinze kuvuga kikagutunga umutima? Ubu ni umwanya wo kukivuga.',
      ],
      en: [
        'What brought you a moment of peace today, even a small one?',
        'Is there something from the past that is still affecting you? Would you like to talk about it?',
        'How do you feel when you think about your future? What worries you most?',
        'What is one thing you do to care for your mental health when life feels heavy?',
        'Is there someone you trust who you can open up to when things get hard?',
        'What coping habit helps you when you face overwhelming emotions?',
        'Remember a time you felt strong even though things were difficult. What carried you through?',
        'What fear has been holding you back from living fully?',
        'What can you celebrate this week, even if it seems small?',
        'Is there something you have been keeping inside that needs to be released? This is a safe space.',
      ],
    };
    const l = lang();
    return { data: { prompts: prompts[l] || prompts.en } };
  },
};



const reflectionResponses = [
  'Thank you for sharing that. It takes courage to speak what is in your heart. You are not alone.',
  'I hear you. How does this affect your daily life? Sometimes naming it is the first step.',
  'That sounds meaningful. What do you think you need most right now?',
  'It is brave to express yourself. What gives you strength, even a small thing?',
  'Sometimes just naming how we feel is the first step toward healing. You are doing that right now.',
  'You are not alone in this. Many people carry similar feelings, even when it seems otherwise.',
  'What you are feeling is valid. There is no right or wrong way to feel.',
  'Healing is not a straight line. Some days are harder, and that is okay. You are still moving forward.',
];

let msgCounter = 0;

export const mockChat = {
  send: (content) => {
    msgCounter++;
    const isCrisis = ['kill', 'suicide', 'die', 'hurt myself', 'end my life', 'want to die'].some(
      (k) => content.toLowerCase().includes(k)
    );

    return {
      data: {
        userMessage: {
          _id: 'msg_u_' + msgCounter,
          content,
          isFromAI: false,
          createdAt: new Date().toISOString(),
        },
        aiMessage: {
          _id: 'msg_ai_' + msgCounter,
          content: isCrisis
            ? 'I am concerned about what you are sharing. Please reach out for support. You matter.'
            : reflectionResponses[msgCounter % reflectionResponses.length],
          isFromAI: true,
          createdAt: new Date().toISOString(),
        },
        crisisDetected: isCrisis,
        crisisResources: isCrisis
          ? [{ name: 'Crisis Hotline', number: '3002' }, { name: 'Emergency', number: '112' }]
          : undefined,
      },
    };
  },

  history: () => {
    return { data: { messages: [] } };
  },

  clear: () => {
    msgCounter = 0;
    return { data: { message: 'History cleared' } };
  },
};



const _communities = [
  {
    _id: 'c1', name: 'Anxiety Support', nameRw: 'Ubufasha ku Bwoba',
    description: 'A safe space to share and manage anxiety together.',
    descriptionRw: 'Ahantu hatekanye ho gusangira no gukemura ubwoba.',
    topic: 'Anxiety', icon: '', memberCount: 47, isModerated: true, moderators: [],
  },
  {
    _id: 'c2', name: 'Grief & Loss', nameRw: 'Agahinda no Gutakaza',
    description: 'Healing together through loss and grief.',
    descriptionRw: 'Gukira hamwe mu gahinda no gutakaza.',
    topic: 'Grief', icon: '', memberCount: 32, isModerated: true, moderators: [],
  },
  {
    _id: 'c3', name: 'PTSD Recovery', nameRw: 'Gukira PTSD',
    description: 'Support for those healing from trauma and PTSD.',
    descriptionRw: 'Ubufasha ku bazima barangwaho PTSD.',
    topic: 'PTSD', icon: '', memberCount: 28, isModerated: true, moderators: [],
  },
  {
    _id: 'c4', name: 'Burnout Relief', nameRw: 'Kuruhuka mu Mirimo',
    description: 'For professionals and students facing burnout.',
    descriptionRw: 'Ku bakozi n\'abanyeshuri bahanganye no kunanirwa.',
    topic: 'Burnout', icon: '', memberCount: 55, isModerated: true, moderators: [],
  },
  {
    _id: 'c5', name: 'Depression Support', nameRw: 'Ubufasha ku Bihebye',
    description: 'A compassionate community for those navigating depression.',
    descriptionRw: 'Umuryango ugirana impuhwe ku bahanganye na depression.',
    topic: 'Depression', icon: '', memberCount: 39, isModerated: true, moderators: [],
  },
  {
    _id: 'c6', name: 'Stress Management', nameRw: 'Gucunga Umuhangayiko',
    description: 'Tips, tools, and support for daily stress.',
    descriptionRw: 'Amabwiriza, ibikoresho, n\'ubufasha ku muhangayiko wa buri munsi.',
    topic: 'Stress', icon: '', memberCount: 61, isModerated: true, moderators: [],
  },
];

let _joinedCommunityIds = ['c1', 'c4'];
const _communityMessages = {};

export const mockCommunities = {
  getAll: () => ({ data: { communities: _communities } }),

  getMine: () => ({
    data: { communities: _communities.filter((c) => _joinedCommunityIds.includes(c._id)) },
  }),

  getOne: (id) => {
    const c = _communities.find((c) => c._id === id);
    return { data: { community: c } };
  },

  join: (id) => {
    if (!_joinedCommunityIds.includes(id)) {
      _joinedCommunityIds.push(id);
      const c = _communities.find((c) => c._id === id);
      if (c) c.memberCount++;
    }
    return {
      data: {
        community: _communities.find((c) => c._id === id),
        user: _user,
      },
    };
  },

  leave: (id) => {
    _joinedCommunityIds = _joinedCommunityIds.filter((x) => x !== id);
    const c = _communities.find((c) => c._id === id);
    if (c) c.memberCount = Math.max(0, c.memberCount - 1);
    return {
      data: {
        community: c,
        user: _user,
      },
    };
  },

  getMessages: (id) => {
    if (!_communityMessages[id]) {
      const names = ['Mutezi', 'Umuhanga', 'Intwali', 'Kirebe', 'Icyiza'];
      const nouns = ['Inyenyeri', 'Umuyaga', 'Ikivuguto', 'Akanyoni'];
      _communityMessages[id] = Array.from({ length: 12 }, (_, i) => ({
        _id: `msg_${id}_${i}`,
        sender: { _id: 'u' + i, displayName: names[i % names.length] + nouns[i % nouns.length] + Math.floor(Math.random() * 100) },
        anonymousName: names[i % names.length] + nouns[i % nouns.length],
        content: [
          'Muraho mwese! Ndi mushya hano.',
          'Uyu munsi numva neza cyane.',
          'Hari ikintu nabonye cyanyuze ku mutima.',
          'Murakoze kubana nanjye muri iyi ngingo.',
          'Ndifuza kuvuga ibintu bitari byiza byabaye.',
          'Hello everyone, glad to be here.',
          'Has anyone tried the breathing exercises? They help me.',
          'Today was hard, but I am grateful for this space.',
          'I wanted to share something that helped me this week.',
          'Does anyone else feel anxious about the future?',
          'Sending strength to everyone here today.',
          'Thank you for being such a supportive community.',
        ][i % 12],
        community: id,
        createdAt: new Date(Date.now() - (12 - i) * 3600000 * 2).toISOString(),
      }));
    }
    return { data: { messages: _communityMessages[id] } };
  },

  postMessage: (id, content) => {
    const names = ['MuteziInyenyeri', 'Umuhanga', 'Intwali', 'Kirebe'];
    const msg = {
      _id: 'msg_new_' + Date.now(),
      sender: { _id: _user?._id || 'mock', displayName: _user?.displayName || 'Anonymous' },
      anonymousName: _user?.displayName || 'Anonymous',
      content,
      community: id,
      createdAt: new Date().toISOString(),
    };
    if (!_communityMessages[id]) _communityMessages[id] = [];
    _communityMessages[id].push(msg);
    return { data: { message: msg } };
  },
};



const _counselors = [
  {
    _id: 'counselor_1', fullName: 'Dr. Alice Mukamana',
    bio: 'Clinical psychologist specializing in trauma and PTSD recovery.',
    bioRw: 'Umuhanga mu bya psychologue ukora kuri trauma na PTSD.',
    specialization: ['Trauma', 'PTSD', 'Anxiety'],
    languages: ['rw', 'en'], isVerified: true, isAvailable: true, rating: 4.8,
  },
  {
    _id: 'counselor_2', fullName: 'Jean-Baptiste Habimana',
    bio: 'Counseling psychologist focused on youth mental health and grief.',
    bioRw: 'Umujyanama wa psychologue ku rubyiruko n\'agahinda.',
    specialization: ['Grief', 'Youth', 'Depression'],
    languages: ['rw', 'en'], isVerified: true, isAvailable: true, rating: 4.6,
  },
  {
    _id: 'counselor_3', fullName: 'Gloria Uwimana',
    bio: 'Specialist in cognitive behavioral therapy and stress management.',
    bioRw: 'Umuhanga mu kuvura imitekerereze no gucunga umuhangayiko.',
    specialization: ['Stress', 'Anxiety', 'Burnout'],
    languages: ['rw', 'en'], isVerified: true, isAvailable: true, rating: 4.9,
  },
  {
    _id: 'counselor_4', fullName: 'Patrick Mugisha',
    bio: 'Mental health counselor with 10 years of experience in community outreach.',
    bioRw: 'Umujyanama mu mutima ufite uburambe bw\'imyaka 10.',
    specialization: ['Depression', 'Stress', 'Relationships'],
    languages: ['rw', 'en', 'fr'], isVerified: true, isAvailable: false, rating: 4.5,
  },
];

export const mockCounseling = {
  getCounselors: () => ({ data: { counselors: _counselors } }),

  requestSession: (data) => ({
    data: {
      session: {
        _id: 'session_' + Date.now(),
        user: _user?._id || 'mock',
        counselor: _counselors[0]._id,
        status: 'active',
        topic: data.topic || '',
        priority: 'normal',
        startedAt: new Date().toISOString(),
      },
    },
  }),

  getActiveSession: () => ({
    data: {
      session: {
        _id: 'session_active',
        user: _user?._id || 'mock',
        counselor: _counselors[0]._id,
        status: 'active',
        topic: 'Feeling overwhelmed with work',
        priority: 'normal',
        startedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    },
  }),

  getSession: (id) => ({
    data: {
      session: {
        _id: id,
        user: _user?._id || 'mock',
        counselor: _counselors[0]._id,
        status: 'active',
        topic: 'Feeling overwhelmed',
        startedAt: new Date().toISOString(),
      },
    },
  }),

  getSessionMessages: (id) => {
    const msgs = [
      { _id: 'cs1', sender: { _id: 'mock', displayName: 'You' }, anonymousName: 'You', content: 'Hello, I have been feeling very anxious lately.', session: id, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { _id: 'cs2', sender: { _id: 'counselor_1', displayName: 'Dr. Alice Mukamana' }, anonymousName: 'Dr. Alice Mukamana', content: 'Thank you for reaching out. Can you tell me more about what triggers this anxiety?', session: id, createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { _id: 'cs3', sender: { _id: 'mock', displayName: 'You' }, anonymousName: 'You', content: 'It usually happens before meetings or when I have to speak in front of people.', session: id, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { _id: 'cs4', sender: { _id: 'counselor_1', displayName: 'Dr. Alice Mukamana' }, anonymousName: 'Dr. Alice Mukamana', content: 'That sounds like social anxiety, which is very common and treatable. Let us work on some grounding techniques you can use before meetings.', session: id, createdAt: new Date(Date.now() - 1800000).toISOString() },
    ];
    return { data: { messages: msgs } };
  },

  sendMessage: (id, content) => ({
    data: {
      message: {
        _id: 'cs_new_' + Date.now(),
        sender: { _id: _user?._id || 'mock', displayName: _user?.displayName || 'You' },
        anonymousName: _user?.displayName || 'You',
        content,
        session: id,
        createdAt: new Date().toISOString(),
      },
    },
  }),

  closeSession: (id, data) => ({
    data: {
      session: { _id: id, status: 'closed', closedAt: new Date().toISOString(), rating: data.rating, feedback: data.feedback },
    },
  }),
};



const _resources = [
  { _id: 'r1', name: 'Rwanda Mental Health Hotline', nameRw: 'Terefone y\'Ubufasha mu Mutima', type: 'hotline', phone: '3002', description: 'Free 24/7 mental health support hotline.', descriptionRw: 'Terefone y\'ubufasha mu mutima ku buntu, 24/7.', location: '', isVerified: true },
  { _id: 'r2', name: 'National Emergency Service', nameRw: 'Serivisi y\'Ikiza', type: 'emergency', phone: '112', description: 'National emergency response — police, ambulance, fire.', descriptionRw: 'Serivisi y\'ikiza — polisi, ambulance, umuriro.', location: '', isVerified: true },
  { _id: 'r3', name: 'Gender Based Violence Hotline', nameRw: 'Terefone yo Kurwanya Ihohoterwa', type: 'hotline', phone: '3425', description: 'Support for survivors of gender-based violence.', descriptionRw: 'Ubufasha ku bahozeho ihohoterwa.', location: '', isVerified: true },
  { _id: 'r4', name: 'CARITAS Rwanda', nameRw: 'CARITAS Rwanda', type: 'ngo', phone: '+250788301000', description: 'Psychosocial support and counseling services.', descriptionRw: 'Serivisi z\'ubujyanama mu mutima.', location: 'Kigali', isVerified: true },
  { _id: 'r5', name: 'Ndera Neuropsychiatric Hospital', nameRw: 'Ibitaro bya Ndera', type: 'health_center', phone: '+250788201000', description: 'Specialized mental health hospital.', descriptionRw: 'Ibitaro by\'indwara zo mu mutima.', location: 'Ndera, Kigali', isVerified: true },
  { _id: 'r6', name: 'Isange One Stop Center', nameRw: 'Isange One Stop Center', type: 'health_center', phone: '3425', description: 'Comprehensive support for survivors of violence.', descriptionRw: 'Ubufasha bwuzuye ku bahozeho ihohoterwa.', location: 'Kacyiru, Kigali', isVerified: true },
];

export const mockCrisis = {
  getResources: (params) => {
    let filtered = [..._resources];
    if (params?.type) filtered = filtered.filter((r) => r.type === params.type);
    return { data: { resources: filtered } };
  },
  getHotlines: () => ({
    data: { hotlines: _resources.filter((r) => ['hotline', 'emergency'].includes(r.type)) },
  }),
  getCenters: () => ({
    data: { centers: _resources.filter((r) => r.type === 'health_center' || r.type === 'ngo') },
  }),
};



const _healingResources = [
  {
    _id: 'h_breathe_1', title: '4-7-8 Breathing', titleRw: 'Guhumeka 4-7-8',
    type: 'breathing', duration: '5 min', icon: '\u{1F9D8}',
    description: 'A calming breathing technique that helps reduce anxiety and helps you fall asleep.',
    descriptionRw: 'Ubuhumekero bumaraガングirira ubwoba n\'ibibazo by\'imitsi.',
    tags: ['anxiety', 'sleep', 'calm', 'stress'], moodTags: [1, 2, 3], isFeatured: true,
    steps: ['Find a comfortable seated position. Close your eyes.', 'Exhale completely through your mouth.', 'Inhale through your nose for 4 seconds.', 'Hold your breath for 7 seconds.', 'Exhale through your mouth for 8 seconds.', 'Repeat 4-8 times.'],
    stepsRw: ['Shakisha ahantu hiza wicara. Ufunze amaso.', 'Sohora umwuka wose mu kanwa.', 'Humeka mu mazuru amasaha 4.', 'Fata umwuka amasaha 7.', 'Sohora umwuka mu kanwa amasaha 8.', 'Subiramo inshuro 4-8.'],
  },
  {
    _id: 'h_breathe_2', title: 'Box Breathing', titleRw: 'Guhumeka Agasanduku',
    type: 'breathing', duration: '5 min', icon: '\u{25A6}',
    description: 'A simple breathing technique used by Navy SEALS to stay calm under pressure.',
    descriptionRw: 'Ubuhumekero bworoshye bukoreshwa na Navy SEALS kugirango bagume batekanye.',
    tags: ['anxiety', 'stress', 'focus', 'calm'], moodTags: [1, 2, 3], isFeatured: true,
    steps: ['Sit comfortably. Breathe out slowly.', 'Inhale through your nose for 4 seconds.', 'Hold for 4 seconds.', 'Exhale for 4 seconds.', 'Hold for 4 seconds.', 'Repeat 5-10 rounds.'],
    stepsRw: ['Iyicare neza. Sohora umwuka buhoro.', 'Humeka mu mazuru amasaha 4.', 'Fata amasaha 4.', 'Sohora amasaha 4.', 'Fata amasaha 4.', 'Subiramo inshuro 5-10.'],
  },
  {
    _id: 'h_breathe_3', title: 'Deep Belly Breathing', titleRw: 'Guhumeka Byimbitse mu Gifu',
    type: 'breathing', duration: '10 min', icon: '\u{1FAA8}',
    description: 'Diaphragmatic breathing to activate relaxation response.',
    descriptionRw: 'Guhumeka bikorera mu gifu kugirango ukureho umuhangayiko.',
    tags: ['stress', 'relaxation', 'calm'], moodTags: [1, 2, 3, 4], isFeatured: false,
    steps: ['Lie on your back with knees bent.', 'Breathe in slowly through your nose.', 'Feel your belly rise.', 'Exhale through pursed lips.', 'Feel your belly lower.', 'Continue for 5-10 minutes.'],
    stepsRw: ['Ryama igituba kirashe.', 'Humeka buhoro mu mazuru.', 'Wumve igifu kirizirika.', 'Sohora umwuka mu kanwa.', 'Wumve igifu kigwa.', 'Komeza amasaha 5-10.'],
  },
  {
    _id: 'h_sound_1', title: 'Forest Rain Sounds', titleRw: 'Ijwi ry\'Imvura mu Ishamba',
    type: 'sound', duration: '60 min', icon: '\u{1F327}',
    description: 'Gentle rain falling through forest canopy. Perfect for sleep or relaxation.',
    descriptionRw: 'Imvura igwa buhoro mu ishamba. Ibereye ibitotsi cyangwa kuruhuka.',
    tags: ['sleep', 'relaxation', 'calm'], moodTags: [1, 2, 3, 4, 5], isFeatured: true,
    embedUrl: 'https://www.youtube.com/embed/_4o0HSN3uBU',
  },
  {
    _id: 'h_sound_2', title: 'Ocean Waves', titleRw: 'Umwondo w\'Inyanja',
    type: 'sound', duration: '120 min', icon: '\u{1F30A}',
    description: 'Soothing sounds of waves crashing on a peaceful shore.',
    descriptionRw: 'Ijwi rituje ry\'umwondo w\'inyanja ku nkombe.',
    tags: ['sleep', 'anxiety', 'calm'], moodTags: [1, 2, 3], isFeatured: true,
    embedUrl: 'https://www.youtube.com/embed/nXONgB3RMeM',
  },
  {
    _id: 'h_sound_3', title: 'Calm Piano Melodies', titleRw: 'Indirimbo za Piano Zituje',
    type: 'sound', duration: '45 min', icon: '\u{1F3B9}',
    description: 'Soft piano music for relaxation, focus, and emotional release.',
    descriptionRw: 'Piano y\'ituje yo kuruhuka, kwibanda, no gusohora amarangamutima.',
    tags: ['relaxation', 'focus', 'meditation'], moodTags: [1, 2, 3, 4, 5], isFeatured: false,
    embedUrl: 'https://www.youtube.com/embed/6ZrO90l_t1Q',
  },
  {
    _id: 'h_sleep_1', title: 'Body Scan Meditation', titleRw: 'Kwirora ku Mubiri',
    type: 'sleep_tool', duration: '20 min', icon: '\u{1F9D8}',
    description: 'A guided body scan to release tension and prepare for deep sleep.',
    descriptionRw: 'Kwirora ku mubiri kugirango urekure umunaniro.',
    tags: ['sleep', 'relaxation', 'meditation'], moodTags: [1, 2, 3], isFeatured: true,
    steps: ['Lie down comfortably. Close your eyes.', 'Take three deep breaths.', 'Focus on your feet. Relax them.', 'Move to your ankles, calves, knees.', 'Relax your hips, belly, back.', 'Move to chest, shoulders, arms.', 'Relax your neck, jaw, face.', 'Feel your whole body heavy and relaxed.'],
    stepsRw: ['Ryama neza. Funza amaso.', 'Fata imyuka itatu myinshi.', 'Tekereza ku birenge. Rubabaza.', 'Jya ku maguru, amavi.', 'Rubabaza ibinuno, igifu, umugongo.', 'Jya ku gituza, ibitugu, amaboko.', 'Rubabaza ijosi, isura.', 'Wumva umubiri wawe wose uremereye.'],
  },
  {
    _id: 'h_sleep_2', title: 'Progressive Muscle Relaxation', titleRw: 'Kuruhura Imitsi',
    type: 'sleep_tool', duration: '15 min', icon: '\u{1F9CD}',
    description: 'Tense and release each muscle group to signal your body to rest.',
    descriptionRw: 'Komeza urekure buri itsi ry\'imitsi kugirango umenyeshe umubiri wawe kuruhuka.',
    tags: ['sleep', 'anxiety', 'stress'], moodTags: [1, 2], isFeatured: false,
    steps: ['Lie down. Close your eyes.', 'Tense your feet — hold 5s. Release.', 'Tense your legs — hold 5s. Release.', 'Tense your abdomen — hold 5s. Release.', 'Tense your arms — hold 5s. Release.', 'Shrug your shoulders — hold 5s. Release.', 'Tense your face — hold 5s. Release.', 'Scan your body — breathe into tension.'],
    stepsRw: ['Ryama. Funza amaso.', 'Komeza ibirenge — ufate 5s. Rekura.', 'Komeza amaguru — ufate 5s. Rekura.', 'Komeza igifu — ufate 5s. Rekura.', 'Komeza amaboko — ufate 5s. Rekura.', 'Zamura ibitugu — ufate 5s. Rekura.', 'Komeza isura — ufate 5s. Rekura.', 'Kora scan y\'umubiri. Humekamo.'],
  },
  {
    _id: 'h_exercise_1', title: 'Gratitude Reflection', titleRw: 'Kwirora ku Bishimira',
    type: 'guided_exercise', duration: '10 min', icon: '\u{1F338}',
    description: 'A gentle guided reflection to find three things to be grateful for today.',
    descriptionRw: 'Kwirora kugirango ubone ibintu bitatu wishimira uyu munsi.',
    tags: ['gratitude', 'joy', 'mindfulness'], moodTags: [2, 3, 4], isFeatured: true,
    steps: ['Sit comfortably. Close your eyes.', 'Think of one small thing that brought peace today.', 'Think of one person who supported you.', 'Think of one thing you appreciate about yourself.', 'Hold these three things in your heart.', 'Gently open your eyes.'],
    stepsRw: ['Iyicare neza. Funza amaso.', 'Tekereza ikintu kimwe cyaguteye amahoro.', 'Tekereza umuntu wagutseye.', 'Tekereza ikintu kimwe ukunda kuri wowe.', 'Fata ibi bintu bitatu mu mutima.', 'Fungura amaso buhoro.'],
  },
  {
    _id: 'h_exercise_2', title: 'Self-Compassion Pause', titleRw: 'Kwifataho Impuhwe',
    type: 'guided_exercise', duration: '8 min', icon: '\u{1F49B}',
    description: 'Offer yourself the same kindness you would give a dear friend.',
    descriptionRw: 'Kwifataho ubuntu nk\'ubwo wayha inshuti yawe.',
    tags: ['self-care', 'compassion', 'anxiety'], moodTags: [1, 2, 3], isFeatured: false,
    steps: ['Place your hand over your heart.', 'Say: "This is a difficult moment."', 'Say: "May I be kind to myself."', 'Say: "May I give myself compassion."', 'Breathe deeply. Feel warmth.', 'Sit with this feeling.'],
    stepsRw: ['Shira ukuboko ku mutima.', 'Vuga: "Iki ni igihe kigoye."', 'Vuga: "Nkize kuba mwiza kuri njye."', 'Vuga: "Mpimbere impuhwe."', 'Humeka byimbitse. Wumve ubushyuhe.', 'Guma n\'iki kinyuranyo.'],
  },
  {
    _id: 'h_video_1', title: 'Understanding Anxiety', titleRw: 'Gusobanukirwa Ubwoba',
    type: 'video', duration: '12 min', icon: '\u{1F3AC}',
    description: 'Learn what happens in your brain during anxiety and how to manage it.',
    descriptionRw: 'Menya ibikorwa mu bwonko mu gihe cy\'ubwoba.',
    tags: ['anxiety', 'education', 'stress'], moodTags: [1, 2, 3], isFeatured: true,
    embedUrl: 'https://www.youtube.com/embed/qpO6So_Lsu4',
  },
  {
    _id: 'h_video_2', title: 'Healing After Loss', titleRw: 'Gukira Nyuma yo Gutakaza',
    type: 'video', duration: '18 min', icon: '\u{1F3AC}',
    description: 'A compassionate guide through grief and healing after loss.',
    descriptionRw: 'Ubuyobozi bwuzuye impuhwe mu gahinda.',
    tags: ['grief', 'healing', 'loss'], moodTags: [1, 2], isFeatured: true,
    embedUrl: 'https://www.youtube.com/embed/hN5M4sXQbM0',
  },
  {
    _id: 'h_article_1', title: 'Understanding Your Emotions', titleRw: 'Gusobanukirwa Amarangamutima',
    type: 'article', duration: '5 min read', icon: '\u{1F4D6}',
    description: 'Learn to identify, name, and work with your emotions.',
    descriptionRw: 'Menya gushaka, kwita, no gukorana n\'amarangamutima yawe.',
    tags: ['education', 'emotions', 'self-care'], moodTags: [1, 2, 3, 4, 5], isFeatured: false,
    steps: ['Emotions are information from your body.', 'When you feel something strong, pause and name it.', 'Locate it in your body.', 'Breathe into that sensation.', 'Ask what it wants you to know.', 'Respond with kindness.'],
    stepsRw: ['Amanyakuri ni amakuru y\'umubiri.', 'Iyo wumva ikintu gikomeye, hagara ukivuge.', 'Kibone mu mubiri.', 'Humekamo.', 'Ibaza iki gishaka ko umenya.', 'Subiza mu bwiza.'],
  },
];

export const mockHealing = {
  getAll: (params) => {
    let filtered = [..._healingResources];
    if (params?.type) filtered = filtered.filter((r) => r.type === params.type);
    if (params?.tag) filtered = filtered.filter((r) => r.tags.includes(params.tag));
    return { data: { resources: filtered } };
  },
  getByType: (type) => ({
    data: { resources: _healingResources.filter((r) => r.type === type) },
  }),
  getRecommended: () => {
    const featured = _healingResources.filter((r) => r.isFeatured).slice(0, 6);
    return {
      data: {
        resources: featured,
        context: { averageMood: 3.2, dominantTags: ['anxiety', 'stress'] },
      },
    };
  },
  getOne: (id) => {
    const r = _healingResources.find((x) => x._id === id);
    return { data: { resource: r } };
  },
};



export const mockInsights = {
  getWeekly: () => ({
    data: {
      insight: {
        weekStarting: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10),
        entryCount: 6,
        journalCount: 2,
        weeklyAverage: 3.5,
        trend: 'improving',
        aiReflection: 'This week shows you are learning to name what you feel. That is a big step. When you track your mood, you are telling yourself that your inner world matters. Keep showing up for yourself — even the hard days are part of the journey.',
        journals: [
          { id: 'j1', title: 'Umutima wuje amahoro', preview: 'Uyu munsi narose ndeba uko izuba rirashe...', date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: 'j2', title: 'Kugira ubwoba bw\'ibizamini', preview: 'Ntekereza cyane ku bizamini biri imbere...', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        ],
      },
    },
  }),
};
