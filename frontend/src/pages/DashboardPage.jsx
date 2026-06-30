import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getGreeting } from '../utils/helpers';
import MoodTracker from '../components/mood/MoodTracker';
import MoodCalendar from '../components/mood/MoodCalendar';
import MoodInsights from '../components/insights/MoodInsights';
import WeeklyReflection from '../components/insights/WeeklyReflection';
import ChatCards from '../components/dashboard/ChatCards';
import HealingResources from '../components/healing/HealingResources';
import { useTranslation } from '../i18n/i18n';
import { adminAPI, counselingAPI } from '../services/api';

const roleStyles = {
  admin: { color: '#EF4444', bg: '#EF444418', border: '#EF444430' },
  counselor: { color: '#6366F1', bg: '#6366F118', border: '#6366F120' },
  user: { color: '#0D9488', bg: '#0D948818', border: '#0D948830' },
};

function RoleBadge({ role }) {
  const s = roleStyles[role] || roleStyles.user;
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      padding: '0.15rem 0.55rem', borderRadius: '6px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {role === 'admin' ? 'Admin' : role === 'counselor' ? 'Counselor' : 'User'}
    </span>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '1rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}
    >
      <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</div>
      </div>
    </motion.div>
  );
}

function ActionCard({ to, icon, label, desc, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: '0.7rem 0.9rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
      >
        <div style={{
          fontSize: '1.1rem', flexShrink: 0,
          width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}14`,
          borderRadius: 'var(--radius)',
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.84rem' }}>{label}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.05rem', lineHeight: 1.3 }}>{desc}</div>
        </div>
      </motion.div>
    </Link>
  );
}

function SectionTitle({ icon, label }) {
  return (
    <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
      <span>{icon}</span> {label}
    </h3>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { getLanguage } = useTranslation();
  const lang = getLanguage();
  const greeting = getGreeting(lang);

  if (user?.role === 'admin') return <AdminDashboard user={user} lang={lang} greeting={greeting} />;
  if (user?.role === 'counselor') return <CounselorDashboard user={user} lang={lang} greeting={greeting} />;
  return <UserDashboard user={user} lang={lang} greeting={greeting} />;
}

/* ─── USER DASHBOARD ─── */
function UserDashboard({ user, lang, greeting }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {greeting}, {user?.displayName || 'Friend'}
            <RoleBadge role="user" />
          </h1>
          <p>{lang === 'rw' ? 'Umeze ute uyu munsi?' : 'How are you doing today?'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <ActionCard to="/reflect" icon={'\u{1F4AD}'} label={lang === 'rw' ? 'Ganira' : 'Reflect'} desc={lang === 'rw' ? 'Vugana n\'umujyanama w\'ubuzima' : 'Chat with your AI guide'} color="#0D9488" />
        <ActionCard to="/mood" icon={'\u{1F60A}'} label={lang === 'rw' ? 'Ibyiyumvo' : 'Mood'} desc={lang === 'rw' ? 'Andika uko umeze' : 'Log how you feel'} color="#F97316" />
        <ActionCard to="/journal" icon={'\u{1F4DD}'} label={lang === 'rw' ? 'Inyandiko' : 'Journal'} desc={lang === 'rw' ? 'Andika ibiri ku mutima' : 'Write your thoughts'} color="#8B5CF6" />
        <ActionCard to="/healing" icon={'\u{1F33F}'} label={lang === 'rw' ? 'Kwivura' : 'Heal'} desc={lang === 'rw' ? 'Ibikoresho byo kwita kuri wowe' : 'Self-care resources'} color="#10B981" />
        <ActionCard to="/counseling" icon={'\u{1F9D1}\u200D\u{2764}\uFE0F'} label={lang === 'rw' ? 'Ubujyanama' : 'Counseling'} desc={lang === 'rw' ? 'Vugana n\'umujyanama' : 'Talk to a counselor'} color="#6366F1" />
        <ActionCard to="/communities" icon={'\u{1F46B}'} label={lang === 'rw' ? 'Imiryango' : 'Communities'} desc={lang === 'rw' ? 'Shyira hamwe n\'abandi' : 'Join support groups'} color="#EC4899" />
      </div>

      <div className="dashboard-grid">
        <MoodTracker />
        <MoodCalendar />
        <MoodInsights />
        <WeeklyReflection />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionTitle icon={'\u{1F4AC}'} label={lang === 'rw' ? 'Ganira vuba' : 'Quick Chat'} />
        <ChatCards />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionTitle icon={'\u{1F33F}'} label={lang === 'rw' ? 'Ibikoresho by\'ubuvuzi' : 'Recommended for You'} />
        <HealingResources recommendedOnly />
      </div>
    </div>
  );
}

/* ─── COUNSELOR DASHBOARD ─── */
function CounselorDashboard({ user, lang, greeting }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {greeting}, {user?.displayName || 'Counselor'}
            <RoleBadge role="counselor" />
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'rw' ? 'Murakaza neza kuri porogaramu. Hano ni ho uzitabira abantu bakeneye ubufasha.' : 'Welcome. This is where you support people in need.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <ActionCard to="/counseling" icon={'\u{1F9D1}\u200D\u{2764}\uFE0F'} label={lang === 'rw' ? 'Sessions' : 'Counseling Sessions'} desc={lang === 'rw' ? 'Reba ibibazo, ohereza ubutumwa' : 'View sessions & send messages'} color="#6366F1" />
        <ActionCard to="/communities" icon={'\u{1F46B}'} label={lang === 'rw' ? 'Imiryango' : 'Communities'} desc={lang === 'rw' ? 'Fasha mu nzego z\'abantu' : 'Engage with support groups'} color="#EC4899" />
        <ActionCard to="/healing" icon={'\u{1F33F}'} label={lang === 'rw' ? 'Ibikoresho' : 'Healing Resources'} desc={lang === 'rw' ? 'Reba ibikoresho by\'ubuvuzi' : 'Browse tools to recommend'} color="#10B981" />
        <ActionCard to="/insights" icon={'\u{1F4CA}'} label={lang === 'rw' ? 'Ibipimo' : 'Insights'} desc={lang === 'rw' ? 'Reba imikorere y\'abakoresha' : 'Track community progress'} color="#F97316" />
        <ActionCard to="/crisis" icon={'\u{1F6E1}\uFE0F'} label={lang === 'rw' ? 'Ihutirwa' : 'Crisis Support'} desc={lang === 'rw' ? 'Ibikoresho by\'ihutirwa' : 'Emergency resources'} color="#EF4444" />
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '3px solid #6366F1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '2rem' }}>{'\u{1F9D1}\u200D\u{2764}\uFE0F'}</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>
              {lang === 'rw' ? 'Uruhare rwawe nk\'umujyanama' : 'Your Role as a Counselor'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {lang === 'rw'
                ? 'Ufasha abantu gukemura ibibazo byo mu mutima, ugatanga inama, ukanabashyira mu miryango ishobora kubafasha. Koresha urubuga rwa Counseling kugirango uganire n\'abakoresha, hanyuma ubahe ibikoresho by\'ubuvuzi bibereye.'
                : 'You help people work through mental health challenges, offer guidance, and connect them with supportive communities. Use the Counseling panel to communicate with users and recommend appropriate healing resources.'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionTitle icon={'\u{1F33F}'} label={lang === 'rw' ? 'Ibikoresho by\'ubuvuzi' : 'Healing Resources'} />
        <HealingResources recommendedOnly />
      </div>
    </div>
  );
}

/* ─── ADMIN DASHBOARD ─── */
function AdminDashboard({ user, lang, greeting }) {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    adminAPI.getStats().then((r) => setStats(r.data.stats)).catch(() => {});
    adminAPI.getUsers().then((r) => setRecentUsers((r.data.users || []).slice(0, 5))).catch(() => {});
  }, []);

  const roleColors = { admin: '#EF4444', counselor: '#6366F1', user: '#0D9488' };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {greeting}, {user?.displayName || 'Admin'}
            <RoleBadge role="admin" />
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'rw' ? 'Reba incamake ya porogaramu, cunga abakoresha n\'ibikoresho.' : 'Platform overview — manage users, resources, and content.'}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '3px solid #EF4444' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '2rem' }}>{'\u{1F6E1}\uFE0F'}</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>
              {lang === 'rw' ? 'Uruhare rwawe nk\'umuyobozi' : 'Your Role as Admin'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {lang === 'rw'
                ? 'Ucunga porogaramu ya MindSpace. Ushobora kongeraho abakoresha, guhindura inshingano zabo, kugenzura ibikoresho by\'ubuvuzi, abajyanama, ibikoresho by\'ihutirwa, n\'imiryango. Reba incamake hejuru hanyuma ukoreshe interuro ya Admin Panel kugirango ukore ibyo ushaka.'
                : 'You manage the MindSpace platform. Add and manage users, change roles, oversee healing resources, counselors, crisis resources, and communities. Use the stats above and the Admin Panel for full control.'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <SectionTitle icon={'\u{1F4CA}'} label={lang === 'rw' ? 'Incamake' : 'Platform Stats'} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {stats ? (
          <>
            <StatCard icon={'\u{1F465}'} label={lang === 'rw' ? 'Abakoresha' : 'Users'} value={stats.users} color="#0D9488" />
            <StatCard icon={'\u{1F9D1}\u200D\u2695\uFE0F'} label={lang === 'rw' ? 'Abajyanama' : 'Counselors'} value={stats.counselors} color="#6366F1" />
            <StatCard icon={'\u{1F33F}'} label={lang === 'rw' ? 'Ibikoresho' : 'Healing'} value={stats.healing} color="#10B981" />
            <StatCard icon={'\u{1F6E1}\uFE0F'} label={lang === 'rw' ? 'Ihutirwa' : 'Crisis'} value={stats.crisis} color="#F59E0B" />
            <StatCard icon={'\u{1F3E0}'} label={lang === 'rw' ? 'Imiryango' : 'Communities'} value={stats.communities} color="#EC4899" />
            <StatCard icon={'\u{1F91D}'} label={lang === 'rw' ? 'Sessions' : 'Sessions'} value={stats.sessions} color="#8B5CF6" />
            <StatCard icon={'\u{1F60A}'} label={lang === 'rw' ? 'Ibyiyumvo' : 'Moods'} value={stats.moods} color="#F97316" />
          </>
        ) : (
          [1,2,3,4,5,6,7].map(i => (
            <div key={i} className="card" style={{ height: '68px', padding: '1rem 1.15rem', animation: 'pulse 1.5s infinite' }} />
          ))
        )}
      </div>

      {/* Quick Admin Actions */}
      <SectionTitle icon={'\u{2699}\uFE0F'} label={lang === 'rw' ? 'Ibikorwa byihuse' : 'Quick Admin Actions'} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <ActionCard to="/admin?tab=users" icon={'\u{1F465}'} label={lang === 'rw' ? 'Abakoresha' : 'Manage Users'} desc={lang === 'rw' ? 'Cunga konti n\'inshingano' : 'Accounts & roles'} color="#0D9488" />
        <ActionCard to="/admin?tab=healing" icon={'\u{1F33F}'} label={lang === 'rw' ? 'Ibikoresho' : 'Healing Resources'} desc={lang === 'rw' ? 'Ongeraho cyangwa hindura' : 'Add or edit'} color="#10B981" />
        <ActionCard to="/admin?tab=counselors" icon={'\u{1F9D1}\u200D\u2695\uFE0F'} label={lang === 'rw' ? 'Abajyanama' : 'Counselors'} desc={lang === 'rw' ? 'Cunga urutonde' : 'Manage list'} color="#6366F1" />
        <ActionCard to="/admin?tab=crisis" icon={'\u{1F6E1}\uFE0F'} label={lang === 'rw' ? 'Ihutirwa' : 'Crisis Resources'} desc={lang === 'rw' ? 'Reba ibikoresho' : 'View & manage'} color="#F59E0B" />
        <ActionCard to="/admin?tab=communities" icon={'\u{1F3E0}'} label={lang === 'rw' ? 'Imiryango' : 'Communities'} desc={lang === 'rw' ? 'Cunga imiryango' : 'Manage groups'} color="#EC4899" />
        <ActionCard to="/crisis" icon={'\u{1F6E1}\uFE0F'} label={lang === 'rw' ? 'Ihutirwa' : 'Crisis Support'} desc={lang === 'rw' ? 'Reba ibikoresho by\'ihutirwa' : 'View emergency resources'} color="#EF4444" />
      </div>

      {/* Recent Users */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <SectionTitle icon={'\u{1F465}'} label={lang === 'rw' ? 'Abakoresha ba vuba' : 'Recent Users'} />
        <Link to="/admin?tab=users" className="btn btn-sm" style={{ fontSize: '0.78rem' }}>
          {lang === 'rw' ? 'Reba byose \u2192' : 'View all \u2192'}
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ minWidth: '450px' }}>
            <thead>
              <tr>
                <th>{lang === 'rw' ? 'Izina' : 'Name'}</th>
                <th>{lang === 'rw' ? 'Email' : 'Email'}</th>
                <th>{lang === 'rw' ? 'Uruhare' : 'Role'}</th>
                <th>{lang === 'rw' ? 'Ururimi' : 'Lang'}</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>{lang === 'rw' ? 'Nta bakoresha' : 'No users'}</td></tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.displayName || u.anonymousId}</strong></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{u.email || '\u2014'}</td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 600,
                        background: `${roleColors[u.role] || '#6B7280'}18`, color: roleColors[u.role] || '#6B7280',
                        border: `1px solid ${roleColors[u.role] || '#6B7280'}30`,
                      }}>{u.role}</span>
                    </td>
                    <td>{u.language?.toUpperCase()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
