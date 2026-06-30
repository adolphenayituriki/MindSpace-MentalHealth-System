const Journal = require('../models/Journal');

exports.createEntry = async (req, res, next) => {
  try {
    const { title, content, prompt, mood, tags } = req.body;
    const entry = await Journal.create({
      user: req.user._id,
      title,
      content,
      prompt,
      mood,
      tags,
    });
    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
};

exports.getEntries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [entries, total] = await Promise.all([
      Journal.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Journal.countDocuments({ user: req.user._id }),
    ]);
    res.json({ entries, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

exports.getEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ entry });
  } catch (error) {
    next(error);
  }
};

exports.updateEntry = async (req, res, next) => {
  try {
    const { title, content, mood, tags } = req.body;
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, mood, tags, updatedAt: Date.now() },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ entry });
  } catch (error) {
    next(error);
  }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getPrompts = async (req, res, next) => {
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
      'Wumva ute ubwo utekereza abantu ukunda? Hari icyo ushaka kubabwira?',
      'Hari ikintu warinze kuvuga kikagutunga umutima? Ubu ni umwanya wo kukivuga.',
      'Ni iyihe ngero z\'abandi zakugirira icyizere cyo gukomeza?',
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
      'How are the people you love doing? Is there something you wish you could tell them?',
      'Is there something you have been keeping inside that needs to be released? This is a safe space.',
      'What stories of resilience from others give you hope to keep going?',
    ],
  };
  const lang = req.query.lang || 'rw';
  res.json({ prompts: prompts[lang] || prompts.en });
};
