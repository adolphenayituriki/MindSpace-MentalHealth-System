import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = '/api';

function getToken() {
  const t = localStorage.getItem('mindspace_token');
  if (t) return t;
  const at = sessionStorage.getItem('homechart_token');
  if (at) return at;
  return null;
}

const MOOD_RESPONSES = {
  greeting: [
    `Hi there! I'm here to listen and help. How are you feeling today?`,
    `Muraho! Welcome to MindSpace. What's on your mind?`,
    `Hello! Would you like to explore what MindSpace can do for you?`,
  ],
  sad: [
    `I hear you. It's okay to feel this way. Would you like to try a breathing exercise together?`,
    `Thank you for sharing that with me. You're not alone in this. Try our mood tracking to see patterns over time.`,
    `That sounds really difficult. Our counselors are available through MindSpace if you'd like to connect.`,
  ],
  anxiety: [
    `Let's take a moment. Breathe in for 4 counts, hold for 4, out for 4. You're safe here.`,
    `Anxiety can be overwhelming. Our guided journaling has prompts that might help.`,
    `This feeling will pass. Would you like to talk more about what's causing the anxiety?`,
  ],
  trauma: [
    `You're in a safe space here. If you're experiencing distress, you can reach a counselor through our platform.`,
    `Thank you for trusting me. Would you like a grounding exercise, or to talk more about it?`,
  ],
  grief: [
    `I'm so sorry for your loss. Whatever you're feeling is valid. Would you like to talk about them?`,
    `Our journaling feature has prompts to help process grief in your own time and language.`,
  ],
  general: [
    `MindSpace offers mood tracking, journaling, peer communities, and professional counselors — all free and anonymous.`,
    `I can help guide you. What are you looking for?`,
  ],
  crisis: [
    `Please reach out for immediate support: Call 3002 (Crisis Hotline) or 112 (Emergency). You matter.`,
    `Your safety is the most important thing. Please call 3002 right now.`,
  ],
};

function getResponse(msg) {
  const lower = msg.toLowerCase();
  if (/\b(crisis|suicide|kill myself|end my life|want to die|self.?harm|hurt myself)\b/.test(lower))
    return MOOD_RESPONSES.crisis[Math.floor(Math.random() * MOOD_RESPONSES.crisis.length)];
  if (/\b(hello|hi|hey|muraho|mwiriwe)\b/.test(lower))
    return MOOD_RESPONSES.greeting[Math.floor(Math.random() * MOOD_RESPONSES.greeting.length)];
  if (/\b(sad|down|lonely|depressed|unhappy|hopeless|crying|agahinda)\b/.test(lower))
    return MOOD_RESPONSES.sad[Math.floor(Math.random() * MOOD_RESPONSES.sad.length)];
  if (/\b(trauma|ptsd|flashback|genocide|abuse|hurt|painful|memory)\b/.test(lower))
    return MOOD_RESPONSES.trauma[Math.floor(Math.random() * MOOD_RESPONSES.trauma.length)];
  if (/\b(anxi|anxious|panic|worr|stress|nervous|fear|scared|ubwoba|kubabara)\b/.test(lower))
    return MOOD_RESPONSES.anxiety[Math.floor(Math.random() * MOOD_RESPONSES.anxiety.length)];
  if (/\b(grief|lost|died|death|funeral|miss them|gone|gutakaza|gupfa)\b/.test(lower))
    return MOOD_RESPONSES.grief[Math.floor(Math.random() * MOOD_RESPONSES.grief.length)];
  return MOOD_RESPONSES.general[Math.floor(Math.random() * MOOD_RESPONSES.general.length)];
}

const ChartIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
    <line x1="15" y1="21" x2="15" y2="9"/>
  </svg>
);

const AvatarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
    <line x1="15" y1="21" x2="15" y2="9"/>
  </svg>
);

export default function HomeChartFab() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [anonToken, setAnonToken] = useState(null);
  const [crisis, setCrisis] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) return;
    const t = sessionStorage.getItem('homechart_token');
    if (t) { setAnonToken(t); return; }
    fetch(`${API_BASE}/auth/anonymous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'en' }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.token) {
          sessionStorage.setItem('homechart_token', d.token);
          setAnonToken(d.token);
        }
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.home-chart-fab')) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setCrisis(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE}/chat`, { method: 'POST', headers, body: JSON.stringify({ content: text }) });
      const data = await res.json();
      if (data.aiMessage) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.aiMessage.content }]);
        if (data.crisisDetected) setCrisis(true);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: getResponse(text) }]);
      }
    } catch (_) {
      setMessages((prev) => [...prev, { role: 'assistant', content: getResponse(text) }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <>
      <motion.button
        className="home-chart-fab"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open AI assistant"
      >
        <ChartIcon size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="home-chart-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="home-chart-panel-header">
              <div className="home-chart-panel-title">
                <ChartIcon size={18} />
                <div>
                  <strong>MindSpace AI</strong>
                  <small>Confidential support, anytime</small>
                </div>
              </div>
              <button className="home-chart-panel-close" onClick={() => setOpen(false)}>{'\u2715'}</button>
            </div>

            <div className="home-chart-panel-body">
              {messages.length === 0 && (
                <div className="home-chart-welcome">
                  <p className="home-chart-welcome-text">Ask me anything about mental health or MindSpace features.</p>
                  <div className="home-chart-suggestions">
                    {['Tell me about MindSpace', 'I feel anxious', 'Need help', 'Mood tracking'].map((s) => (
                      <button key={s} className="home-chart-chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`home-chart-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                  {m.role === 'ai' && <span className="home-chart-avatar"><AvatarIcon /></span>}
                  <div className="home-chart-bubble"><p>{m.content}</p></div>
                </div>
              ))}
              {loading && (
                <div className="home-chart-msg ai">
                  <span className="home-chart-avatar"><AvatarIcon /></span>
                  <div className="home-chart-bubble">
                    <span className="home-chart-typing"><span /><span /><span /></span>
                  </div>
                </div>
              )}
              {crisis && (
                <div className="home-chart-crisis">
                  <p><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Need immediate help?</p>
                  <strong>Crisis Hotline: 3002 &nbsp;|&nbsp; Emergency: 112</strong>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="home-chart-panel-footer">
              <input ref={inputRef} className="home-chart-input" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} disabled={loading} />
              <motion.button className="home-chart-send" onClick={handleSend} disabled={!input.trim() || loading} whileTap={{ scale: 0.9 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
