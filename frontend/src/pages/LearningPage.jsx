import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FaGem, FaHandshake, FaBaby, FaLeaf, FaGraduationCap, FaBookOpen, FaPlay, FaFileAlt, FaPodcast, FaDumbbell, FaQuestionCircle, FaBook } from 'react-icons/fa';

const catIcons = { premarital: <FaGem />, couples: <FaHandshake />, parenting: <FaBaby />, grief: <FaLeaf />, retirement: <FaGraduationCap />, wellbeing: <FaLeaf /> };

export default function LearningPage() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState('browse');

  useEffect(() => {
    Promise.all([courseAPI.getAll(), courseAPI.getMine()])
      .then(([c, e]) => { setCourses(c.data.courses); setEnrollments(e.data.enrollments || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (id) => {
    try {
      const res = await courseAPI.enroll(id);
      setCourses((prev) => prev.map((c) => c._id === id ? { ...c, enrolled: true } : c));
      setEnrollments((prev) => [res.data.enrollment, ...prev]);
    } catch (_) {}
  };

  const handleProgress = async (courseId, lessonId) => {
    try {
      const res = await courseAPI.updateProgress(courseId, lessonId);
      setEnrollments((prev) => prev.map((e) => e._id === res.data.enrollment._id ? res.data.enrollment : e));
      if (active?.enrollment) setActive((prev) => ({ ...prev, enrollment: res.data.enrollment }));
    } catch (_) {}
  };

  if (loading) return <LoadingSkeleton />;

  if (active) {
    const course = active;
    const enrollment = course.enrollment;
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{course.title}</h1>
          <button className="btn btn-ghost" onClick={() => setActive(null)}>{'\u2190'} Back to Courses</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{course.description || course.subtitle}</p>
        {enrollment && (
          <div className="learning-progress-bar">
            <div className="learning-progress-fill" style={{ width: `${enrollment.progress?.percent || 0}%` }} />
            <span>{enrollment.progress?.percent || 0}% complete</span>
          </div>
        )}
        {course.modules?.map((mod, mi) => (
          <div key={mi} className="learning-module">
            <h3 className="learning-module-title">{mod.title}</h3>
            <div className="learning-lessons">
              {mod.lessons?.map((lesson, li) => {
                const isDone = enrollment?.progress?.completedLessons?.includes(lesson._id);
                const iconMap = { video: <FaPlay />, article: <FaFileAlt />, podcast: <FaPodcast />, exercise: <FaDumbbell />, quiz: <FaQuestionCircle /> };
                return (
                  <motion.div key={li} className={`learning-lesson ${isDone ? 'done' : ''}`} whileHover={{ x: 4 }}>
                    <span className="lesson-icon">{iconMap[lesson.type] || <FaBook />}</span>
                    <div className="lesson-info">
                      <strong>{lesson.title}</strong>
                      {lesson.durationMinutes && <span className="lesson-duration">{lesson.durationMinutes} min</span>}
                    </div>
                    <div className="lesson-actions">
                      {isDone ? (
                        <span className="lesson-done-badge">{'\u2713'}</span>
                      ) : enrollment && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleProgress(course._id, lesson._id)}>
                          Complete
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const display = tab === 'browse' ? courses : enrollments.filter((e) => e.course).map((e) => ({ ...e.course, enrolled: true, enrollment: e, progress: e.progress?.percent }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Learning Center</h1>
        <p>Courses and resources to support your journey</p>
      </div>
      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>Browse Courses</button>
        <button className={`tab-btn ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>My Learning</button>
      </div>
      <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {display.map((c, i) => (
          <motion.div key={c._id || i} className="feature-card course-card" whileHover={{ y: -4 }}
            onClick={() => { courseAPI.getOne(c._id).then((res) => setActive(res.data)).catch(() => setActive(c)); }}
            style={{ cursor: 'pointer' }}>
            <span className="feature-icon" style={{ fontSize: '1.6rem' }}>{catIcons[c.category] || <FaBookOpen />}</span>
            <div className="course-meta">
              <span className="course-category">{c.category}</span>
              <span className="course-level">{c.level}</span>
            </div>
            <h3>{c.title}</h3>
            <p>{c.subtitle || `${c.modules?.length || 0} modules \u00B7 ${c.estimatedHours || ''}h`}</p>
            <div className="course-footer">
              {c.enrolled ? (
                <span className="course-enrolled-badge">{'\u2713'} Enrolled</span>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); handleEnroll(c._id); }}>
                  Enroll Free
                </button>
              )}
              {c.enrollment?.progress?.percent > 0 && (
                <span className="course-progress-pct">{c.enrollment.progress.percent}%</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
