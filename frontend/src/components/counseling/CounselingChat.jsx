import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { counselingAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const msgVariants = {
  enter: { opacity: 0, y: 12, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
};

export default function CounselingChat() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activating, setActivating] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    counselingAPI.getActiveSession().then((res) => {
      if (res.data?.session) {
        setSession(res.data.session);
        fetchMessages(res.data.session._id);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (sessionId) => {
    try {
      const res = await counselingAPI.getSessionMessages(sessionId);
      setMessages(res.data?.messages || []);
    } catch (_) {}
  };

  const handleRequest = async () => {
    if (!topic.trim()) return;
    setActivating(true);
    try {
      const res = await counselingAPI.requestSession({ topic: topic.trim() });
      setSession(res.data.session);
    } catch (_) {
    } finally {
      setActivating(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !session) return;
    setInput('');
    setSending(true);
    try {
      const res = await counselingAPI.sendMessage(session._id, text);
      setMessages((prev) => [...prev, res.data.message]);
    } catch (_) {
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = async () => {
    if (!session) return;
    await counselingAPI.closeSession(session._id, {});
    setSession(null);
    setMessages([]);
  };

  if (!session) {
    if (loading) {
      return (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>Counseling</div>
          <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>
        </div>
      );
    }
    return (
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-title" style={{ marginBottom: '0.75rem' }}>Start a Session</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
          No active session. Share what you would like to talk about, and a counselor will be matched with you.
        </p>
        <textarea
          className="input textarea"
          placeholder="What would you like to discuss?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          style={{ marginBottom: '0.75rem' }}
        />
        <motion.button
          className="btn btn-primary btn-lg w-full"
          onClick={handleRequest}
          disabled={activating || !topic.trim()}
          whileHover={topic.trim() && !activating ? { scale: 1.02 } : {}}
          whileTap={topic.trim() && !activating ? { scale: 0.98 } : {}}
        >
          {activating ? 'Requesting...' : 'Request a Session'}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card room-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="room-header">
        <h3>Counseling Session</h3>
        <span className={`session-status ${session.status}`}>{session.status}</span>
        <motion.button
          className="btn btn-sm btn-danger"
          onClick={handleClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          End Session
        </motion.button>
      </div>

      <div className="room-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id || i}
              className={`msg-bubble ${msg.isFromCounselor ? 'system' : 'user'}`}
              variants={msgVariants}
              initial="enter"
              animate="center"
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <div className="msg-author">{msg.isFromCounselor ? 'Counselor' : (msg.anonymousName || 'You')}</div>
              <div>{msg.content}</div>
              <div className="msg-time">
                {msg.createdAt ? formatDate(msg.createdAt) : ''}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="reflection-input-area">
        <textarea
          className="input textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={2}
          style={{ minHeight: 44 }}
        />
        <motion.button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          whileHover={input.trim() && !sending ? { scale: 1.05 } : {}}
          whileTap={input.trim() && !sending ? { scale: 0.95 } : {}}
        >
          {sending ? 'Sending...' : 'Send'}
        </motion.button>
      </div>
    </motion.div>
  );
}
