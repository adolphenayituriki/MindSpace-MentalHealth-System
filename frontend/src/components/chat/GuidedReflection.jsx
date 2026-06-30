import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { chatAPI } from '../../services/api';

const WELCOME_MESSAGES = {
  rw: 'Murakaza neza. Aha ni ahantu hatekanye. Ushaka kuvuga ibiri ku mutima wawe? Ndi hano kugirango nkumve.',
  en: 'Welcome. This is a safe space. Would you like to share what is on your heart? I am here to listen without judgment.',
};

const REFLECTION_PROMPTS = {
  rw: [
    'Ni iki kikugoye uyu munsi? Ushaka kukivuga?',
    'Wumva ute ubwo utekereza ibintu byakubayeho mu buzima?',
    'Hari ikintu wifuza kureka kikagutunga ubwoba?',
    'Ni iki wakora wiyitaho igihe umerewe nabi?',
    'Hari umuntu wakwiyisaho mu gihe ukeneye ubufasha?',
    'Wumva ute ubwo utekereza ejo hazaza hawe?',
    'Ni iyihe nkuru yawe ukunda cyane?',
    'Hari ikintu cyaguteye amahoro muri iki cyumweru?',
    'Wibuka igihe wagombaga gukomeza n\'ubwo byari bigoye?',
    'Ni iki wakwishimira muri iki gihe?',
  ],
  en: [
    'What has been weighing on your heart today?',
    'Is there something from your past that still feels heavy? You can talk about it here.',
    'What fear has been holding you back from moving forward?',
    'What do you do to take care of yourself when you feel overwhelmed?',
    'Is there someone in your life you can truly open up to?',
    'How do you feel when you think about your future?',
    'What is a memory that brings you strength when life is hard?',
    'What gave you a moment of peace this week, however brief?',
    'Remember a time you found strength you did not know you had. What got you through?',
    'What is something you can be proud of right now, no matter how small?',
  ],
};

const msgVariants = {
  enter: { opacity: 0, y: 12, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
};

export default function GuidedReflection() {
  const { t, getLanguage } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const endRef = useRef(null);
  const lang = getLanguage();

  useEffect(() => {
    setMessages([
      {
        content: WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en,
        isFromAI: true,
        isWelcome: true,
      },
    ]);
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setCrisis(false);

    setMessages((prev) => [
      ...prev,
      { content: text, isFromAI: false, _temp: true },
    ]);

    try {
      const res = await chatAPI.send(text);
      setMessages((prev) =>
        prev
          .filter((m) => !m._temp)
          .concat({
            content: res.data.aiMessage.content,
            isFromAI: true,
            createdAt: res.data.aiMessage.createdAt,
          })
      );
      if (res.data.crisisDetected) {
        setCrisis(true);
      }
    } catch (_) {
      setMessages((prev) => prev.filter((m) => !m._temp));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    await chatAPI.clear();
    setMessages([
      {
        content: WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en,
        isFromAI: true,
        isWelcome: true,
      },
    ]);
  };

  const prompts = REFLECTION_PROMPTS[lang] || REFLECTION_PROMPTS.en;

  return (
    <motion.div
      className="card reflection-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex-between mb-1">
        <h3 className="card-title" style={{ margin: 0 }}>Guided Reflection</h3>
        <motion.button
          className="btn btn-sm btn-ghost"
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear
        </motion.button>
      </div>

      <motion.div
        className="reflection-prompt"
        onClick={() => {
          setInput(prompts[promptIndex % prompts.length]);
          setPromptIndex((i) => i + 1);
        }}
        whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
        whileTap={{ scale: 0.98 }}
      >
        {prompts[promptIndex % prompts.length]} — tap to use
      </motion.div>

      <div className="reflection-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`msg-bubble ${msg.isFromAI ? 'system' : 'user'}`}
              variants={msgVariants}
              initial="enter"
              animate="center"
              transition={{ duration: 0.25, delay: i === 0 ? 0 : 0.05 }}
            >
              {msg.isFromAI && (
                <div className="msg-author">MindSpace</div>
              )}
              <div>{msg.content}</div>
              {msg.createdAt && (
                <div className="msg-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span /><span /><span />
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {crisis && (
        <motion.div
          className="crisis-notice"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>It sounds like you may be going through a difficult time. You are not alone.</p>
          <div className="crisis-actions">
            <motion.a
              href="tel:3002"
              className="btn btn-danger btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Call 3002
            </motion.a>
            <motion.a
              href="tel:112"
              className="btn btn-danger btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Call 112
            </motion.a>
          </div>
        </motion.div>
      )}

      <div className="reflection-input-area">
        <textarea
          className="input textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what is on your mind..."
          rows={2}
          style={{ minHeight: 44 }}
        />
        <motion.button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          whileHover={input.trim() && !loading ? { scale: 1.05 } : {}}
          whileTap={input.trim() && !loading ? { scale: 0.95 } : {}}
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
}
