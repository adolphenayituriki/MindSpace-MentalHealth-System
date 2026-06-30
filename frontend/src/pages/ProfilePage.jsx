import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useToast } from '../contexts/ToastContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        relationshipStatus: user.relationshipStatus || '',
        age: user.age || '',
        phone: user.phone || '',
        language: user.language || 'rw',
        preferredTopics: user.preferredTopics || [],
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast?.success('Profile updated');
    } catch (_) {
      toast?.error('Failed to update profile');
    }
    setSaving(false);
  };

  if (!user) return <LoadingSkeleton />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your personal information and preferences</p>
      </div>
      <motion.div className="profile-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar-section">
          <div className="profile-avatar">{user.displayName?.charAt(0).toUpperCase() || '?'}</div>
          <div>
            <h2>{user.displayName || 'User'}</h2>
            <span className="profile-email">{user.email || 'Anonymous'}</span>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Display Name</label>
            <input className="form-input" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Relationship Status</label>
            <select className="form-input" value={form.relationshipStatus} onChange={(e) => setForm((f) => ({ ...f, relationshipStatus: e.target.value }))}>
              <option value="">Select...</option>
              <option value="single">Single</option>
              <option value="engaged">Engaged</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input className="form-input" type="number" min={18} max={120} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-input" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+250..." />
          </div>
          <div className="form-group">
            <label>Language</label>
            <select className="form-input" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
              <option value="rw">Kinyarwanda</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="form-group">
            <label>Topics of Interest</label>
            <div className="topic-chips">
              {['Anxiety', 'Depression', 'Grief', 'PTSD', 'Burnout', 'Relationships', 'Trauma', 'Stress', 'Parenting', 'Retirement'].map((t) => (
                <button key={t} className={`chip ${form.preferredTopics?.includes(t) ? 'active' : ''}`}
                  onClick={() => setForm((f) => ({
                    ...f,
                    preferredTopics: f.preferredTopics?.includes(t)
                      ? f.preferredTopics.filter((x) => x !== t)
                      : [...(f.preferredTopics || []), t],
                  }))}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', marginTop: '1rem' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.div>
    </div>
  );
}
