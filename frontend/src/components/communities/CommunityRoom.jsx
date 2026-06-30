import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/i18n';
import { communityAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const msgVariants = {
  enter: { opacity: 0, y: 12, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
};

export default function CommunityRoom({ community, onBack }) {
  const { getLanguage } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());
  const endRef = useRef(null);
  const lang = getLanguage();

  useEffect(() => {
    setLoading(true);
    communityAPI.getMessages(community._id).then((res) => {
      setMessages(res.data?.messages || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [community._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setSending(true);
    try {
      const res = await communityAPI.postMessage(community._id, text);
      const msg = res.data.message;
      setMessages((prev) => [...prev, msg]);
      setSentIds((prev) => new Set(prev).add(msg._id));
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

  const displayName = lang === 'rw'
    ? (community.nameRw || community.name)
    : (community.name || community.nameRw);

  return (
    <motion.div
      className="card room-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="room-header">
        <motion.button
          className="btn btn-sm btn-ghost"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          &larr; Back
        </motion.button>
        <h3>{displayName}</h3>
        <span className="topic-tag">{community.topic}</span>
      </div>

      <div className="room-messages">
        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading messages...</p></div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>{'\u{1F4AC}'}</div>
            <p>{lang === 'rw' ? 'Nta butumwa buracyari. Ube uwambere.' : 'No messages yet. Be the first to share.'}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMine = sentIds.has(msg._id);
              return (
                <motion.div
                  key={msg._id || i}
                  className={`msg-bubble ${isMine ? 'user' : 'system'}`}
                  variants={msgVariants}
                  initial="enter"
                  animate="center"
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  {!isMine && <div className="msg-author">{msg.anonymousName || 'Anonymous'}</div>}
                  <div>{msg.content}</div>
                  <div className="msg-time">
                    {msg.createdAt ? formatDate(msg.createdAt) : ''}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={endRef} />
      </div>

      <div className="reflection-input-area" style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
        <textarea
          className="input textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share a message..."
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
