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
const { Assessment, AssessmentResult } = require('./models/Assessment');
const { Course, Enrollment } = require('./models/Course');
const { Booking, CounselorAvailability } = require('./models/Booking');

const SAMPLE_USER_ID = new mongoose.Types.ObjectId();
const SAMPLE_USER_ID2 = new mongoose.Types.ObjectId();
const NOW = new Date();

const users = [
  {
    _id: SAMPLE_USER_ID,
    anonymousId: 'IntwaliInyenyeri850',
    displayName: 'IntwaliInyenyeri850',
    language: 'rw',
    isAnonymous: true,
    role: 'admin',
    onboardingComplete: true,
    preferredTopics: ['Anxiety', 'Stress', 'Grief', 'Depression'],
    joinedCommunities: [],
    moodStreak: 7,
    lastMoodDate: new Date(NOW - 86400000),
    age: 28,
    relationshipStatus: 'single',
    createdAt: new Date(NOW - 86400000 * 30),
  },
  {
    _id: SAMPLE_USER_ID2,
    anonymousId: 'MutesiUrugero123',
    displayName: 'MutesiUrugero',
    language: 'en',
    isAnonymous: true,
    role: 'user',
    onboardingComplete: true,
    preferredTopics: ['Stress', 'Relationships'],
    joinedCommunities: [],
    moodStreak: 3,
    lastMoodDate: new Date(NOW - 43200000),
    age: 32,
    relationshipStatus: 'married',
    createdAt: new Date(NOW - 86400000 * 14),
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
  'Felt hopeful today', 'Struggled with motivation', 'Grateful for small things',
  'Overwhelmed but pushing through', 'Calm and centered',
];
for (let i = 29; i >= 0; i--) {
  const d = new Date(NOW - 86400000 * i);
  const val = Math.random() < 0.2 ? 3 : [5, 4, 4, 3, 3, 3, 2][Math.floor(Math.random() * 7)];
  moods.push({
    user: i < 15 ? SAMPLE_USER_ID : SAMPLE_USER_ID2,
    value: val,
    emoji: moodEmojis[val],
    note: moodNotes[Math.floor(Math.random() * moodNotes.length)],
    tags: val >= 4 ? ['positive', 'grateful'] : val <= 2 ? ['sad', 'anxious'] : ['neutral'],
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
  {
    user: SAMPLE_USER_ID2,
    title: 'New Beginnings',
    content: 'Today I started my journey with MindSpace. I feel hopeful about having a space to express myself. The breathing exercises already helped calm my morning anxiety.',
    prompt: 'How do you feel about starting this journey?',
    mood: 4,
    tags: ['hopeful', 'new-start'],
    createdAt: new Date(NOW - 86400000 * 3),
  },
  {
    user: SAMPLE_USER_ID2,
    title: 'Communication with my partner',
    content: 'We had a difficult conversation today but it ended well. I am learning to express my feelings without fear. It takes practice but I am proud of the progress.',
    prompt: 'How did you communicate your feelings today?',
    mood: 3,
    tags: ['relationships', 'growth'],
    createdAt: new Date(NOW - 86400000 * 7),
  },
  {
    user: SAMPLE_USER_ID2,
    title: 'Finding balance',
    content: 'Work has been stressful but I am learning to set boundaries. Took a 15-minute walk during lunch and it made a huge difference. Small steps matter.',
    prompt: 'What small step did you take for yourself today?',
    mood: 3,
    tags: ['stress', 'self-care', 'boundaries'],
    createdAt: new Date(NOW - 86400000 * 10),
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
  {
    name: 'Parenting Support',
    nameRw: 'Ubufasha mu Kurera',
    description: 'Share experiences and get support on your parenting journey.',
    descriptionRw: 'Sangira ubunararibonye kandi ubone ubufasha mu kurera.',
    topic: 'Parenting',
    icon: '',
    memberCount: 44,
  },
  {
    name: 'Relationships & Connection',
    nameRw: 'Ishuri n\'Ubumwe',
    description: 'Navigate relationships with support and understanding.',
    descriptionRw: 'Genda mu ishuri ubufasha n\'umumvikanwabo.',
    topic: 'Relationships',
    icon: '',
    memberCount: 36,
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
  'I finally opened up to my family about how I feel.',
  'The 4-7-8 breathing technique changed my life.',
  'Some days are harder than others. Be kind to yourself.',
];

const counselors = [
  {
    fullName: 'Dr. Alice Mukamana',
    email: 'alice.mukamana@mindspace.rw',
    phone: '+250788100001',
    bio: 'Clinical psychologist specializing in trauma and PTSD recovery.',
    bioRw: 'Umuhanga mu bya psychologue ukora kuri trauma na PTSD.',
    specialization: ['Trauma', 'PTSD', 'Anxiety'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    maxConcurrentSessions: 5,
    rating: 4.8,
  },
  {
    fullName: 'Jean-Baptiste Habimana',
    email: 'jb.habimana@mindspace.rw',
    phone: '+250788100002',
    bio: 'Counseling psychologist focused on youth mental health and grief.',
    bioRw: 'Umujyanama wa psychologue ku rubyiruko n\'agahinda.',
    specialization: ['Grief', 'Youth', 'Depression'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    maxConcurrentSessions: 4,
    rating: 4.6,
  },
  {
    fullName: 'Gloria Uwimana',
    email: 'gloria.uwimana@mindspace.rw',
    phone: '+250788100003',
    bio: 'Specialist in cognitive behavioral therapy and stress management.',
    bioRw: 'Umuhanga mu kuvura imitekerereze no gucunga umuhangayiko.',
    specialization: ['Stress', 'Anxiety', 'Burnout'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    maxConcurrentSessions: 6,
    rating: 4.9,
  },
  {
    fullName: 'Patrick Mugisha',
    email: 'patrick.mugisha@mindspace.rw',
    phone: '+250788100004',
    bio: 'Mental health counselor with 10 years of experience in community outreach.',
    bioRw: 'Umujyanama mu mutima ufite uburambe bw\'imyaka 10.',
    specialization: ['Depression', 'Stress', 'Relationships'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: false,
    maxConcurrentSessions: 3,
    rating: 4.5,
  },
  {
    fullName: 'Mukamana Diane',
    email: 'diane.mukamana@mindspace.rw',
    phone: '+250788100005',
    bio: 'Marriage and family therapist specializing in couples counseling.',
    bioRw: 'Umujyanama mu ndangabageni n\'imiryango.',
    specialization: ['Relationships', 'Couples', 'Parenting'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    maxConcurrentSessions: 4,
    rating: 4.7,
  },
  {
    fullName: 'Dr. Eric Niyonzima',
    email: 'eric.niyonzima@mindspace.rw',
    phone: '+250788100006',
    bio: 'Addiction specialist and mental health advocate with 15 years experience.',
    bioRw: 'Umuhanga mu kuvura ibibazo by\'ibiyobyabwenge n\'ubujyanama mu mutima.',
    specialization: ['Addiction', 'Depression', 'Anxiety'],
    languages: ['rw', 'en'],
    isVerified: true,
    isAvailable: true,
    maxConcurrentSessions: 5,
    rating: 4.4,
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
    location: 'Nationwide',
    description: 'Free 24/7 mental health support hotline.',
    descriptionRw: 'Terefone y\'ubufasha mu mutima ku buntu, 24/7.',
    hours: '24/7',
    isVerified: true,
  },
  {
    name: 'National Emergency Service',
    nameRw: 'Serivisi y\'Ikiza',
    type: 'emergency',
    phone: '112',
    location: 'Nationwide',
    description: 'National emergency response — police, ambulance, fire.',
    descriptionRw: 'Serivisi y\'ikiza — polisi, ambulance, umuriro.',
    hours: '24/7',
    isVerified: true,
  },
  {
    name: 'Gender Based Violence Hotline',
    nameRw: 'Terefone yo Kurwanya Ihohoterwa',
    type: 'hotline',
    phone: '3425',
    location: 'Nationwide',
    description: 'Support for survivors of gender-based violence.',
    descriptionRw: 'Ubufasha ku bahozeho ihohoterwa.',
    hours: '24/7',
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
    hours: 'Mon-Fri 8:00-17:00',
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
    hours: '24/7',
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
    hours: '24/7',
    isVerified: true,
  },
  {
    name: 'Baho Neza Wellness Center',
    nameRw: 'Baho Neza Wellness Center',
    type: 'ngo',
    phone: '+250788500200',
    location: 'Kicukiro, Kigali',
    description: 'Community-based mental health and wellness programs.',
    descriptionRw: 'Gahunda z\'ubuzima n\'ubuzima bwiza mu baturage.',
    hours: 'Mon-Sat 7:00-18:00',
    isVerified: true,
  },
  {
    name: 'Samaritans Rwanda',
    nameRw: 'Samaritans Rwanda',
    type: 'hotline',
    phone: '5656',
    location: 'Nationwide',
    description: 'Emotional support for those experiencing distress or suicidal thoughts.',
    descriptionRw: 'Ubufasha bw\'amarangamutima ku bahanganye cyangwa batekereza kwiyahura.',
    hours: '24/7',
    isVerified: true,
  },
];

const breathingExercises = [
  {
    title: '4-7-8 Breathing',
    titleRw: 'Guhumeka 4-7-8',
    type: 'breathing',
    description: 'A calming breathing technique that helps reduce anxiety and helps you fall asleep. Inhale for 4 seconds, hold for 7, exhale for 8.',
    descriptionRw: 'Ubuhumekero bumaraガングirira ubwoba n\'ibibazo by\'imitsi. Uhumeka amasaha 4, ufata amasaha 7, usohora amasaha 8.',
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
    titleRw: 'Umwondo w\'Inyanja',
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
    titleRw: 'Ijwi ry\'Ikigali mu Mugoroba',
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
  {
    title: 'Mountain Stream',
    titleRw: 'Umugezi wo ku Misozi',
    type: 'sound',
    description: 'Crystal clear mountain stream flowing through peaceful highlands.',
    descriptionRw: 'Umugezi utemba neza mu misozi ituje.',
    duration: '60 min',
    url: 'https://www.youtube.com/watch?v=YVfYJ8o5jGo',
    embedUrl: 'https://www.youtube.com/embed/YVfYJ8o5jGo',
    icon: '\u{1F30A}',
    tags: ['calm', 'meditation', 'nature'],
    moodTags: [1, 2, 3, 4],
    isFeatured: false,
  },
  {
    title: 'Meditation Music: Tibetan Bowls',
    titleRw: 'Indirimbo zo Kwirora: Amasahani y\'Abatibet',
    type: 'sound',
    description: 'Tibetan singing bowls with deep resonant tones for deep meditation and healing.',
    descriptionRw: 'Amasahani y\'Abatibet afite amajwi yimbitse yo kwirora no gukira.',
    duration: '30 min',
    url: 'https://www.youtube.com/watch?v=2Cx5E8-Fzoo',
    embedUrl: 'https://www.youtube.com/embed/2Cx5E8-Fzoo',
    icon: '\u{1F3FA}',
    tags: ['meditation', 'healing', 'calm'],
    moodTags: [1, 2, 3, 4, 5],
    isFeatured: true,
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
  {
    title: 'Sleep Story: Lakeside Cabin',
    titleRw: 'Inkuru y\'Ibitotsi: Inzu ku Kiyaga',
    type: 'sleep_tool',
    description: 'A gentle bedtime story about a peaceful cabin by a Rwandan lake, designed to guide you into deep sleep.',
    descriptionRw: 'Inkuru y\'uburiri ivuga ku nzu ituje iri ku kiyaga cy\'u Rwanda, igutware mu bitotsi byimbitse.',
    duration: '25 min',
    icon: '\u{1F3D6}',
    tags: ['sleep', 'story', 'relaxation'],
    moodTags: [1, 2, 3],
    isFeatured: true,
    steps: [
      'Get comfortable in bed. Close your eyes and take three deep breaths.',
      'Imagine you are walking along a path through green hills.',
      'In the distance, you see a small cabin by a sparkling lake.',
      'You hear birds singing and the gentle breeze through the trees.',
      'You arrive at the cabin, sit on the porch, and watch the sunset over the water.',
      'As the sky darkens, you feel more and more relaxed, drifting toward sleep.',
      'The stars appear overhead, and you feel safe, warm, and peaceful.',
    ],
    stepsRw: [
      'Ryama neza. Funza amaso ufate imyuka itatu myinshi.',
      'Tekereza uri kugenda mu nzira inyura mu misozi.',
      'Kure, ubona inzu ntoya iri ku kiyaga giserera.',
      'Wumva inyoni zirariba n\'umuyaga uhuha mu biti.',
      'Ugera mu nzu, wicara kuri veranda, ureba izuba rirenga ku kiyaga.',
      'Mugihe ikirere bijya, umva uruhutse cyane, ujya mu bitotsi.',
      'Inyenyeri zijya hejuru, kandi umva w umva w umutekano, ubushyuhe, n\'amahoro.',
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
  {
    title: 'Forgiveness Meditation',
    titleRw: 'Kwirora ku Babarira',
    type: 'guided_exercise',
    description: 'Release resentment and find peace through the practice of forgiveness — for yourself and others.',
    descriptionRw: 'Rekura umujinya ubone amahoro mu kubabarira — wowe n\'abandi.',
    duration: '15 min',
    icon: '\u{1F54A}',
    tags: ['forgiveness', 'healing', 'peace', 'relationships'],
    moodTags: [1, 2, 3],
    isFeatured: false,
    steps: [
      'Sit quietly. Bring to mind someone you need to forgive — including yourself.',
      'Acknowledge the pain without judgment. Let yourself feel it fully.',
      'Say: "I acknowledge the hurt. I release the need to hold onto this pain."',
      'Breathe deeply and imagine letting go of a heavy weight.',
      'Say: "I forgive you. I forgive myself. We are both doing our best."',
      'Sit in the space of forgiveness. Notice how it feels in your body.',
      'When ready, gently open your eyes and take a breath of fresh air.',
    ],
    stepsRw: [
      'Iyicare utuje. Tekereza ku muntu ugomba kubabarira — harimo na wowe.',
      'Emera ububabare nta rubanza. Reka ubumve byuzuye.',
      'Vuga: "Nemera ububabare. Ndekura ubukeneye gufata ku bubabare."',
      'Humeka byimbitse utekereza ko urekura ikintu kiremereye.',
      'Vuga: "Mbabarira. Ndibabarira. Twese turakora ibishoboka."',
      'Guma mu kibabarirwa. Ibaze uko wumva mu mubiri wawe.',
      'Igihe witeguye, fungura amaso buhoro ufate umwuka mushya.',
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
  {
    title: 'Breathing Exercises for Beginners',
    titleRw: 'Imyitozo yo Guhumeka ku Batangiye',
    type: 'video',
    description: 'Simple breathing exercises to reduce stress and improve focus. Great for beginners.',
    descriptionRw: 'Imyitozo yoroshye yo guhumeka kugirango ugabanye umuhangayiko n\'uguteza imbere kwibanda.',
    duration: '15 min',
    url: 'https://www.youtube.com/watch?v=4p4YH7WjJiM',
    embedUrl: 'https://www.youtube.com/embed/4p4YH7WjJiM',
    icon: '\u{1F3AC}',
    tags: ['breathing', 'beginner', 'stress', 'focus'],
    moodTags: [1, 2, 3, 4],
    isFeatured: true,
  },
  {
    title: 'Building Healthy Relationships',
    titleRw: 'Kubaka Isano Nziza',
    type: 'video',
    description: 'Learn the foundations of healthy communication and connection in relationships.',
    descriptionRw: 'Menya ibishingiwe ku isano nziza no gushyikirana neza.',
    duration: '20 min',
    url: 'https://www.youtube.com/watch?v=1iT0ZpGJbVI',
    embedUrl: 'https://www.youtube.com/embed/1iT0ZpGJbVI',
    icon: '\u{1F3AC}',
    tags: ['relationships', 'communication', 'health'],
    moodTags: [2, 3, 4],
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
  {
    title: 'The Power of Daily Routines',
    titleRw: 'Imbaraga z\'Imyitozo ya Buri Munsi',
    type: 'article',
    description: 'How small daily habits can transform your mental health and build resilience.',
    descriptionRw: 'Uko imyitozo mito ya buri munsi ihindura ubuzima bwo mu mutima n\'ubushobozi.',
    duration: '7 min read',
    icon: '\u{1F4CB}',
    tags: ['habits', 'routine', 'self-care', 'resilience'],
    moodTags: [2, 3, 4, 5],
    isFeatured: true,
    steps: [
      'Start with one small habit — 2 minutes of deep breathing each morning.',
      'Anchor your new habit to an existing one (e.g., breathe after brushing teeth).',
      'Track your progress. Each day you follow through builds momentum.',
      'Be flexible. Missing one day does not mean failure — just continue the next day.',
      'Celebrate small wins. Each completed habit is a victory.',
      'Gradually add more habits: gratitude journaling, a short walk, calling a friend.',
    ],
    stepsRw: [
      'Tangira n\'akamenyero kamwe — iminota 2 yo guhumeka buri gitondo.',
      'Huza akamenyero kashya n\'akashaje (urugero: humeka nyuma yo gukaraba amenyo).',
      'Kurikirana iterambere. Buri munsi ukurikiza ubaka imbaraga.',
      'Babara. Gusiba umunsi ntabwo ari ukunanirwa — komeza umunsi ukurikira.',
      'Ishimira intsinzi nto. Buri kamenyero kuzuzuye nintsinzi.',
      'Ongera akamenyero gahoro: kwandika gratitude, kugenda, guhamagara inshuti.',
    ],
  },
  {
    title: 'Sleep Hygiene for Better Mental Health',
    titleRw: 'Isuku y\'Ibitotsi ku Buzima Bwiza bwo mu Mutima',
    type: 'article',
    description: 'Practical tips to improve your sleep quality and support your mental wellbeing.',
    descriptionRw: 'Amabwiriza y\'uburyo bwo kunoza ibitotsi byawe no gushyigikira ubuzima bwawe bwo mu mutima.',
    duration: '6 min read',
    icon: '\u{1F4A4}',
    tags: ['sleep', 'health', 'wellbeing', 'tips'],
    moodTags: [1, 2, 3, 4, 5],
    isFeatured: false,
    steps: [
      'Go to bed and wake up at the same time every day — even on weekends.',
      'Avoid screens (phones, laptops, TV) 1 hour before bed. Blue light disrupts melatonin.',
      'Create a relaxing bedtime routine: read, stretch, listen to calm music.',
      'Keep your bedroom cool, dark, and quiet. Use blackout curtains if needed.',
      'Avoid caffeine after 2 PM and heavy meals within 3 hours of bedtime.',
      'If you cannot sleep after 20 minutes, get up and do something relaxing until you feel tired.',
    ],
    stepsRw: [
      'Jyama ukanguke mu gihe kimwe buri munsi — ndetse no mu minsi mirekure.',
      'Irinde ekrani (telefone, laptop, TV) isaha imbere y\'ibitotsi. Urumuri rw\'ubururu rukumira melatonin.',
      'Kora gahunda yo kuruhuka: soma, urambure, umva indirimbo zituje.',
      'Bika icyumba cyawe gikonje, umwijima, kandi kiretse. Koresha amapaziya ya blackouter niba bikenewe.',
      'Irinde kafeina nyuma ya saa mbiri z\'umugorwa n\'ibiryo byinshi mu masaha atatu y\'ibitotsi.',
      'Niba utashobye kuryama nyuma y\'iminota 20, byuka ukore ikintu kiguhumuriza kugeza wumvise ukonje.',
    ],
  },
];

const assessments = [
  {
    title: 'Stress Level Assessment',
    titleRw: 'Ipimelo ry\'Umuhangayiko',
    description: 'Evaluate your current stress levels and get personalized recommendations for managing stress.',
    descriptionRw: 'Pima umuhangayiko wawe ukore ubonye ibyifuzo byihariye byo gucunga umuhangayiko.',
    type: 'stress',
    estimatedMinutes: 5,
    active: true,
    questions: [
      {
        text: 'How often have you felt overwhelmed in the past two weeks?',
        textRw: 'Ni kangahe wumvise urengewe n\'ibintu mu byumweru bibiri bishize?',
        type: 'likert5',
        category: 'overwhelm',
        order: 1,
      },
      {
        text: 'How often have you had trouble sleeping due to stress?',
        textRw: 'Ni kangahe wagize ibibazo by\'ibitotsi kubera umuhangayiko?',
        type: 'likert5',
        category: 'sleep',
        order: 2,
      },
      {
        text: 'How often have you felt irritable or short-tempered?',
        textRw: 'Ni kangahe wumvise ubabaje cyangwa ukaza uburakari?',
        type: 'likert5',
        category: 'mood',
        order: 3,
      },
      {
        text: 'How often have you had difficulty concentrating?',
        textRw: 'Ni kangahe wagize ibibazo byo kwibanda?',
        type: 'likert5',
        category: 'focus',
        order: 4,
      },
      {
        text: 'How often have you felt physically tense or restless?',
        textRw: 'Ni kangahe wumvise umubiri wawe uryamye cyangwa udatuze?',
        type: 'likert5',
        category: 'physical',
        order: 5,
      },
      {
        text: 'Do you feel you have someone to talk to when you are stressed?',
        textRw: 'Wumva ufite umuntu wo kuvugisha iyo ufite umuhangayiko?',
        type: 'yesno',
        category: 'support',
        order: 6,
      },
    ],
    levels: [
      {
        label: 'Low Stress',
        labelRw: 'Umuhangayiko Muke',
        min: 0,
        max: 10,
        message: 'Your stress levels are well-managed. Keep using healthy coping strategies.',
        messageRw: 'Umuhangayiko wawe ugenzurwa neza. Komeza gukoresha uburyo bwiza bwo guhangana.',
        recommendation: 'Maintain your current routines. Practice preventive self-care and mindfulness.',
        recommendationRw: 'Komeza imyitozo yawe. Itoze kwitaho no kwirora.',
      },
      {
        label: 'Moderate Stress',
        labelRw: 'Umuhangayiko Urugero',
        min: 11,
        max: 20,
        message: 'You are experiencing moderate stress. Consider adopting relaxation techniques.',
        messageRw: 'Ufite umuhangayiko urugero. Tekereza gukoresha ubuhumekero.',
        recommendation: 'Try the 4-7-8 breathing exercise daily. Consider joining a stress management community.',
        recommendationRw: 'Gerageza guhumeka 4-7-8 buri munsi. Tekereza kwinjira mu muryango ugenga umuhangayiko.',
      },
      {
        label: 'High Stress',
        labelRw: 'Umuhangayiko Mwinshi',
        min: 21,
        max: 30,
        message: 'Your stress levels are high. It is important to seek support and prioritize self-care.',
        messageRw: 'Umuhangayiko wawe uri hejuru. Ni ngombwa gushaka ubufasha no kwitaho.',
        recommendation: 'Please reach out to a counselor or use our crisis resources. Try guided relaxation daily.',
        recommendationRw: 'Nyamuneka shaka ubufasha bw\'umujyanama cyangwa ukoreshe ibikoresho by\'ikiza. Gerageza kwirora buri munsi.',
      },
    ],
  },
  {
    title: 'Wellbeing Check-In',
    titleRw: 'Ipimelo ry\'Ubuzima Bwiza',
    description: 'A holistic assessment of your mental, emotional, and physical wellbeing.',
    descriptionRw: 'Ipimelo ryuzuye ry\'ubuzima bwawe bwo mu mutima, amarangamutima, n\'umubiri.',
    type: 'wellbeing',
    estimatedMinutes: 8,
    active: true,
    questions: [
      {
        text: 'How satisfied are you with your life overall?',
        textRw: 'Wishimiye iki ubuzima bwawe muri rusange?',
        type: 'likert5',
        category: 'satisfaction',
        order: 1,
      },
      {
        text: 'How often do you feel a sense of purpose or meaning?',
        textRw: 'Ni kangahe wumva ufite intego cyangwa ibisobanuro?',
        type: 'likert5',
        category: 'purpose',
        order: 2,
      },
      {
        text: 'How connected do you feel to others?',
        textRw: 'Wumva ufitanye isano ite n\'abandi?',
        type: 'likert5',
        category: 'connection',
        order: 3,
      },
      {
        text: 'How often do you engage in activities you enjoy?',
        textRw: 'Ni kangahe ukora ibintu wishimira?',
        type: 'likert5',
        category: 'engagement',
        order: 4,
      },
      {
        text: 'How would you rate your physical health?',
        textRw: 'Wapima iki ubuzima bwawe bw\'umubiri?',
        type: 'likert5',
        category: 'physical',
        order: 5,
      },
      {
        text: 'How well are you sleeping?',
        textRw: 'Uryama neza iki?',
        type: 'likert5',
        category: 'sleep',
        order: 6,
      },
    ],
    levels: [
      {
        label: 'Thriving',
        labelRw: 'Urukundo',
        min: 25,
        max: 30,
        message: 'You are thriving across multiple areas of wellbeing. Keep nurturing what works.',
        messageRw: 'Urukundo mu nzego nyinshi z\'ubuzima. Komeza kwita ku bikora.',
        recommendation: 'Share your strategies with others. Continue to invest in relationships and self-care.',
        recommendationRw: 'Sangira ubwenge bwawe n\'abandi. Komeza gushyira imari mu isano no kwitaho.',
      },
      {
        label: 'Managing Well',
        labelRw: 'Gucunga Neza',
        min: 18,
        max: 24,
        message: 'You are managing well overall. Look for areas where you could improve.',
        messageRw: 'Ucunga neza muri rusange. Shakisha aho ushobora gutera imbere.',
        recommendation: 'Focus on one area that could be stronger. Small consistent steps make a big difference.',
        recommendationRw: 'Wibande ku nzego imwe ushobora guteza imbere. Intambwe nto zifatika zituma habaho itandukaniro.',
      },
      {
        label: 'Needs Attention',
        labelRw: 'Bikeneye Kwitabwaho',
        min: 6,
        max: 17,
        message: 'Some areas of your wellbeing need attention. Start with small steps.',
        messageRw: 'Ingero zimwe z\'ubuzima bwawe zikeneye kwitabwaho. Tangira n\'intambwe nto.',
        recommendation: 'Pick one area to focus on. Use our guided exercises and consider talking to a counselor.',
        recommendationRw: 'Hitamo urwego rumwe wo kwibandaho. Koresha imyitozo yacu kandi ute kuvugisha umujyanama.',
      },
    ],
  },
  {
    title: 'Relationship Health Check',
    titleRw: 'Ipimelo ry\'Isano Nziza',
    description: 'Assess the health of your relationships and discover areas for growth.',
    descriptionRw: 'Pima ubuzima bw\'isano yawe ubone aho ukwiriye guteza imbere.',
    type: 'relationship',
    estimatedMinutes: 7,
    active: true,
    questions: [
      {
        text: 'How satisfied are you with your current relationships?',
        textRw: 'Wishimiye iki isano yawe igezweho?',
        type: 'likert5',
        category: 'satisfaction',
        order: 1,
      },
      {
        text: 'How well do you communicate your needs to others?',
        textRw: 'Umenyesha neza iki abandi ibyo ukeneye?',
        type: 'likert5',
        category: 'communication',
        order: 2,
      },
      {
        text: 'How often do you feel heard and understood?',
        textRw: 'Ni kangahe wumva warunvise kandi wasobanukiwe?',
        type: 'likert5',
        category: 'understanding',
        order: 3,
      },
      {
        text: 'How often do conflicts leave you feeling hurt or resentful?',
        textRw: 'Ni kangahe amakimbirane akurka umubabaro cyangwa umujinya?',
        type: 'likert5',
        category: 'conflict',
        order: 4,
      },
      {
        text: 'Do you feel you have healthy boundaries in your relationships?',
        textRw: 'Wumva ufite imipaka myiza mu isano yawe?',
        type: 'yesno',
        category: 'boundaries',
        order: 5,
      },
    ],
    levels: [
      {
        label: 'Healthy Relationships',
        labelRw: 'Isano Nziza',
        min: 20,
        max: 25,
        message: 'Your relationships are generally healthy. Keep nurturing open communication.',
        messageRw: 'Isano yawe iri mu buzima bwiza muri rusange. Komeza kwita ku itumanaho.',
        recommendation: 'Continue practicing active listening and expressing appreciation regularly.',
        recommendationRw: 'Komeza gutega amatwi neza no kugaragaza ishimwe buri gihe.',
      },
      {
        label: 'Some Challenges',
        labelRw: 'Ibibazo Bimwe',
        min: 12,
        max: 19,
        message: 'There are some areas to work on in your relationships. This is normal and growth is possible.',
        messageRw: 'Hari ibibazo bimwe byo gukoraho mu isano yawe. Ibi ni ibisanzwe kandi iterambere rirashoboka.',
        recommendation: 'Focus on communication skills. Try our "Building Healthy Relationships" video and journal about your needs.',
        recommendationRw: 'Wibande ku buhanga bw\'itumanaho. Gerageza video "Building Healthy Relationships" wandike ku byo ukeneye.',
      },
      {
        label: 'Needs Improvement',
        labelRw: 'Bikeneye Iterambere',
        min: 5,
        max: 11,
        message: 'Your relationships may be causing significant distress. Support is available.',
        messageRw: 'Isano yawe ishobora guteza ibibazo byinshi. Ubufasha burihari.',
        recommendation: 'Consider speaking with a relationship counselor. Join our Relationships & Connection community.',
        recommendationRw: 'Tekereza kuvugisha umujyanama w\'isano. Injira mu muryango wacu "Relationships & Connection".',
      },
    ],
  },
  {
    title: 'Personal Growth Readiness',
    titleRw: 'Kwitegura Guteza Imbere',
    description: 'Discover if you are ready for personal growth work and what areas to focus on.',
    descriptionRw: 'Menya niba witeguye gukora ku iterambere ryawe n\'ingero zo kwibandaho.',
    type: 'readiness',
    estimatedMinutes: 5,
    active: true,
    questions: [
      {
        text: 'How motivated are you to make changes in your life?',
        textRw: 'Ufite umwete wo guhindura ikintu mu buzima bwawe?',
        type: 'likert5',
        category: 'motivation',
        order: 1,
      },
      {
        text: 'How open are you to trying new coping strategies?',
        textRw: 'Witeguye iki kugerageza uburyo bushya bwo guhangana?',
        type: 'likert5',
        category: 'openness',
        order: 2,
      },
      {
        text: 'How much time can you dedicate to self-care each week?',
        textRw: 'Ufite igihe kingana iki cyo kwitaho buri cyumweru?',
        type: 'likert3',
        category: 'time',
        order: 3,
      },
      {
        text: 'Do you have a support system in place?',
        textRw: 'Ufite abagutseye?',
        type: 'yesno',
        category: 'support',
        order: 4,
      },
    ],
    levels: [
      {
        label: 'Ready to Grow',
        labelRw: 'Witeguye Guteza Imbere',
        min: 15,
        max: 20,
        message: 'You are in a great position to begin or continue your personal growth journey.',
        messageRw: 'Uri mu mwanya mwiza wo gutangira cyangwa gukomeza urugendo rwawe rwo guteza imbere.',
        recommendation: 'Enroll in a course that matches your interests. Set one personal growth goal for this month.',
        recommendationRw: 'Iyandikishe mu isomo rijyanye n\'ibyo ukunda. Shira intego imwe yo guteza imbere kuri uku kwezi.',
      },
      {
        label: 'Building Readiness',
        labelRw: 'Kwitegura',
        min: 8,
        max: 14,
        message: 'You have some readiness but might benefit from addressing barriers first.',
        messageRw: 'Ufite ubushobozi ariko ushobora kugirirwa akamaro no gukemura inzitizi.',
        recommendation: 'Start small. Try the "Gratitude Reflection" exercise and build from there.',
        recommendationRw: 'Tangira buhoro. Gerageza "Kwirora ku Bishimira" ubake kuva aho.',
      },
      {
        label: 'Need More Support',
        labelRw: 'Ukeneye Ubufasha Bwinshi',
        min: 4,
        max: 7,
        message: 'It may be helpful to focus on building stability before diving into growth work.',
        messageRw: 'Bishobora kugufasha kwibanda ku gukomeza mbere yo gutangira iterambere.',
        recommendation: 'Focus on self-care basics: sleep, nutrition, and gentle movement. Talk to a counselor for guidance.',
        recommendationRw: 'Wibande ku by\'ibanze: ibitotsi, imirire, n\'imyitozo yoroshye. Vugisha umujyanama w\'ubuyobozi.',
      },
    ],
  },
];

const assessmentResults = [
  {
    user: SAMPLE_USER_ID,
    answers: [
      { value: 4 },
      { value: 3 },
      { value: 3 },
      { value: 4 },
      { value: 2 },
      { value: 1 },
    ],
    score: 17,
    level: 'Moderate Stress',
    completedAt: new Date(NOW - 86400000 * 3),
  },
  {
    user: SAMPLE_USER_ID,
    answers: [
      { value: 3 },
      { value: 4 },
      { value: 3 },
      { value: 4 },
      { value: 3 },
      { value: 3 },
    ],
    score: 20,
    level: 'Managing Well',
    completedAt: new Date(NOW - 86400000 * 2),
  },
  {
    user: SAMPLE_USER_ID2,
    answers: [
      { value: 5 },
      { value: 4 },
      { value: 3 },
      { value: 4 },
      { value: 2 },
    ],
    score: 18,
    level: 'Some Challenges',
    completedAt: new Date(NOW - 86400000 * 1),
  },
];

const courses = [
  {
    title: 'Stress Management Foundations',
    titleRw: 'Ishingiro ryo Gucunga Umuhangayiko',
    subtitle: 'Learn practical techniques to manage daily stress and build resilience.',
    subtitleRw: 'Menya ubuhanga bukoreshwa mu gucunga umuhangayiko wa buri munsi no gukomeza.',
    description: 'A comprehensive course covering the science of stress, practical management techniques, and long-term resilience building. Includes breathing exercises, time management, and cognitive reframing.',
    descriptionRw: 'Isomo ryuzuye rivuga ku bumenyi bw\'umuhangayiko, uburyo bwo kugenzura, no gukomeza igihe kirekire. Harimo imyitozo yo guhumeka, gucunga igihe, no guhindura imitekerereze.',
    category: 'wellbeing',
    level: 'beginner',
    estimatedHours: 6,
    certificateEligible: true,
    published: true,
    modules: [
      {
        title: 'Understanding Stress',
        titleRw: 'Gusobanukirwa Umuhangayiko',
        description: 'Learn what stress is and how it affects your body and mind.',
        descriptionRw: 'Menya icyo umuhangayiko ari n\'uko ugira ingaruka ku mubiri n\'ubwonko.',
        order: 1,
        lessons: [
          {
            title: 'What is Stress?',
            titleRw: 'Umuhangayiko ni iki?',
            description: 'An introduction to the stress response and its effects.',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/qpO6So_Lsu4',
            durationMinutes: 12,
            order: 1,
          },
          {
            title: 'The Science of Stress',
            titleRw: 'Ubumenyi bw\'Umuhangayiko',
            description: 'How cortisol and adrenaline affect your body.',
            type: 'article',
            content: 'Stress triggers the release of cortisol and adrenaline, preparing your body for "fight or flight." While this response is helpful in short bursts, chronic stress can lead to health problems including anxiety, depression, heart disease, and sleep disorders. Understanding this mechanism is the first step to managing stress effectively.',
            contentRw: 'Umuhangayiko uterwa na cortisol na adrenaline, gutegura umubiri wawe ku "kurwana cyangwa guhunga." Nubwo iyi myitwaro ifasha mu gihe gito, umuhangayiko urambye ushobora gutera ibibazo by\'ubuzima harimo ubwoba, depression, indwara z\'umutima, n\'ibibazo by\'ibitotsi. Gusobanukirwa iyi nzira ni intambwe ya mbere yo gucunga umuhangayiko neza.',
            durationMinutes: 8,
            order: 2,
          },
          {
            title: 'Stress Self-Assessment',
            titleRw: 'Kwipimira Umuhangayiko',
            description: 'Take our stress assessment to understand your current levels.',
            type: 'exercise',
            content: 'Complete the Stress Level Assessment in the Assessments section to measure your current stress levels. Note your score and revisit it after completing this course to track your progress.',
            contentRw: 'Kora ipimelo ry\'umuhangayiko mu gice cy\'Ipimelo kugirango upime umuhangayiko wawe igezweho. Andika amanota yawe urebe nyuma yo kurangiza iri somo kugirango ukurikirane iterambere.',
            durationMinutes: 5,
            order: 3,
          },
        ],
      },
      {
        title: 'Practical Stress Relief Techniques',
        titleRw: 'Ubuhanga Bwo Gukuraho Umuhangayiko',
        description: 'Hands-on techniques you can use anytime, anywhere.',
        descriptionRw: 'Ubuhanga bukoreshwa mu buryo butaziguye, aho uri hose, igihe icyo ari cyo cyose.',
        order: 2,
        lessons: [
          {
            title: 'Breathing Exercises',
            titleRw: 'Imyitozo yo Guhumeka',
            description: 'Master three breathing techniques for immediate stress relief.',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/4p4YH7WjJiM',
            durationMinutes: 15,
            order: 1,
          },
          {
            title: 'Progressive Muscle Relaxation',
            titleRw: 'Kuruhura Imitsi buhoro buhoro',
            description: 'Release physical tension with this guided practice.',
            type: 'exercise',
            content: 'Follow the progressive muscle relaxation technique: tense each muscle group for 5 seconds, then release. Start from your feet and work up to your face. Notice the difference between tension and relaxation.',
            contentRw: 'Kurikiza uburyo bwo kuruhura imitsi: komeza itsi buri itsi amasaha 5, hanyuma urekure. Tangira ku birenge ukajya ku isura. Ibaza itandukaniro hagati y\'umunaniro no kuruhuka.',
            durationMinutes: 15,
            order: 2,
          },
          {
            title: 'Mindful Walking',
            titleRw: 'Kugenda mu Kwirora',
            description: 'Turn a simple walk into a stress-relief practice.',
            type: 'exercise',
            content: 'Find a quiet place to walk for 10 minutes. Focus on each step — feel your feet connecting with the ground. Notice your surroundings: the colors, sounds, and smells. When your mind wanders, gently bring it back to the sensation of walking.',
            contentRw: 'Shakisha ahantu hatuje yo kugenda amasaha 10. Wibande ku ntambwe — wumve ibirenge byawe bihura n\'ubutaka. Ibaze ibikikije: amabara, amajwi, n\'impumuro. Iyo ubwonko bwawe buziritse, bwubakure buhoro bushake nyuma yo kugenda.',
            durationMinutes: 10,
            order: 3,
          },
        ],
      },
      {
        title: 'Building Long-Term Resilience',
        titleRw: 'Gukomeza Igihe Kirekire',
        description: 'Develop habits and mindsets that protect against future stress.',
        descriptionRw: 'Kura akamenyero n\'imyumvire birinda umuhangayiko mu gihe kizaza.',
        order: 3,
        lessons: [
          {
            title: 'The Power of Daily Routines',
            titleRw: 'Imbaraga z\'Imyitozo ya Buri Munsi',
            description: 'How structure and routine build mental strength.',
            type: 'article',
            content: 'Research shows that consistent daily routines reduce stress and improve mental health. Start with one small habit — like 5 minutes of morning stretching or an evening gratitude journal entry. Anchor new habits to existing ones for better consistency.',
            contentRw: 'Ubushakashatsi bwerekana ko imyitozo ihoraho ya buri munsi igabanya umuhangayiko ikanateza imbere ubuzima bwo mu mutima. Tangira n\'akamenyero kamwe — nk\'iminota 5 yo kugorora mu gitondo cyangwa kwandika gratitude mu mugoroba. Huza akamenyero kashya n\'akashaje kugirango uhoraho.',
            durationMinutes: 10,
            order: 1,
          },
          {
            title: 'Cognitive Reframing',
            titleRw: 'Guhindura Imitekerereze',
            description: 'Change how you think about stressful situations.',
            type: 'exercise',
            content: 'When you notice a negative thought, pause and ask: "Is this thought helpful? Is it true?" Then try to reframe it. For example, change "I cannot handle this" to "This is challenging, but I have handled difficult things before."',
            contentRw: 'Iyo ubonye ibitekerezo bibi, hagara ubaze: "Ese iki gitekerezo kirafasha? Ni ukuri?" Hanyuma ugerageze kugihindura. Urugero, hindura "Sinshobora kubigenza" ube "Iki nikigoye, ariko narakomeye mbere."',
            durationMinutes: 12,
            order: 2,
          },
          {
            title: 'Creating Your Stress Management Plan',
            titleRw: 'Gukora Gahunda yo Gucunga Umuhangayiko',
            description: 'Build a personalized plan for ongoing stress management.',
            type: 'exercise',
            content: 'Write down your top 3 stress triggers. For each trigger, list 2 techniques you will use. Schedule one stress-relief activity into your calendar each day. Share your plan with someone who can support you.',
            contentRw: 'Andika ibintu 3 bigutera umuhangayiko. Kuri buri kintu, andika ubuhanga 2 uzakoresha. Shira gahunda imwe yo gukuraho umuhangayiko muri kalendari yawe buri munsi. Sangira gahunda yawe n\'umuntu wagutseye.',
            durationMinutes: 15,
            order: 3,
          },
        ],
      },
    ],
  },
  {
    title: 'Building Healthy Relationships',
    titleRw: 'Kubaka Isano Nziza',
    subtitle: 'Develop communication skills and emotional intelligence for stronger relationships.',
    subtitleRw: 'Teza imbere ubuhanga bw\'itumanaho n\'ubwenge bw\'amarangamutima ku isano ikomeye.',
    description: 'Learn the fundamentals of healthy communication, boundary setting, and emotional connection. This course includes practical exercises for couples, family, and friendships.',
    descriptionRw: 'Menya ibishingiwe ku itumanaho rizima, gushyiraho imipaka, n\'ishyirahamwe ry\'amarangamutima. Iri somo rikubiyemo imyitozo n\'abashakanye, umuryango, n\'inshuti.',
    category: 'couples',
    level: 'intermediate',
    estimatedHours: 8,
    certificateEligible: true,
    published: true,
    modules: [
      {
        title: 'Communication Fundamentals',
        titleRw: 'Ishingiro ry\'Itumanaho',
        description: 'Master the basics of effective communication.',
        descriptionRw: 'Menya neza ibishingiwe by\'itumanaho rikora.',
        order: 1,
        lessons: [
          {
            title: 'Active Listening',
            titleRw: 'Kutega Amatwi Neza',
            description: 'Learn to listen to understand, not just to respond.',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/1iT0ZpGJbVI',
            durationMinutes: 20,
            order: 1,
          },
          {
            title: 'I-Statements',
            titleRw: 'Amagambo ya "Njye"',
            description: 'Express your feelings without blame or accusation.',
            type: 'article',
            content: 'I-statements are a communication tool that helps you express your feelings without blaming others. The format is: "I feel [emotion] when [situation] because [need]. I would like [request]." For example: "I feel worried when you come home late because I care about your safety. I would like a text if you will be late."',
            contentRw: 'Amagambo ya "Njye" ni igikoresho cy\'itumanaho kigufasha gusobanura amarangamutima yawe nta kurega abandi. Imiterere ni: "Nda[amagambo] iyo [ikintu] kuko [ibyo nkeneye]. Nifuza [icyifuzo]." Urugero: "Ndahangayika iyo utiye kera kuko nita ku mutekano wawe. Nifuza ubutumwa niba uza gutinda."',
            durationMinutes: 8,
            order: 2,
          },
        ],
      },
      {
        title: 'Setting Boundaries',
        titleRw: 'Gushyiraho Imipaka',
        description: 'Learn to set and maintain healthy boundaries.',
        descriptionRw: 'Menya gushyiraho no gukomeza imipaka myiza.',
        order: 2,
        lessons: [
          {
            title: 'Understanding Boundaries',
            titleRw: 'Gusobanukirwa Imipaka',
            description: 'What boundaries are and why they matter.',
            type: 'article',
            content: 'Boundaries are the limits we set with others to protect our wellbeing. They can be physical, emotional, or time-based. Healthy boundaries are not walls — they are guidelines that help relationships thrive by ensuring mutual respect and understanding.',
            contentRw: 'Imipaka ni imipaka dushyira n\'abandi kugirango dukingire ubuzima bwiza bwacu. Irashobora kuba iy\'umubiri, amarangamutima, cyangwa iy\'igihe. Imipaka myiza ntabwo ari inkuta — ni amabwiriza afasha isano gukura neza binyuze mu kubaha no gusobanukirwa.',
            durationMinutes: 10,
            order: 1,
          },
          {
            title: 'Boundary Setting Practice',
            titleRw: 'Imyitozo yo Gushyiraho Imipaka',
            description: 'Practice setting boundaries in different scenarios.',
            type: 'exercise',
            content: 'Think of a relationship where you need stronger boundaries. Write down: 1) What boundary is needed, 2) How you will communicate it, 3) What you will do if it is not respected. Practice saying it aloud.',
            contentRw: 'Tekereza ku isano ukenera imipaka ikomeye. Andika: 1) Imipaka ihenze, 2) Uko uzabimenyesha, 3) Icyo uzakora niba itubahijwe. Yitoze kuvuga mu ijwi riranguruye.',
            durationMinutes: 10,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: 'Grief & Healing Journey',
    titleRw: 'Agahinda no Gukira',
    subtitle: 'Navigate the grieving process with compassion and support.',
    subtitleRw: 'Genda mu gahinda mpuhwe n\'ubufasha.',
    description: 'A gentle, compassionate course to help you understand and navigate grief. Covers the stages of grief, self-care during difficult times, and finding meaning after loss.',
    descriptionRw: 'Isomo ryuzuye impuhwe kugirango rigufashe gusobanukirwa no kunyuramo mu gahinda. Rikubiyemo ibyiciro by\'agahinda, kwitaho mu bihe bigoye, no gusanga ibisobanuro nyuma yo gutakaza.',
    category: 'grief',
    level: 'beginner',
    estimatedHours: 5,
    certificateEligible: false,
    published: true,
    modules: [
      {
        title: 'Understanding Grief',
        titleRw: 'Gusobanukirwa Agahinda',
        description: 'Learn about the grieving process and how it affects you.',
        descriptionRw: 'Menya byinshi ku gahinda n\'uko kugira ingaruka kuri wowe.',
        order: 1,
        lessons: [
          {
            title: 'What is Grief?',
            titleRw: 'Agahinda ni iki?',
            description: 'Understanding grief as a natural response to loss.',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/hN5M4sXQbM0',
            durationMinutes: 18,
            order: 1,
          },
          {
            title: 'The Many Faces of Grief',
            titleRw: 'Indimi Nyinshi z\'Agahinda',
            description: 'Grief is not just about death — it can be about many kinds of loss.',
            type: 'article',
            content: 'Grief can arise from many experiences: the death of a loved one, the end of a relationship, losing a job, moving to a new place, or watching a loved one struggle with illness. All grief is valid and deserves compassion. There is no "right" way to grieve, and no timeline for healing.',
            contentRw: 'Agahinda gashobora guturuka ku bintu byinshi: gupfa kw\'umuntu ukunda, kurangiza isano, gutakaza akazi, kwimukira ahantu hashya, cyangwa kureba umuntu ukunda arwara. Agahinda kose ni ukuri kandi gakwiye impuhwe. Nta buryo "bwiza" bwo kugira agahinda, nta gihe cyagenwe cyo gukira.',
            durationMinutes: 10,
            order: 2,
          },
        ],
      },
      {
        title: 'Self-Care During Grief',
        titleRw: 'Kwitaho mu Gahinda',
        description: 'Gentle practices to support yourself during difficult times.',
        descriptionRw: 'Imyitozo yoroshye yo kwishyigikira mu bihe bigoye.',
        order: 2,
        lessons: [
          {
            title: 'Gentle Movement for Grief',
            titleRw: 'Imyitozo y\'Agahinda',
            description: 'How gentle movement can help process emotions.',
            type: 'exercise',
            content: 'When grieving, intense exercise may feel overwhelming. Instead, try gentle movement: a slow walk in nature, stretching while lying in bed, or gentle yoga. The goal is not fitness but connection with your body.',
            contentRw: 'Iyo ugira agahinda, imyitozo ikaze ishobora kurengera. Ahubwo, gerageza imyitozo yoroshye: kugenda buhoro mu kirere, kugorora uri mu buriri, cyangwa yoga yoroshye. Intego ntabwo ari ubuzima bwiza ahubwo ni isano n\'umubiri wawe.',
            durationMinutes: 10,
            order: 1,
          },
          {
            title: 'Journaling Through Grief',
            titleRw: 'Kwandika mu Gahinda',
            description: 'Using writing as a tool for healing.',
            type: 'exercise',
            content: 'Write a letter to your lost loved one, or to your grief itself. Tell it how you feel. Do not worry about grammar or structure — just let the words flow. You can also write about memories, things you miss, or hopes for the future.',
            contentRw: 'Andika ibaruwa ukoresheje urupfu rwawe, cyangwa agahinda ubwako. Bwira uko wumva. Ntugire impungenge ku gice cy\'ikinyarwanda cyangwa imiterere — reka amagambo atemba. Urashobora kandi kwandika ku bibazo, ibyo ushobora kuba wasize cyangwa ibyiringiro by\'ejo hazaza.',
            durationMinutes: 15,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: 'Premarital Preparation',
    titleRw: 'Kwitegura Urushako',
    subtitle: 'Build a strong foundation for your marriage journey.',
    subtitleRw: 'Baka urufatiro rukomeye rw\'urugendo rw\'ubukwe.',
    description: 'Essential premarital guidance covering communication, finances, conflict resolution, shared values, and building a vision for your future together.',
    descriptionRw: 'Ubuyobozi bw\'ingenzi bw\'ibanze ku rushako bukubiyemo itumanaho, imari, gukemura amakimbirane, indangagaciro, no kubaka icyerekezo cy\'ejo hazaza hamwe.',
    category: 'premarital',
    level: 'beginner',
    estimatedHours: 10,
    certificateEligible: true,
    published: true,
    modules: [
      {
        title: 'Building Your Foundation',
        titleRw: 'Kubaka Urufatiro',
        description: 'Explore your values, expectations, and vision for marriage.',
        descriptionRw: 'Shakisha indangagaciro zawe, ibyo utegereza, n\'icyerekezo cy\'ubukwe.',
        order: 1,
        lessons: [
          {
            title: 'Shared Values & Goals',
            titleRw: 'Indangagaciro n\'Intego Rusange',
            description: 'Understanding what matters most to both of you.',
            type: 'article',
            content: 'A strong marriage is built on shared values. Discuss: What does marriage mean to each of you? What are your life goals? How do you define success? How will you handle disagreements about money, children, religion, or family? These conversations build understanding before challenges arise.',
            contentRw: 'Ubukwe bukomeye bubakwa ku ndangagaciro rusange. Kuganira: Ubukwe busobanura iki kuri buri wese? N\'izihe ntego z\'ubuzima zifite? Ubusobanuro bw\'intsinzi ni ubuhe? Ni gute muzakemura amakimbirane ku byerekeye amafaranga, abana, idini, cyangwa umuryango? Ibi biganiro byubaka ubumenyi mbere y\'ibibazo.',
            durationMinutes: 15,
            order: 1,
          },
          {
            title: 'Communication for Couples',
            titleRw: 'Itumanaho ku Bashakanye',
            description: 'Build communication patterns that will serve you for life.',
            type: 'exercise',
            content: 'Practice the "Speaker-Listener" technique: One person speaks while the other listens without interrupting. The listener then summarizes what they heard. Switch roles. This builds deep understanding and prevents miscommunication.',
            contentRw: 'Yitoze ubuhanga bwa "Umuvuga-Umwumviriza": Umuntu avuga undi ateze amatwi nta guhagarika. Uwumviriza hanyuma aravuga ibyo yumvise. Hindura imirimo. Iki gikora gusobanukirwa byimbitse no gukumira amakosa mu itumanaho.',
            durationMinutes: 20,
            order: 2,
          },
          {
            title: 'Conflict Resolution Basics',
            titleRw: 'Ibishingiwe byo gukemura Amakimbirane',
            description: 'Learn to disagree in a way that strengthens your relationship.',
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/1iT0ZpGJbVI',
            durationMinutes: 15,
            order: 3,
          },
        ],
      },
      {
        title: 'Practical Planning',
        titleRw: 'Gutegura mu Bikorwa',
        description: 'Address practical aspects of marriage: finances, family, and daily life.',
        descriptionRw: 'Kemura ibintu bifatika by\'ubukwe: amafaranga, umuryango, n\'ubuzima bwa buri munsi.',
        order: 2,
        lessons: [
          {
            title: 'Financial Planning Together',
            titleRw: 'Gutegura Amafaranga Hamwe',
            description: 'Build a shared approach to money management.',
            type: 'article',
            content: 'Money is one of the most common sources of conflict in marriage. Create a plan: Will you have joint or separate accounts? How will you handle debt? What are your savings goals? Schedule regular "money dates" to discuss finances calmly and openly.',
            contentRw: 'Amafaranga ni kimwe mu bikunze gutera amakimbirane mu bukwe. Kora gahunda: Muzagira konti zimwe cyangwa zitandukanye? Ni gute muzakemura imyenda? Ni izihe ntego z\'ububiko? Teganya "amatariki y\'amafaranga" buri gihe kugirango muvugane ku mafaranga mu majyambere.',
            durationMinutes: 12,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    title: 'Parenting with Patience',
    titleRw: 'Kurera n\'Ubwumvikane',
    subtitle: 'Mindful parenting strategies for raising resilient children.',
    subtitleRw: 'Uburyo bwo kurera abana bakomeye.',
    description: 'Evidence-based parenting strategies that build strong parent-child relationships while promoting children\'s emotional intelligence and resilience.',
    descriptionRw: 'Uburyo bwo kurera abana bushingiye ku bumenyi bwubaka isano ikomeye hagati y\'ababyeyi n\'abana igihe cyose biteza imbere ubwenge bw\'amarangamutima n\'ubushobozi bw\'abana.',
    category: 'parenting',
    level: 'intermediate',
    estimatedHours: 7,
    certificateEligible: false,
    published: true,
    modules: [
      {
        title: 'Understanding Child Development',
        titleRw: 'Gusobanukirwa Iterambere ry\'Umwana',
        description: 'Learn what children need at different ages and stages.',
        descriptionRw: 'Menya ibyo abana bakeneye mu myaka n\'ibyiciro bitandukanye.',
        order: 1,
        lessons: [
          {
            title: 'Age-Appropriate Expectations',
            titleRw: 'Ibyiringiro Bihuje n\'Imyaka',
            description: 'Understand what is normal at each developmental stage.',
            type: 'article',
            content: 'Knowing what to expect at each age helps you respond with patience rather than frustration. A 2-year-old saying "no" is not defiance — it is developing autonomy. A teenager pulling away is not rejection — it is forming identity. Understanding development reframes challenges as growth opportunities.',
            contentRw: 'Kumenya icyo witega kuri buri myaka bigufasha gusubiza mu bwumvikane aho kurakara. Umwana w\'imyaka 2 uvuga "oya" ntabwo ari uguhakana — ni guteza ubwigenge. Umwana w\'ingimbi yitandukanya ntabwo ari uguhakana — ni gushinga indangagaciro. Gusobanukirwa iterambere bisobanura ibibazo nk\'amahirwe yo gukura.',
            durationMinutes: 10,
            order: 1,
          },
          {
            title: 'Emotional Coaching',
            titleRw: 'Guhugura Amarangamutima',
            description: 'Help your child understand and manage their emotions.',
            type: 'exercise',
            content: 'When your child has a strong emotion: 1) Notice and name the emotion ("I see you are feeling angry"), 2) Validate it ("It is okay to be angry"), 3) Set limits if needed ("But it is not okay to hit"), 4) Problem-solve together ("What could we do differently next time?").',
            contentRw: 'Iyo umwana wawe afite amarangamutima akomeye: 1) Ibona wita ku marangamutima ("Ndabona urakaye"), 2) Byeme ("Ni byiza kurakara"), 3) Shira imipaka niba bikenewe ("Ariko ntabwo ari byiza gukubita"), 4) Kemura hamwe ibibazo ("Ni iki dushobora gukora mu bundi buryo?").',
            durationMinutes: 15,
            order: 2,
          },
        ],
      },
    ],
  },
];

const bookings = [
  {
    user: SAMPLE_USER_ID,
    date: new Date(NOW + 86400000 * 2),
    durationMinutes: 50,
    type: 'video',
    status: 'confirmed',
    topic: 'Feeling overwhelmed with work and family expectations',
    notes: 'Would like to discuss stress management techniques for working parents.',
  },
  {
    user: SAMPLE_USER_ID,
    date: new Date(NOW - 86400000 * 5),
    durationMinutes: 50,
    type: 'chat',
    status: 'completed',
    topic: 'Initial consultation for anxiety',
  },
  {
    user: SAMPLE_USER_ID2,
    date: new Date(NOW + 86400000 * 4),
    durationMinutes: 30,
    type: 'chat',
    status: 'pending',
    topic: 'Relationship communication issues',
  },
];

const counselorAvailabilities = [
  { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', active: true }, // Monday
  { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', active: true }, // Tuesday
  { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', active: true }, // Wednesday
  { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', active: true }, // Thursday
  { dayOfWeek: 5, startTime: '08:00', endTime: '15:00', active: true }, // Friday
  { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', active: true }, // Saturday
];

const enrollments = [];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear all existing data
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
      Assessment.deleteMany({}),
      AssessmentResult.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
      Booking.deleteMany({}),
      CounselorAvailability.deleteMany({}),
    ]);
    console.log('Cleared all existing data');

    // === USERS ===
    await User.insertMany(users);
    console.log(`Seeded ${users.length} users`);

    // === MOODS ===
    await Mood.insertMany(moods);
    console.log(`Seeded ${moods.length} mood entries`);

    // === JOURNALS ===
    await Journal.insertMany(journals);
    console.log(`Seeded ${journals.length} journal entries`);

    // === COMMUNITIES ===
    const createdCommunities = await Community.insertMany(communities);
    console.log(`Seeded ${createdCommunities.length} communities`);

    // === COMMUNITY MESSAGES ===
    const communityMessages = [];
    const allAnonymousNames = ['Mutezi', 'Umuhanga', 'Intwali', 'Kirebe', 'Icyiza', 'Urukundo', 'Amahoro', 'Ishimwe'];
    const allNouns = ['Inyenyeri', 'Umuyaga', 'Ikivuguto', 'Akanyoni', 'Indoto', 'Umurava'];
    for (const c of createdCommunities) {
      const msgCount = 8 + Math.floor(Math.random() * 8); // 8-15 messages per community
      for (let i = 0; i < msgCount; i++) {
        communityMessages.push({
          sender: i % 3 === 0 ? SAMPLE_USER_ID : SAMPLE_USER_ID2,
          anonymousName: allAnonymousNames[i % allAnonymousNames.length] + allNouns[Math.floor(Math.random() * allNouns.length)] + Math.floor(Math.random() * 100),
          content: communityMessageTexts[i % communityMessageTexts.length],
          community: c._id,
          createdAt: new Date(NOW - (msgCount - i) * 7200000),
        });
      }
    }
    await Message.insertMany(communityMessages);
    console.log(`Seeded ${communityMessages.length} community messages`);

    // Update user's joined communities
    await User.findByIdAndUpdate(SAMPLE_USER_ID, {
      $set: {
        joinedCommunities: [createdCommunities[0]._id, createdCommunities[3]._id, createdCommunities[4]._id, createdCommunities[7]._id],
      },
    });
    await User.findByIdAndUpdate(SAMPLE_USER_ID2, {
      $set: {
        joinedCommunities: [createdCommunities[5]._id, createdCommunities[6]._id, createdCommunities[7]._id],
      },
    });
    console.log('Updated user joined communities');

    // === COUNSELORS ===
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
    const counselorsWithUsers = counselors.map((c, i) => ({ ...c, user: counselorUsers[i]._id }));
    const createdCounselors = await Counselor.insertMany(counselorsWithUsers);
    console.log(`Seeded ${createdCounselors.length} counselors`);

    // === COUNSELING SESSION + MESSAGES ===
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

    // === CRISIS RESOURCES ===
    await CrisisResource.insertMany(crisisResources);
    console.log(`Seeded ${crisisResources.length} crisis resources`);

    // === HEALING RESOURCES ===
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

    // === ASSESSMENTS ===
    const createdAssessments = [];
    for (const a of assessments) {
      const asmnt = await Assessment.create(a);
      createdAssessments.push(asmnt);
    }
    console.log(`Seeded ${createdAssessments.length} assessments (${createdAssessments.map(a => a.title).join(', ')})`);

    // === ASSESSMENT RESULTS (with proper questionIds) ===
    const assessmentResultData = [];
    if (createdAssessments[0]) {
      assessmentResultData.push({
        user: SAMPLE_USER_ID,
        assessment: createdAssessments[0]._id,
        answers: [
          { questionId: createdAssessments[0].questions[0]._id, value: 4 },
          { questionId: createdAssessments[0].questions[1]._id, value: 3 },
          { questionId: createdAssessments[0].questions[2]._id, value: 3 },
          { questionId: createdAssessments[0].questions[3]._id, value: 4 },
          { questionId: createdAssessments[0].questions[4]._id, value: 2 },
          { questionId: createdAssessments[0].questions[5]._id, value: 0 },
        ],
        score: 17,
        level: 'Moderate Stress',
        completedAt: new Date(NOW - 86400000 * 3),
      });
    }
    if (createdAssessments[1]) {
      assessmentResultData.push({
        user: SAMPLE_USER_ID,
        assessment: createdAssessments[1]._id,
        answers: [
          { questionId: createdAssessments[1].questions[0]._id, value: 3 },
          { questionId: createdAssessments[1].questions[1]._id, value: 4 },
          { questionId: createdAssessments[1].questions[2]._id, value: 3 },
          { questionId: createdAssessments[1].questions[3]._id, value: 4 },
          { questionId: createdAssessments[1].questions[4]._id, value: 3 },
          { questionId: createdAssessments[1].questions[5]._id, value: 3 },
        ],
        score: 20,
        level: 'Managing Well',
        completedAt: new Date(NOW - 86400000 * 2),
      });
    }
    if (createdAssessments[1]) {
      assessmentResultData.push({
        user: SAMPLE_USER_ID2,
        assessment: createdAssessments[1]._id,
        answers: [
          { questionId: createdAssessments[1].questions[0]._id, value: 2 },
          { questionId: createdAssessments[1].questions[1]._id, value: 3 },
          { questionId: createdAssessments[1].questions[2]._id, value: 2 },
          { questionId: createdAssessments[1].questions[3]._id, value: 3 },
          { questionId: createdAssessments[1].questions[4]._id, value: 2 },
          { questionId: createdAssessments[1].questions[5]._id, value: 2 },
        ],
        score: 14,
        level: 'Needs Attention',
        completedAt: new Date(NOW - 86400000 * 1),
      });
    }
    if (createdAssessments[2]) {
      assessmentResultData.push({
        user: SAMPLE_USER_ID2,
        assessment: createdAssessments[2]._id,
        answers: [
          { questionId: createdAssessments[2].questions[0]._id, value: 5 },
          { questionId: createdAssessments[2].questions[1]._id, value: 4 },
          { questionId: createdAssessments[2].questions[2]._id, value: 3 },
          { questionId: createdAssessments[2].questions[3]._id, value: 4 },
          { questionId: createdAssessments[2].questions[4]._id, value: 1 },
        ],
        score: 17,
        level: 'Some Challenges',
        completedAt: new Date(NOW - 86400000 * 1),
      });
    }
    await AssessmentResult.insertMany(assessmentResultData);
    console.log(`Seeded ${assessmentResultData.length} assessment results`);

    // === COURSES ===
    const createdCourses = [];
    for (const c of courses) {
      const course = await Course.create(c);
      createdCourses.push(course);
    }
    console.log(`Seeded ${createdCourses.length} courses (${createdCourses.map(c => c.title).join(', ')})`);

    // === ENROLLMENTS ===
    if (createdCourses[0]) {
      const firstLessonId = createdCourses[0].modules[0]?.lessons[0]?._id;
      enrollments.push({
        user: SAMPLE_USER_ID,
        course: createdCourses[0]._id,
        progress: {
          completedLessons: firstLessonId ? [firstLessonId] : [],
          lastLesson: firstLessonId || undefined,
          percent: 15,
        },
        startedAt: new Date(NOW - 86400000 * 5),
      });
    }
    if (createdCourses[1]) {
      enrollments.push({
        user: SAMPLE_USER_ID2,
        course: createdCourses[1]._id,
        progress: {
          completedLessons: [],
          lastLesson: undefined,
          percent: 0,
        },
        startedAt: new Date(NOW - 86400000 * 1),
      });
    }
    if (createdCourses[0]) {
      enrollments.push({
        user: SAMPLE_USER_ID2,
        course: createdCourses[0]._id,
        progress: {
          completedLessons: [],
          lastLesson: undefined,
          percent: 0,
        },
        startedAt: new Date(NOW - 86400000 * 2),
      });
    }
    if (createdCourses.length > 2) {
      const griefLessonId = createdCourses[2].modules[0]?.lessons[0]?._id;
      enrollments.push({
        user: SAMPLE_USER_ID,
        course: createdCourses[2]._id,
        progress: {
          completedLessons: griefLessonId ? [griefLessonId] : [],
          lastLesson: griefLessonId || undefined,
          percent: 30,
        },
        startedAt: new Date(NOW - 86400000 * 7),
      });
    }
    await Enrollment.insertMany(enrollments);
    console.log(`Seeded ${enrollments.length} enrollments`);

    // === BOOKINGS ===
    const bookingData = [];
    if (createdCounselors.length > 0) {
      bookingData.push({
        user: SAMPLE_USER_ID,
        counselor: createdCounselors[0]._id,
        date: new Date(NOW + 86400000 * 2),
        durationMinutes: 50,
        type: 'video',
        status: 'confirmed',
        topic: 'Feeling overwhelmed with work and family expectations',
        notes: 'Would like to discuss stress management techniques for working parents.',
      });
    }
    if (createdCounselors.length > 1) {
      bookingData.push({
        user: SAMPLE_USER_ID,
        counselor: createdCounselors[1]._id,
        date: new Date(NOW - 86400000 * 5),
        durationMinutes: 50,
        type: 'chat',
        status: 'completed',
        topic: 'Initial consultation for anxiety',
      });
    }
    if (createdCounselors.length > 2) {
      bookingData.push({
        user: SAMPLE_USER_ID2,
        counselor: createdCounselors[2]._id,
        date: new Date(NOW + 86400000 * 4),
        durationMinutes: 30,
        type: 'chat',
        status: 'pending',
        topic: 'Relationship communication issues',
      });
    }
    await Booking.insertMany(bookingData);
    console.log(`Seeded ${bookingData.length} bookings`);

    // === COUNSELOR AVAILABILITIES ===
    const availabilityData = [];
    for (const c of createdCounselors) {
      for (const av of counselorAvailabilities) {
        availabilityData.push({
          counselor: c._id,
          ...av,
        });
      }
    }
    await CounselorAvailability.insertMany(availabilityData);
    console.log(`Seeded ${availabilityData.length} counselor availability slots`);

    console.log('\n========================================');
    console.log('  SEED COMPLETE! All sample data loaded.');
    console.log('========================================');
    console.log(`\nSample user 1: anonymousId=IntwaliInyenyeri850, displayName=IntwaliInyenyeri850 (admin role)`);
    console.log(`Sample user 2: anonymousId=MutesiUrugero123, displayName=MutesiUrugero (user role)`);
    console.log(`Admin login:    email=admin@mindspace.rw, password=admin123`);
    console.log(`Counselor login: use any counselor email, password=admin123`);
    console.log(`\nAll ${countCollections()} collections seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

function countCollections() {
  return 15; // Total collections we seed
}

seed();
