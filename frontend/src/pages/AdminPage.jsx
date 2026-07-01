import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/i18n';
import { useToast } from '../contexts/ToastContext';
import { adminAPI, healingAPI, counselingAPI, crisisAPI, communityAPI } from '../services/api';
import { FaChartLine, FaUsers, FaLeaf, FaUserMd, FaShieldAlt, FaHome, FaPuzzlePiece, FaBookOpen, FaCalendarAlt, FaSmile, FaHandshake } from 'react-icons/fa';

const TABS = ['stats', 'users', 'healing', 'counselors', 'crisis', 'communities', 'assessments', 'courses', 'bookings'];

const TAB_ICONS = {
  stats: <FaChartLine />,
  users: <FaUsers />,
  healing: <FaLeaf />,
  counselors: <FaUserMd />,
  crisis: <FaShieldAlt />,
  communities: <FaHome />,
  assessments: <FaPuzzlePiece />,
  courses: <FaBookOpen />,
  bookings: <FaCalendarAlt />,
};

const LABELS = {
  stats: { en: 'Overview', rw: 'Incamake' },
  users: { en: 'Users', rw: 'Abakoresha' },
  healing: { en: 'Healing Resources', rw: 'Ibikoresho by\'ubuvuzi' },
  counselors: { en: 'Counselors', rw: 'Abajyanama' },
  crisis: { en: 'Crisis Resources', rw: 'Ibikoresho by\'ihutirwa' },
  communities: { en: 'Communities', rw: 'Imiryango' },
  assessments: { en: 'Assessments', rw: 'Ibizamini' },
  courses: { en: 'Courses', rw: 'Amasomo' },
  bookings: { en: 'Bookings', rw: 'Gufata icyanya' },
};

function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            style={{ maxWidth: '520px' }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, textAlign: 'left', fontSize: '1.15rem' }}>{title}</h2>
              <button onClick={onClose} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '1.1rem', lineHeight: 1, border: 'none', background: 'var(--bg-muted)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>&times;</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AdminForm({ fields, initial, onSave, onCancel, saving, lang }) {
  const [form, setForm] = useState(initial || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {fields.map((f) => (
        <div key={f.key} className="admin-field">
          <label>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              rows={f.rows || 3}
              required={f.required}
            />
          ) : f.type === 'select' ? (
            <select
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              required={f.required}
            >
              <option value="">{lang === 'rw' ? 'Hitamo...' : 'Select...'}</option>
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || 'text'}
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              required={f.required}
            />
          )}
        </div>
      ))}
      <div className="flex-row" style={{ gap: '0.5rem', marginTop: '0.75rem' }}>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
          {saving ? (lang === 'rw' ? 'Bibika...' : 'Saving...') : (lang === 'rw' ? 'Bika' : 'Save')}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ flex: 1 }}>
          {lang === 'rw' ? 'Guhagarika' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card" style={{ height: '100px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ height: '16px', width: '60%', background: 'var(--bg-muted)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '28px', width: '40%', background: 'var(--bg-muted)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getLanguage } = useTranslation();
  const lang = getLanguage();
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'counselor')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'counselor')) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>{lang === 'rw' ? 'Ubucungamari' : 'Admin'}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
          {lang === 'rw' ? 'Cunga porogaramu ya MindSpace' : 'Manage the MindSpace platform'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', padding: '0.25rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, minWidth: 0, whiteSpace: 'nowrap',
              padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: tab === t ? 600 : 500,
              border: 'none', borderRadius: 'var(--radius)',
              background: tab === t ? 'var(--bg-card)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text-secondary)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer', transition: 'all var(--transition)',
              fontFamily: 'var(--font)',
            }}
          >
            {TAB_ICONS[t]} {LABELS[t][lang]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'stats' && <StatsPanel lang={lang} />}
          {tab === 'users' && <UsersPanel lang={lang} />}
          {tab === 'healing' && <HealingPanel lang={lang} />}
          {tab === 'counselors' && <CounselorsPanel lang={lang} />}
          {tab === 'crisis' && <CrisisPanel lang={lang} />}
          {tab === 'communities' && <CommunitiesPanel lang={lang} />}
          {tab === 'assessments' && <AssessmentsPanel lang={lang} />}
          {tab === 'courses' && <CoursesPanel lang={lang} />}
          {tab === 'bookings' && <BookingsPanel lang={lang} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
function StatsPanel({ lang }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);

  if (!stats) return <LoadingSkeleton />;

  const items = [
    { icon: <FaUsers />, label: lang === 'rw' ? 'Abakoresha' : 'Users', value: stats.users, color: '#0D9488' },
    { icon: <FaUserMd />, label: lang === 'rw' ? 'Abajyanama' : 'Counselors', value: stats.counselors, color: '#6366F1' },
    { icon: <FaLeaf />, label: lang === 'rw' ? 'Ibikoresho by\'ubuvuzi' : 'Healing Resources', value: stats.healing, color: '#10B981' },
    { icon: <FaShieldAlt />, label: lang === 'rw' ? 'Ibikoresho by\'ihutirwa' : 'Crisis Resources', value: stats.crisis, color: '#F59E0B' },
    { icon: <FaHome />, label: lang === 'rw' ? 'Imiryango' : 'Communities', value: stats.communities, color: '#EC4899' },
    { icon: <FaHandshake />, label: lang === 'rw' ? 'Ibibazo' : 'Counseling Sessions', value: stats.sessions, color: '#8B5CF6' },
    { icon: <FaSmile />, label: lang === 'rw' ? 'Ibyiyumvo' : 'Mood Entries', value: stats.moods, color: '#F97316' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
      {items.map((i) => (
        <motion.div
          key={i.label}
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div style={{ fontSize: '1.5rem' }}>{i.icon}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: i.color, lineHeight: 1.1 }}>{i.value}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{i.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
function UsersPanel({ lang }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers().then((r) => { setUsers(r.data.users); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRole = (id, role) => {
    adminAPI.updateUserRole(id, role).then(() => {
      toast?.success(lang === 'rw' ? 'Uruhare rwahinduwe' : 'Role updated');
      fetchUsers();
    }).catch(() => {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Failed to update role');
    });
  };
  const handleDelete = (id) => {
    if (!window.confirm(lang === 'rw' ? 'Ukuraho uyu mukoresha?' : 'Delete this user?')) return;
    adminAPI.deleteUser(id).then(() => {
      toast?.success(lang === 'rw' ? 'Yakuvuyemo neza' : 'User deleted');
      fetchUsers();
    }).catch(() => {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Delete failed');
    });
  };
  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await adminAPI.createUser(data);
      toast?.success(lang === 'rw' ? 'Umukoresha yakozwe' : 'User created');
      setShowForm(false);
      fetchUsers();
    } catch (_) {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Failed to create user');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSkeleton />;

  const roleColors = { admin: '#EF4444', counselor: '#6366F1', user: '#0D9488' };

  const userFields = [
    { key: 'displayName', label: 'Display Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'password', label: 'Password', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'select', options: ['user', 'counselor', 'admin'], required: true },
    { key: 'language', label: 'Language', type: 'select', options: ['en', 'rw'] },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {users.length} {users.length === 1 ? (lang === 'rw' ? 'umukoresha' : 'user') : (lang === 'rw' ? 'abakoresha' : 'users')}
        </span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          + {lang === 'rw' ? 'Ongeraho umukoresha' : 'Add User'}
        </button>
      </div>

      <Modal open={showForm} title={lang === 'rw' ? 'Ongeraho umukoresha' : 'Add User'} onClose={() => setShowForm(false)}>
        <AdminForm fields={userFields} initial={{}} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} lang={lang} />
      </Modal>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th>{lang === 'rw' ? 'Izina' : 'Name'}</th>
                <th>{lang === 'rw' ? 'Email' : 'Email'}</th>
                <th>{lang === 'rw' ? 'Ururimi' : 'Lang'}</th>
                <th>{lang === 'rw' ? 'Uruhare' : 'Role'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'rw' ? 'Ibyakozwe' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.displayName || u.anonymousId}</strong></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.email || '\u2014'}</td>
                  <td>{u.language?.toUpperCase()}</td>
                  <td>
                    <span
                      className="admin-badge"
                      style={{
                        background: `${roleColors[u.role] || '#6B7280'}18`,
                        color: roleColors[u.role] || '#6B7280',
                        border: `1px solid ${roleColors[u.role] || '#6B7280'}30`,
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </span>
                    <select
                      className="admin-select"
                      value={u.role}
                      onChange={(e) => handleRole(u._id, e.target.value)}
                      disabled={u._id === users[0]?._id}
                      style={{ marginLeft: '0.4rem', fontSize: '0.75rem', padding: '0.15rem 0.3rem' }}
                    >
                      <option value="user">user</option>
                      <option value="counselor">counselor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)} style={{ fontSize: '0.75rem' }}>
                      {lang === 'rw' ? 'Kuraho' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function CrudPanel({
  lang, fetchFn, extractItems,
  createFn, updateFn, deleteFn,
  fields, itemKey, itemTitle, addLabel, editLabel,
  renderRow, transformInitial, transformSave,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetchFn().then((r) => { setItems(extractItems(r)); setLoading(false); }).catch(() => setLoading(false));
  }, [fetchFn, extractItems]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = transformSave ? transformSave(data) : data;
      if (editing) {
        await updateFn(editing[itemKey], payload);
        toast?.success(lang === 'rw' ? 'Byahinduwe neza' : 'Updated successfully');
      } else {
        await createFn(payload);
        toast?.success(lang === 'rw' ? 'Byakozwe neza' : 'Created successfully');
      }
      closeForm();
      fetchItems();
    } catch (_) {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Action failed');
    }
    setSaving(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(lang === 'rw' ? 'Ukuraho?' : 'Delete?')) return;
    deleteFn(id).then(() => {
      toast?.success(lang === 'rw' ? 'Byakuvuyemo neza' : 'Deleted successfully');
      fetchItems();
    }).catch(() => {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Delete failed');
    });
  };

  const getInitial = (item) => transformInitial ? transformInitial(item) : (item || {});

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {items.length} {items.length === 1 ? (lang === 'rw' ? 'ikintu' : 'item') : (lang === 'rw' ? 'ibintu' : 'items')}
        </span>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          + {addLabel}
        </button>
      </div>

      <Modal open={showForm} title={editing ? `${editLabel}: ${editing[itemTitle] || ''}` : addLabel} onClose={closeForm}>
        <AdminForm
          fields={fields}
          initial={getInitial(editing)}
          onSave={handleSave}
          onCancel={closeForm}
          saving={saving}
          lang={lang}
        />
      </Modal>

      <div className="admin-list">
        {items.map((item, idx) => (
          <motion.div
            key={item[itemKey]}
            className="admin-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            {renderRow(item, openEdit, handleDelete)}
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {lang === 'rw' ? 'Nta kintu cyabonetse' : 'No items found'}
          </div>
        )}
      </div>
    </div>
  );
}
function HealingPanel({ lang }) {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'titleRw', label: 'Title (Kinyarwanda)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'descriptionRw', label: 'Description (Kinyarwanda)', type: 'textarea' },
    { key: 'type', label: 'Type', type: 'select', options: ['breathing', 'sound', 'sleep_tool', 'video', 'article', 'guided_exercise'], required: true },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'embedUrl', label: 'Video/Embed URL', type: 'text' },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => healingAPI.getAll()}
      extractItems={(r) => r.data?.resources || []}
      createFn={adminAPI.createHealingResource}
      updateFn={adminAPI.updateHealingResource}
      deleteFn={adminAPI.deleteHealingResource}
      fields={fields}
      itemKey="_id"
      itemTitle="title"
      addLabel={lang === 'rw' ? 'Ongeraho igikoresho' : 'Add Resource'}
      editLabel={lang === 'rw' ? 'Hindura' : 'Edit'}
      renderRow={(r, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{r.title}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="admin-badge">{r.type}</span>
              {r.duration && <span className="admin-meta">{r.duration}</span>}
              {r.isFeatured && <span className="admin-badge" style={{ background: '#F59E0B18', color: '#F59E0B', border: '1px solid #F59E0B30' }}>Featured</span>}
            </div>
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit(r)}>{lang === 'rw' ? 'Hindura' : 'Edit'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(r._id)}>{lang === 'rw' ? 'Kuraho' : 'Del'}</button>
          </div>
        </>
      )}
    />
  );
}
function CounselorsPanel({ lang }) {
  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea', required: true },
    { key: 'bioRw', label: 'Bio (Kinyarwanda)', type: 'textarea' },
    { key: 'specialization', label: 'Specializations (comma separated)', type: 'text' },
    { key: 'languages', label: 'Languages (comma separated)', type: 'text' },
    { key: 'isAvailable', label: 'Available', type: 'select', options: ['true', 'false'] },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => counselingAPI.getCounselors()}
      extractItems={(r) => r.data?.counselors || r.data || []}
      createFn={adminAPI.createCounselor}
      updateFn={adminAPI.updateCounselor}
      deleteFn={adminAPI.deleteCounselor}
      fields={fields}
      itemKey="_id"
      itemTitle="fullName"
      addLabel={lang === 'rw' ? 'Ongeraho umujyanama' : 'Add Counselor'}
      editLabel={lang === 'rw' ? 'Hindura' : 'Edit'}
      renderRow={(c, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{c.fullName}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className={`admin-badge ${c.isAvailable ? 'admin-badge-green' : ''}`}>
                {c.isAvailable ? 'Available' : 'Offline'}
              </span>
              {c.specialization?.map((s) => (
                <span key={s} className="admin-meta" style={{ background: 'var(--bg-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>{s}</span>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {c.email} {c.phone ? `\u00B7 ${c.phone}` : ''}
            </div>
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit(c)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(c._id)}>Del</button>
          </div>
        </>
      )}
      transformInitial={(c) => c ? { ...c, isAvailable: c.isAvailable ? 'true' : 'false' } : {}}
      transformSave={(data) => ({
        ...data,
        isAvailable: data.isAvailable === 'true',
        specialization: data.specialization ? data.specialization.split(',').map(s => s.trim()) : [],
        languages: data.languages ? data.languages.split(',').map(s => s.trim()) : [],
      })}
    />
  );
}
function CrisisPanel({ lang }) {
  const fields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'nameRw', label: 'Name (Kinyarwanda)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'descriptionRw', label: 'Description (Kinyarwanda)', type: 'textarea' },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['hotline', 'center', 'shelter', 'clinic'], required: true },
    { key: 'location', label: 'Location', type: 'text' },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => crisisAPI.getResources()}
      extractItems={(r) => r.data?.resources || []}
      createFn={adminAPI.createCrisisResource}
      updateFn={adminAPI.updateCrisisResource}
      deleteFn={adminAPI.deleteCrisisResource}
      fields={fields}
      itemKey="_id"
      itemTitle="name"
      addLabel="+ Add Crisis Resource"
      editLabel="Edit"
      renderRow={(r, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{r.name}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="admin-badge">{r.type}</span>
              <span className="admin-meta">{r.phone}</span>
            </div>
            {r.location && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{r.location}</div>}
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit(r)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(r._id)}>Del</button>
          </div>
        </>
      )}
    />
  );
}
function CommunitiesPanel({ lang }) {
  const fields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'nameRw', label: 'Name (Kinyarwanda)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'descriptionRw', label: 'Description (Kinyarwanda)', type: 'textarea' },
    { key: 'topic', label: 'Topic', type: 'text', required: true },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => communityAPI.getAll()}
      extractItems={(r) => r.data?.communities || []}
      createFn={adminAPI.createCommunity}
      updateFn={adminAPI.updateCommunity}
      deleteFn={adminAPI.deleteCommunity}
      fields={fields}
      itemKey="_id"
      itemTitle="name"
      addLabel="+ Add Community"
      editLabel="Edit"
      renderRow={(c, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{c.icon || ''} {c.name}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="admin-meta">{c.topic}</span>
              <span className="admin-meta">{c.memberCount || 0} members</span>
            </div>
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit(c)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(c._id)}>Del</button>
          </div>
        </>
      )}
    />
  );
}
function AssessmentsPanel({ lang }) {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'titleRw', label: 'Title (Kinyarwanda)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'descriptionRw', label: 'Description (Kinyarwanda)', type: 'textarea' },
    { key: 'type', label: 'Type', type: 'select', options: ['relationship', 'stress', 'wellbeing', 'readiness', 'general'], required: true },
    { key: 'estimatedMinutes', label: 'Estimated Minutes', type: 'number' },
    { key: 'active', label: 'Active', type: 'select', options: ['true', 'false'] },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => adminAPI.getAssessments()}
      extractItems={(r) => r.data?.assessments || []}
      createFn={(data) => adminAPI.createAssessment({ ...data, active: data.active === 'true' })}
      updateFn={(id, data) => adminAPI.updateAssessment(id, { ...data, active: data.active === 'true' })}
      deleteFn={adminAPI.deleteAssessment}
      fields={fields}
      itemKey="_id"
      itemTitle="title"
      addLabel={lang === 'rw' ? 'Ongeraho ikizamini' : 'Add Assessment'}
      editLabel={lang === 'rw' ? 'Hindura' : 'Edit'}
      renderRow={(a, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{a.title}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="admin-badge">{a.type}</span>
              <span className="admin-meta">{a.questions?.length || 0} questions</span>
              <span className="admin-meta">{a.estimatedMinutes || '-'} min</span>
              {!a.active && <span className="admin-badge" style={{ background: '#EF444418', color: '#EF4444', border: '1px solid #EF444430' }}>Inactive</span>}
            </div>
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit({ ...a, active: a.active ? 'true' : 'false' })}>{lang === 'rw' ? 'Hindura' : 'Edit'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(a._id)}>{lang === 'rw' ? 'Kuraho' : 'Del'}</button>
          </div>
        </>
      )}
    />
  );
}
function CoursesPanel({ lang }) {
  const fields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'titleRw', label: 'Title (Kinyarwanda)', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'subtitleRw', label: 'Subtitle (Kinyarwanda)', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'descriptionRw', label: 'Description (Kinyarwanda)', type: 'textarea' },
    { key: 'category', label: 'Category', type: 'select', options: ['premarital', 'couples', 'parenting', 'grief', 'retirement', 'wellbeing'], required: true },
    { key: 'level', label: 'Level', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
    { key: 'estimatedHours', label: 'Estimated Hours', type: 'number' },
    { key: 'certificateEligible', label: 'Certificate Eligible', type: 'select', options: ['true', 'false'] },
    { key: 'published', label: 'Published', type: 'select', options: ['true', 'false'] },
  ];

  return (
    <CrudPanel
      lang={lang}
      fetchFn={() => adminAPI.getCourses()}
      extractItems={(r) => r.data?.courses || []}
      createFn={(data) => adminAPI.createCourse({
        ...data,
        certificateEligible: data.certificateEligible === 'true',
        published: data.published === 'true',
      })}
      updateFn={(id, data) => adminAPI.updateCourse(id, {
        ...data,
        certificateEligible: data.certificateEligible === 'true',
        published: data.published === 'true',
      })}
      deleteFn={adminAPI.deleteCourse}
      fields={fields}
      itemKey="_id"
      itemTitle="title"
      addLabel={lang === 'rw' ? 'Ongeraho isomo' : 'Add Course'}
      editLabel={lang === 'rw' ? 'Hindura' : 'Edit'}
      renderRow={(c, onEdit, onDelete) => (
        <>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{c.title}</strong>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              <span className="admin-badge">{c.category}</span>
              <span className="admin-meta">{c.level}</span>
              <span className="admin-meta">{c.modules?.length || 0} modules</span>
              {c.estimatedHours && <span className="admin-meta">{c.estimatedHours}h</span>}
              {!c.published && <span className="admin-badge" style={{ background: '#EF444418', color: '#EF4444', border: '1px solid #EF444430' }}>Draft</span>}
            </div>
          </div>
          <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
            <button className="btn btn-sm" onClick={() => onEdit({
              ...c,
              certificateEligible: c.certificateEligible ? 'true' : 'false',
              published: c.published ? 'true' : 'false',
            })}>{lang === 'rw' ? 'Hindura' : 'Edit'}</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(c._id)}>{lang === 'rw' ? 'Kuraho' : 'Del'}</button>
          </div>
        </>
      )}
    />
  );
}
function BookingsPanel({ lang }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchBookings = useCallback(() => {
    setLoading(true);
    adminAPI.getAllBookings().then((r) => { setBookings(r.data.bookings); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleDelete = (id) => {
    if (!window.confirm(lang === 'rw' ? 'Ukuraho iki cyanya?' : 'Delete this booking?')) return;
    adminAPI.deleteBooking(id).then(() => {
      toast?.success(lang === 'rw' ? 'Cyakuvuyemo neza' : 'Booking deleted');
      fetchBookings();
    }).catch(() => {
      toast?.error(lang === 'rw' ? 'Ibyakozwe byanze' : 'Delete failed');
    });
  };

  if (loading) return <LoadingSkeleton />;

  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#0D9488',
    completed: '#10B981',
    cancelled: '#EF4444',
  };

  return (
    <div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {bookings.length} {bookings.length === 1 ? (lang === 'rw' ? 'icyanya' : 'booking') : (lang === 'rw' ? 'ibyanya' : 'bookings')}
      </div>
      <div className="admin-list">
        {bookings.map((b, idx) => (
          <motion.div
            key={b._id}
            className="admin-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{b.user?.displayName || b.user?.email || 'Unknown'}</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <span className="admin-meta">{b.counselor?.fullName || 'Unknown counselor'}</span>
                <span className="admin-meta">{new Date(b.date).toLocaleDateString()}</span>
                <span className="admin-meta">{b.type}</span>
                <span
                  className="admin-badge"
                  style={{
                    background: `${statusColors[b.status] || '#6B7280'}18`,
                    color: statusColors[b.status] || '#6B7280',
                    border: `1px solid ${statusColors[b.status] || '#6B7280'}30`,
                    fontWeight: 600,
                  }}
                >
                  {b.status}
                </span>
              </div>
              {b.topic && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{b.topic}</div>}
            </div>
            <div className="flex-row" style={{ gap: '0.35rem', flexShrink: 0 }}>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b._id)}>
                {lang === 'rw' ? 'Kuraho' : 'Del'}
              </button>
            </div>
          </motion.div>
        ))}
        {bookings.length === 0 && (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {lang === 'rw' ? 'Nta cyanya cyabonetse' : 'No bookings found'}
          </div>
        )}
      </div>
    </div>
  );
}
