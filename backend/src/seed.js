const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const User = require('./models/User');
const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const Community = require('./models/Community');
const Message = require('./models/Message');
const Counselor = require('./models/Counselor');
const CounselingSession = require('./models/CounselingSession');
const CrisisResource = require('./models/CrisisResource');
const HealingResource = require('./models/HealingResource');

const SAMPLE_USER_ID = new mongoose.Types.ObjectId();
const NOW = new Date();

const users = [
  {
    _id: SAMPLE_USER_ID,
    anonymousId: 'MuteziInyenyeri841',
    displayName: 'MuteziInyenyeri',
    language: 'rw',
    isAnonymous: true,
    role: 'admin',
    onboardingComplete: true,
    preferredTopics: ['Anxiety', 'Stress', 'Grief'],
    joinedCommunities: [],
    moodStreak: 7,
    lastMoodDate: new Date(NOW - 86400000),
    createdAt: new Date(NOW - 86400000 * 30),
  },
  {
    anonymousId: 'AdminMutesi123',
    displayName: 'Admin Mutesi',
    email: 'admin@mindspace.rw',
    password: '$2a$12$nHq7EY0SEFYkAL.OvuuBROy.6LMCAeCNwbHvbEGVAp5vS8mV4RQry',
    language: 'en',
    isAnonymous: false,
    role: 'admin',
    onboardingComplete: true,
    joinedCommunities: [],
    createdAt: new Date(NOW - 86400000 * 10),
  },
];

const moods = [];
const moodEmojis = { 5: '\u{1F60A}', 4: '\u{1F642}', 3: '\u{1F610}', 2: '\u{1F614}', 1: '\u{1F622}' };
const moodNotes = [
  'Had a good day', 'Felt tired', 'Productive morning', 'A bit anxious',
  'Peaceful evening', 'Met with friends', 'Quiet day at home',
];
for (let i = 29; i >= 0; i--) {
  const d = new Date(NOW - 86400000 * i);
  const val = Math.random() < 0.2 ? 3 : [5, 4, 4, 3, 3, 3, 2][Math.floor(Math.random() * 7)];
  moods.push({
    user: SAMPLE_USER_ID,
    value: val,
    emoji: moodEmojis[val],
    note: moodNotes[Math.floor(Math.random() * moodNotes.length)],
    tags: [],
    date: d,
  });
}

const journals = [
  {
    user: SAMPLE_USER_ID,
    title: 'Umutima wuje amahoro',
    content: 'Uyu munsi narose ndeba uko izuba rirashe. Nibutse ko buri munsi ari ikindi gitangaza. Nshimira akanya k\'amahoro nafite. Byambukijije ko n\'ubwo hari ibibazo, hari ibyiza.',
    prompt: 'Ni iki cyaguteye amahoro mu mutima wawe uyu munsi?',
    mood: 4,
    tags: ['gratitude', 'amahoro'],
    createdAt: new Date(NOW - 86400000 * 2),
  },
  {
    user: SAMPLE_USER_ID,
    title: 'Kugira ubwoba bw\'ibizamini',
    content: 'Ntekereza cyane ku bizamini biri imbere. Umutima wange uradunda iyo ntekereje. Nkeneye kwibuka guhumeka no gufata buri kintu gikurikiye ikindi. Sinifuza gukomeza kugira ubwoba.',
    prompt: 'Ni iki kiguteye ubwoba?',
    mood: 2,
    tags: ['anxiety', 'ubwoba'],
    createdAt: new Date(NOW - 86400000 * 5),
  },
  {
    user: SAMPLE_USER_ID,
    title: 'Ikiganiro n\'inshuti',
    content: 'Nagize ikiganiro cyiza na Jean-Pierre. Twavuganye ku nzozi zacu n\'ibyo dutinya. Byumvikanye neza kumva ngo n\'umva. Nshimira kugira inshuti nk\'iyo.',
    prompt: 'Wumva ute ubwo utekereza abantu ukunda?',
    mood: 5,
    tags: ['friends', 'gratitude'],
    createdAt: new Date(NOW - 86400000 * 8),
  },
  {
    user: SAMPLE_USER_ID,
    title: 'Imvura y\'amahoro',
    content: 'Imvura iragwa. Nicaye iriya ndebe uko igwa. Rimwe na rimwe guceceka ni umuti mwiza. Ntekereje ku bintu byinshi, ariko numva mpumuye. Iyi mvura iransukura.',
    prompt: 'Ni iki kikuzanira amahoro?',
    mood: 3,
    tags: ['reflection', 'amahoro'],
    createdAt: new Date(NOW - 86400000 * 12),
  },
  {
    user: SAMPLE_USER_ID,
    title: 'Kwangara no gukomeza',
    content: 'Uyu munsi waranganye. Nibutse ibintu byinshi byabaye mu buzima. Ariko nzirikana ko nkomeye. Nanyuze mu byinshi ariko ndahari. Ubu ndiga kwitaho umutima wange.',
    prompt: 'Wibuka igihe wagombaga gukomeza n\'ubwo byari bigoye?',
    mood: 3,
    tags: ['strength', 'healing'],
    createdAt: new Date(NOW - 86400000 * 15),
  },
];

const communities = [
  {
    name: 'Anxiety Support',
    nameRw: 'Ubufasha ku Bwoba',
    description: 'A safe space to share and manage anxiety together.',
    descriptionRw: 'Ahantu hatekanye ho gusangira no gukemura ubwoba.',
    topic: 'Anxiety',
    icon: '',
    memberCount: 47,
  },
  {
    name: 'Grief & Loss',
    nameRw: 'Agahinda no Gutakaza',
    description: 'Healing together through loss and grief.',
    descriptionRw: 'Gukira hamwe mu gahinda no gutakaza.',
    topic: 'Grief',
    icon: '',
    memberCount: 32,
  },
  {
    name: 'PTSD Recovery',
    nameRw: 'Gukira PTSD',
    description: 'Support for those healing from trauma and PTSD.',
    descriptionRw: 'Ubufasha ku bazima barangwaho PTSD.',
    topic: 'PTSD',
    icon: '',
    memberCount: 28,
  },
  {
    name: 'Burnout Relief',
    nameRw: 'Kuruhuka mu Mirimo',
    description: 'For professionals and students facing burnout.',
    descriptionRw: 'Ku bakozi n\'abanyeshuri bahanganye no kunanirwa.',
    topic: 'Burnout',
    icon: '',
    memberCount: 55,
  },
  {
    name: 'Depression Support',
    nameRw: 'Ubufasha ku Bihebye',
    description: 'A compassionate community for those navigating depression.',
    descriptionRw: 'Umuryango ugirana impuhwe ku bahanganye na depression.',
    topic: 'Depression',
    icon: '',
    memberCount: 39,
  },
  {
    name: 'Stress Management',
    nameRw: 'Gucunga Umuhangayiko',
    description: 'Tips, tools, and support for daily stress.',
    descriptionRw: 'Amabwiriza, ibikoresho, n\'ubufasha ku muhangayiko wa buri munsi.',
    topic: 'Stress',
    icon: '',
    memberCount: 61,
  },
];

const communityMessageTexts = [
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
];

const counselors = [
  {
    fullName: 'Dr. Alice Mukamana',
    email: 'alice.mukamana@example.com',
    phone: '+250788100001',
    bio: 'Clinical psychologist specializing in trauma and PTSD recovery.',
    bioRw: 'Umuhanga mu bya psychologue ukora kuri trauma na PTSD.',
    specialization: ['Trauma', 'PTSD', 'Anxiety'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    rating: 4.8,
  },
  {
    fullName: 'Jean-Baptiste Habimana',
    email: 'jb.habimana@example.com',
    phone: '+250788100002',
    bio: 'Counseling psychologist focused on youth mental health and grief.',
    bioRw: 'Umujyanama wa psychologue ku rubyiruko n\'agahinda.',
    specialization: ['Grief', 'Youth', 'Depression'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    rating: 4.6,
  },
  {
    fullName: 'Gloria Uwimana',
    email: 'gloria.uwimana@example.com',
    phone: '+250788100003',
    bio: 'Specialist in cognitive behavioral therapy and stress management.',
    bioRw: 'Umuhanga mu kuvura imitekerereze no gucunga umuhangayiko.',
    specialization: ['Stress', 'Anxiety', 'Burnout'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
  },
  {
    fullName: 'Patrick Mugisha',
    email: 'patrick.mugisha@example.com',
    phone: '+250788100004',
    bio: 'Mental health counselor with 10 years of experience in community outreach.',
    bioRw: 'Umujyanama mu mutima ufite uburambe bw\'imyaka 10.',
    specialization: ['Depression', 'Stress', 'Relationships'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: false,
    rating: 4.5,
  },
];

const counselingMessages = [
  { content: 'Hello, I have been feeling very anxious lately.', fromCounselor: false, hoursAgo: 2 },
  { content: 'Thank you for reaching out. Can you tell me more about what triggers this anxiety?', fromCounselor: true, hoursAgo: 1.5 },
  { content: 'It usually happens before meetings or when I have to speak in front of people.', fromCounselor: false, hoursAgo: 1 },
  { content: 'That sounds like social anxiety, which is very common and treatable. Let us work on some grounding techniques you can use before meetings.', fromCounselor: true, hoursAgo: 0.5 },
];

const crisisResources = [
  {
    name: 'Rwanda Mental Health Hotline',
    nameRw: 'Terefone y\'Ubufasha mu Mutima',
    type: 'hotline',
    phone: '3002',
    description: 'Free 24/7 mental health support hotline.',
    descriptionRw: 'Terefone y\'ubufasha mu mutima ku buntu, 24/7.',
    isVerified: true,
  },
  {
    name: 'National Emergency Service',
    nameRw: 'Serivisi y\'Ikiza',
    type: 'emergency',
    phone: '112',
    description: 'National emergency response — police, ambulance, fire.',
    descriptionRw: 'Serivisi y\'ikiza — polisi, ambulance, umuriro.',
    isVerified: true,
  },
  {
    name: 'Gender Based Violence Hotline',
    nameRw: 'Terefone yo Kurwanya Ihohoterwa',
    type: 'hotline',
    phone: '3425',
    description: 'Support for survivors of gender-based violence.',
    descriptionRw: 'Ubufasha ku bahozeho ihohoterwa.',
    isVerified: true,
  },
  {
    name: 'CARITAS Rwanda',
    nameRw: 'CARITAS Rwanda',
    type: 'ngo',
    phone: '+250788301000',
    location: 'Kigali',
    description: 'Psychosocial support and counseling services.',
    descriptionRw: 'Serivisi z\'ubujyanama mu mutima.',
    isVerified: true,
  },
  {
    name: 'Ndera Neuropsychiatric Hospital',
    nameRw: 'Ibitaro bya Ndera',
    type: 'health_center',
    phone: '+250788201000',
    location: 'Ndera, Kigali',
    description: 'Specialized mental health hospital.',
    descriptionRw: 'Ibitaro by\'indwara zo mu mutima.',
    isVerified: true,
  },
  {
    name: 'Isange One Stop Center',
    nameRw: 'Isange One Stop Center',
    type: 'health_center',
    phone: '3425',
    location: 'Kacyiru, Kigali',
    description: 'Comprehensive support for survivors of violence.',
    descriptionRw: 'Ubufasha bwuzuye ku bahozeho ihohoterwa.',
    isVerified: true,
  },
];

const breathingExercises = [
  {
    title: '4-7-8 Breathing',
    titleRw: 'Guhumeka 4-7-8',
    type: 'breathing',
    description: 'A calming breathing technique that helps reduce anxiety and helps you fall asleep. Inhale for 4 seconds, hold for 7, exhale for 8.',
    descriptionRw: 'Ubuhumekero bumaraガングirira ubwoba n’ibibazo by’imitsi. Uhumeka amasaha 4, ufata amasaha 7, usohora amasaha 8.',
    duration: '5 min',
    icon: '\u{1F9D8}',
    tags: ['anxiety', 'sleep', 'calm', 'stress'],
    moodTags: [1, 2, 3],
    isFeatured: true,
    steps: [
      'Find a comfortable seated position. Close your eyes.',
      'Exhale completely through your mouth, making a whoosh sound.',
      'Close your mouth and inhale quietly through your nose for 4 seconds.',
      'Hold your breath for 7 seconds.',
      'Exhale completely through your mouth for 8 seconds.',
      'Repeat 4-8 times or until you feel calm.',
    ],
    stepsRw: [
      'Shakisha ahantu hiza wicara. Ufunze amaso.',
      'Sohora umwuka wose mu kanwa, ukora ijwi rya whoosh.',
      'Funga akanwa kawe ugahumeka mu mazuru mu amasaha 4.',
      'Fata umwuka wawe amasaha 7.',
      'Sohora umwuka wose mu kanwa mu amasaha 8.',
      'Subiramo inshuro 4-8 cyangwa kugeza umerewe neza.',
    ],
  },
  {
    title: 'Box Breathing',
    titleRw: 'Guhumeka Agasanduku',
    type: 'breathing',
    description: 'A simple breathing technique used by Navy SEALS to stay calm under pressure. Inhale, hold, exhale, hold — each for 4 seconds.',
    descriptionRw: 'Ubuhumekero bworoshye bukoreshwa na Navy SEALS kugirango bagume batekanye. Uhumeka, ufata, usohora, ufata — buri kimwe amasaha 4.',
    duration: '5 min',
    icon: '\u{25A6}',
    tags: ['anxiety', 'stress', 'focus', 'calm'],
    moodTags: [1, 2, 3],
    isFeatured: true,
    steps: [
      'Sit comfortably with your back straight. Breathe out slowly.',
      'Inhale through your nose for 4 seconds — fill your lungs completely.',
      'Hold your breath for 4 seconds.',
      'Exhale slowly through your mouth for 4 seconds.',
      'Hold your breath again for 4 seconds.',
      'Repeat for 5-10 rounds.',
    ],
    stepsRw: [
      'Iyicare neza umugongo ugore. Sohora umwuka buhoro.',
      'Humeka mu mazuru amasaha 4 — uzuze ibihaha.',
      'Fata umwuka amasaha 4.',
      'Sohora umwuka mu kanwa buhoro amasaha 4.',
      'Fata umwuka nanone amasaha 4.',
      'Subiramo inshuro 5-10.',
    ],
  },
  {
    title: 'Deep Belly Breathing',
    titleRw: 'Guhumeka Byimbitse mu Gifu',
    type: 'breathing',
    description: 'Diaphragmatic breathing to activate your body\'s relaxation response and lower stress hormones.',
    descriptionRw: 'Guhumeka bikorera mu gifu kugirango ukureho umuhangayiko.',
    duration: '10 min',
    icon: '\u{1FAA8}',
    tags: ['stress', 'relaxation', 'calm', 'body'],
    moodTags: [1, 2, 3, 4],
    isFeatured: false,
    steps: [
      'Lie on your back on a flat surface with knees bent. Place one hand on your chest, the other on your belly.',
      'Breathe in slowly through your nose — feel your belly rise under your hand.',
      'Keep your chest still — all the movement should be in your belly.',
      'Tighten your abdominal muscles and exhale through pursed lips — feel your belly lower.',
      'Continue for 5-10 minutes, focusing on the rise and fall of your belly.',
    ],
    stepsRw: [
      'Ryama igituba kirashe, amavi afunze. Shira ukuboko kumwe ku gituza, ukundi ku gifu.',
      'Humeka buhoro mu mazuru — wumve igifu cyawe kirizirika.',
      'Guma igituza kidakora — byose bigomba kuba mu gifu.',
      'Komeza imitsi y\'igifu usohore umwuka mu kanwa — wumve igifu kigwa.',
      'Komeza amasaha 5-10, wibande ku kuzamuka no kumanuka kw\'igifu.',
    ],
  },
];

const soundResources = [
  {
    title: 'Forest Rain Sounds',
    titleRw: 'Ijwi ry\'Imvura mu Ishamba',
    type: 'sound',
    description: 'Gentle rain falling through forest canopy. Perfect for sleep, study, or relaxation.',
    descriptionRw: 'Imvura igwa buhoro mu ishamba. Ibereye ibitotsi, kwiga, cyangwa kuruhuka.',
    duration: '60 min',
    url: 'https://www.youtube.com/watch?v=_4o0HSN3uBU',
    embedUrl: 'https://www.youtube.com/embed/_4o0HSN3uBU',
    icon: '\u{1F327}',
    tags: ['sleep', 'relaxation', 'calm', 'study'],
    moodTags: [1, 2, 3, 4, 5],
    isFeatured: true,
  },
  {
    title: 'Ocean Waves',
    titleRw: 'Umwondo w’Inyanja',
    type: 'sound',
    description: 'Soothing sounds of waves crashing on a peaceful shore. Helps reduce anxiety and promote deep sleep.',
    descriptionRw: 'Ijwi rituje ry\'umwondo w\'inyanja ku nkombe. Rifasha gukuraho ubwoba no kugira ibitotsi byiza.',
    duration: '120 min',
    url: 'https://www.youtube.com/watch?v=nXONgB3RMeM',
    embedUrl: 'https://www.youtube.com/embed/nXONgB3RMeM',
    icon: '\u{1F30A}',
    tags: ['sleep', 'anxiety', 'calm', 'relaxation'],
    moodTags: [1, 2, 3],
    isFeatured: true,
  },
  {
    title: 'Lake Evening Ambience',
    titleRw: 'Ijwi ry’Ikigali mu Mugoroba',
    type: 'sound',
    description: 'Calm evening sounds by the lake — crickets, gentle water, and distant birds.',
    descriptionRw: 'Ijwi rituje ry\'ikiyaga mu mugoroba — ibisimbura, amazi y\'ituje, n\'inyoni kure.',
    duration: '90 min',
    url: 'https://www.youtube.com/watch?v=WDH0MfBRe9I',
    embedUrl: 'https://www.youtube.com/embed/WDH0MfBRe9I',
    icon: '\u{1F30C}',
    tags: ['sleep', 'calm', 'relaxation', 'meditation'],
    moodTags: [1, 2, 3, 4],
    isFeatured: false,
  },
  {
    title: 'Calm Piano Melodies',
    titleRw: 'Indirimbo za Piano Zituje',
    type: 'sound',
    description: 'Soft piano music for relaxation, focus, and emotional release.',
    descriptionRw: 'Piano y\'ituje yo kuruhuka, kwibanda, no gusohora amarangamutima.',
    duration: '45 min',
    url: 'https://www.youtube.com/watch?v=6ZrO90l_t1Q',
    embedUrl: 'https://www.youtube.com/embed/6ZrO90l_t1Q',
    icon: '\u{1F3B9}',
    tags: ['relaxation', 'focus', 'meditation', 'grief'],
    moodTags: [1, 2, 3, 4, 5],
    isFeatured: false,
  },
];

const sleepTools = [
  {
    title: 'Body Scan Meditation',
    titleRw: 'Kwirora ku Mubiri',
    type: 'sleep_tool',
    description: 'A guided body scan to release physical tension and prepare your body for deep sleep.',
    descriptionRw: 'Kwirora ku mubiri kugirango urekure umunaniro n\'ugutegura umubiri wawe ku bitotsi byiza.',
    duration: '20 min',
    icon: '\u{1F9D8}',
    tags: ['sleep', 'relaxation', 'body', 'meditation'],
    moodTags: [1, 2, 3],
    isFeatured: true,
    steps: [
      'Lie down comfortably in bed. Close your eyes.',
      'Take three deep breaths — with each exhale, feel yourself sinking deeper.',
      'Bring attention to your feet. Notice any sensations. Relax them completely.',
      'Slowly move your attention up: ankles, calves, knees, thighs.',
      'Relax your hips, belly, lower back. Breathe into any tightness.',
      'Move to your chest, shoulders, arms, hands. Let them soften.',
      'Relax your neck, jaw, face, scalp. Let your face be completely soft.',
      'Now feel your whole body heavy and relaxed. Stay here breathing gently.',
    ],
    stepsRw: [
      'Ryama neza mu buriri. Funza amaso.',
      'Fata imyuka itatu myinshi — buri gihe usohora, wumva uri kuba uremereye.',
      'Tekereza ku birenge byawe. Ibaze ibyo wumva. Rubabaza byose.',
      'Hora uzamuka: amaguru, amavi, amavi, ibikomokono.',
      'Rubabaza ibinuno, igifu, umugongo. Humekamo aho bikoneye.',
      'Jya ku gituza, ku bitugu, ku maboko, ku ntoki. Reka byoroshye.',
      'Rubabaza ijosi, urutiriganya, isura, agahanga. Reka isura yawe ibe yoroshye.',
      'Ubu wumva umubiri wawe wose uremereye kandi uruhutse. Guma hano uhumeka buhoro.',
    ],
  },
  {
    title: 'Progressive Muscle Relaxation',
    titleRw: 'Kuruhura Imitsi buhoro buhoro',
    type: 'sleep_tool',
    description: 'Tense and release each muscle group to signal your body that it is time to rest.',
    descriptionRw: 'Komeza urekure buri itsi ry\'imitsi kugirango umenyeshe umubiri wawe ko ari igihe cyo kuruhuka.',
    duration: '15 min',
    icon: '\u{1F9CD}',
    tags: ['sleep', 'anxiety', 'stress', 'body'],
    moodTags: [1, 2],
    isFeatured: false,
    steps: [
      'Lie down and close your eyes. Take a few slow breaths.',
      'Tense your feet — curl your toes tightly for 5 seconds. Release and notice the relaxation.',
      'Tense your calves and thighs — hold for 5 seconds. Release.',
      'Tense your abdomen and buttocks — squeeze for 5 seconds. Release.',
      'Make fists and tense your arms — hold for 5 seconds. Release.',
      'Shrug your shoulders up to your ears — hold for 5 seconds. Drop and relax.',
      'Tense your face — scrunch everything for 5 seconds. Release completely.',
      'Scan your body from head to toe. If you find tension, breathe into that spot.',
    ],
    stepsRw: [
      'Ryama ufunze amaso. Humeka buhoro.',
      'Komeza ibirenge — funya amano amasaha 5. Rekura wumve guhagarara.',
      'Komeza imitsi y\'amaguru — ufate amasaha 5. Rekura.',
      'Komeza igifu n\'ibinuno — komeza amasaha 5. Rekura.',
      'Komeza intoki n\'amaboko — ufate amasaha 5. Rekura.',
      'Zamura ibitugu kugeza ku matwi — ufate amasaha 5. Rekura.',
      'Komeza isura — komeza byose amasaha 5. Rekura.',
      'Kora scan y\'umubiri uva ku mutwe kugeza ku birenge. Niba hari umunaniro, humekamo.',
    ],
  },
];

const guidedExercises = [
  {
    title: 'Gratitude Reflection',
    titleRw: 'Kwirora ku Bishimira',
    type: 'guided_exercise',
    description: 'A gentle guided reflection to help you find three things to be grateful for today.',
    descriptionRw: 'Kwirora kugirango ubone ibintu bitatu wishimira uyu munsi.',
    duration: '10 min',
    icon: '\u{1F338}',
    tags: ['gratitude', 'joy', 'mindfulness', 'depression'],
    moodTags: [2, 3, 4],
    isFeatured: true,
    steps: [
      'Sit comfortably and close your eyes. Take three deep breaths.',
      'Think about today. What is one small thing that brought you a moment of peace?',
      'Now think of one person who has supported you — even in a small way.',
      'Finally, think of one thing about yourself that you appreciate — your strength, your kindness, your resilience.',
      'Hold these three things in your heart. Breathe into the feeling of gratitude.',
      'When you are ready, gently open your eyes.',
    ],
    stepsRw: [
      'Iyicare neza ufunze amaso. Fata imyuka itatu myinshi.',
      'Tekereza kuri uyu munsi. Ni iki gitoya cyaguteye amahoro?',
      'Ubu tekereza ku muntu wagutseye — n\'ubwo byaba ari bike.',
      'Hanyuma tekereza ikintu kimwe ukunda kuri wowe — imbaraga zawe, ubuntu bwawe, ubushobozi bwawe.',
      'Fata ibi bintu bitatu mu mutima wawe. Humeka mu byishimo.',
      'Igihe witeguye, fungura amaso buhoro.',
    ],
  },
  {
    title: 'Self-Compassion Pause',
    titleRw: 'Kwifataho Impuhwe',
    type: 'guided_exercise',
    description: 'A short practice to offer yourself the same kindness you would give a dear friend.',
    descriptionRw: 'Imyitozo migufi yo kwifataho ubuntu nk\'ubwo wayha inshuti yawe.',
    duration: '8 min',
    icon: '\u{1F49B}',
    tags: ['self-care', 'compassion', 'anxiety', 'depression'],
    moodTags: [1, 2, 3],
    isFeatured: false,
    steps: [
      'Place your hand over your heart. Feel the warmth of your touch.',
      'Say to yourself: "This is a difficult moment. Difficulty is part of living."',
      'Now say: "May I be kind to myself in this moment."',
      'Say: "May I give myself the compassion I need."',
      'Breathe deeply and imagine warmth spreading from your hand into your chest.',
      'Sit with this feeling for a few more breaths. You deserve kindness.',
    ],
    stepsRw: [
      'Shira ukuboko kwawe ku mutima. Wumve ubushyuhe.',
      'Iwugire: "Iki ni igihe kigoye. Ibibazo ni igice cy\'ubuzima."',
      'Ubu wivugire: "Nkize kuba umuntu mwiza kuri njye muri iki gihe."',
      'Wivugire: "Mpimbere impuhwe nkeneye."',
      'Humeka byimbitse utekereze ubushyuhe buvuye mu kuboko bwerekeza mu gituza.',
      'Guma n\'iki kinyuranyo amasaha make. Ukwiriye kugirirwa neza.',
    ],
  },
];

const videoResources = [
  {
    title: 'Understanding Anxiety',
    titleRw: 'Gusobanukirwa Ubwoba',
    type: 'video',
    description: 'Learn what happens in your brain during anxiety and practical ways to manage it.',
    descriptionRw: 'Menya ibikorwa mu bwonko bwawe mu gihe cy\'ubwoba n\'uburyo bwo kubugenzura.',
    duration: '12 min',
    url: 'https://www.youtube.com/watch?v=qpO6So_Lsu4',
    embedUrl: 'https://www.youtube.com/embed/qpO6So_Lsu4',
    icon: '\u{1F3AC}',
    tags: ['anxiety', 'education', 'stress'],
    moodTags: [1, 2, 3],
    isFeatured: true,
  },
  {
    title: 'Healing After Loss',
    titleRw: 'Gukira Nyuma yo Gutakaza',
    type: 'video',
    description: 'A compassionate guide through grief and the journey of healing after losing a loved one.',
    descriptionRw: 'Ubuyobozi bwuzuye impuhwe mu gahinda no gukira nyuma yo gutakaza umuntu ukunda.',
    duration: '18 min',
    url: 'https://www.youtube.com/watch?v=hN5M4sXQbM0',
    embedUrl: 'https://www.youtube.com/embed/hN5M4sXQbM0',
    icon: '\u{1F3AC}',
    tags: ['grief', 'healing', 'loss'],
    moodTags: [1, 2],
    isFeatured: true,
  },
  {
    title: 'Morning Mindfulness',
    titleRw: 'Kwirora mu Gitondo',
    type: 'video',
    description: 'Start your day with a 10-minute mindfulness practice to set a calm, focused tone.',
    descriptionRw: 'Tangira umunsi wawe n\'iminota 10 yo kwirora kugirango utangire amahoro.',
    duration: '10 min',
    url: 'https://www.youtube.com/watch?v=3nQvVrPkSqg',
    embedUrl: 'https://www.youtube.com/embed/3nQvVrPkSqg',
    icon: '\u{1F3AC}',
    tags: ['mindfulness', 'morning', 'calm', 'focus'],
    moodTags: [3, 4, 5],
    isFeatured: false,
  },
];

const articles = [
  {
    title: 'Understanding Your Emotions',
    titleRw: 'Gusobanukirwa Amarangamutima Yawe',
    type: 'article',
    description: 'Learn to identify, name, and work with your emotions instead of against them.',
    descriptionRw: 'Menya gushaka, kwita, no gukorana n\'amarangamutima yawe aho kuyarwanya.',
    duration: '5 min read',
    icon: '\u{1F4D6}',
    tags: ['education', 'emotions', 'self-care'],
    moodTags: [1, 2, 3, 4, 5],
    isFeatured: false,
    steps: [
      'Emotions are not good or bad — they are information from your body.',
      'When you feel something strong, pause. Name it: "I notice I am feeling anxious."',
      'Locate it in your body: "I feel tightness in my chest."',
      'Breathe into that sensation. Do not try to change it — just observe.',
      'Ask: "What does this emotion want me to know?"',
      'Respond with kindness rather than judgment.',
    ],
    stepsRw: [
      'Amanyakuri ntabwo ari mabi cyangwa meza — ni amakuru avuye mu mubiri wawe.',
      'Iyo wumva ikintu gikomeye, hagara. Kyita: "Ndabona numva mfite ubwoba."',
      'Kibone mu mubiri: "Numva bigoye mu gituza."',
      'Humekamo iyo myumviro. Ntugerageze kuyihindura — irebe gusa.',
      'Ibaza: "Ni iki iki kirangamutima gishaka ko nmenya?"',
      'Subiza mu bwiza aho gucira urubanza.',
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Mood.deleteMany({}),
      Journal.deleteMany({}),
      Community.deleteMany({}),
      Message.deleteMany({}),
      Counselor.deleteMany({}),
      CounselingSession.deleteMany({}),
      CrisisResource.deleteMany({}),
      HealingResource.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Seed users
    await User.insertMany(users);
    console.log(`Seeded ${users.length} user`);

    // Seed moods
    await Mood.insertMany(moods);
    console.log(`Seeded ${moods.length} mood entries`);

    // Seed journals
    await Journal.insertMany(journals);
    console.log(`Seeded ${journals.length} journal entries`);

    // Seed communities
    const createdCommunities = await Community.insertMany(communities);
    console.log(`Seeded ${createdCommunities.length} communities`);

    // Seed community messages
    const communityMessages = [];
    for (const c of createdCommunities) {
      const names = ['Mutezi', 'Umuhanga', 'Intwali', 'Kirebe', 'Icyiza'];
      const nouns = ['Inyenyeri', 'Umuyaga', 'Ikivuguto', 'Akanyoni'];
      for (let i = 0; i < 12; i++) {
        communityMessages.push({
          sender: SAMPLE_USER_ID,
          anonymousName: names[i % names.length] + nouns[i % nouns.length] + Math.floor(Math.random() * 100),
          content: communityMessageTexts[i % communityMessageTexts.length],
          community: c._id,
          createdAt: new Date(NOW - (12 - i) * 7200000),
        });
      }
    }
    await Message.insertMany(communityMessages);
    console.log(`Seeded ${communityMessages.length} community messages`);

    // Update user's joined communities
    await User.findByIdAndUpdate(SAMPLE_USER_ID, {
      $set: { joinedCommunities: [createdCommunities[0]._id, createdCommunities[3]._id] },
    });
    console.log('Updated user joined communities');

    // Seed counselor user accounts
    const counselorUsers = [];
    for (const c of counselors) {
      const u = await User.create({
        anonymousId: c.fullName.replace(/[^a-zA-Z]/g, '') + Math.floor(Math.random() * 100),
        displayName: c.fullName,
        email: c.email,
        password: '$2a$12$nHq7EY0SEFYkAL.OvuuBROy.6LMCAeCNwbHvbEGVAp5vS8mV4RQry',
        language: 'rw',
        isAnonymous: false,
        role: 'counselor',
        onboardingComplete: true,
      });
      counselorUsers.push(u);
    }

    // Seed counselors
    const counselorsWithUsers = counselors.map((c, i) => ({
      ...c,
      user: counselorUsers[i]._id,
    }));
    const createdCounselors = await Counselor.insertMany(counselorsWithUsers);
    console.log(`Seeded ${createdCounselors.length} counselors`);

    // Seed counseling session + messages
    const session = await CounselingSession.create({
      user: SAMPLE_USER_ID,
      counselor: createdCounselors[0]._id,
      status: 'active',
      topic: 'Feeling overwhelmed with work',
      priority: 'normal',
      startedAt: new Date(NOW - 86400000),
    });
    const sessionMessages = counselingMessages.map((m) => ({
      sender: m.fromCounselor ? undefined : SAMPLE_USER_ID,
      anonymousName: m.fromCounselor ? createdCounselors[0].fullName : 'You',
      content: m.content,
      session: session._id,
      isFromAI: false,
      createdAt: new Date(NOW - m.hoursAgo * 3600000),
    }));
    await Message.insertMany(sessionMessages);
    console.log(`Seeded ${sessionMessages.length} counseling messages`);

    // Seed crisis resources
    await CrisisResource.insertMany(crisisResources);
    console.log(`Seeded ${crisisResources.length} crisis resources`);

    // Seed healing resources
    const allHealing = [
      ...breathingExercises,
      ...soundResources,
      ...sleepTools,
      ...guidedExercises,
      ...videoResources,
      ...articles,
    ];
    await HealingResource.insertMany(allHealing);
    console.log(`Seeded ${allHealing.length} healing resources (${breathingExercises.length} breathing, ${soundResources.length} sounds, ${sleepTools.length} sleep tools, ${guidedExercises.length} guided exercises, ${videoResources.length} videos, ${articles.length} articles)`);

    console.log('\nSeed complete! All sample data is in MongoDB.');
    console.log(`Sample user: anonymousId=MuteziInyenyeri841, displayName=MuteziInyenyeri (admin role)`);
    console.log(`Admin login: email=admin@mindspace.rw, password=admin123`);
    console.log(`Counselor login: use any counselor email, password=admin123`);
    console.log(`Open http://localhost:3000/onboarding and continue anonymously to see live data.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
