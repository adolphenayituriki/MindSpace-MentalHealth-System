import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindspace_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mindspace_token');
      localStorage.removeItem('mindspace_user');
    }
    return Promise.reject(err);
  }
);

async function callApi(apiCall) {
  return await apiCall();
}

export const authAPI = {
  anonymous: (language) => callApi(() => api.post('/auth/anonymous', { language })),
  register: (data) => callApi(() => api.post('/auth/register', data)),
  login: (data) => callApi(() => api.post('/auth/login', data)),
  profile: () => callApi(() => api.get('/auth/profile')),
  updateProfile: (data) => callApi(() => api.patch('/auth/profile', data)),
};

export const moodAPI = {
  log: (data) => callApi(() => api.post('/moods', data)),
  getAll: (days) => callApi(() => api.get(`/moods?days=${days || 30}`)),
  getToday: () => callApi(() => api.get('/moods/today')),
  getInsights: () => callApi(() => api.get('/moods/insights')),
};

export const journalAPI = {
  create: (data) => callApi(() => api.post('/journals', data)),
  getAll: (page) => callApi(() => api.get(`/journals?page=${page || 1}`)),
  getOne: (id) => callApi(() => api.get(`/journals/${id}`)),
  update: (id, data) => callApi(() => api.patch(`/journals/${id}`, data)),
  delete: (id) => callApi(() => api.delete(`/journals/${id}`)),
  getPrompts: (lang) => callApi(() => api.get('/journals/prompts', { params: { lang } })),
};

export const communityAPI = {
  getAll: () => callApi(() => api.get('/communities')),
  getMine: () => callApi(() => api.get('/communities/mine')),
  getOne: (id) => callApi(() => api.get(`/communities/${id}`)),
  join: (id) => callApi(() => api.post(`/communities/${id}/join`)),
  leave: (id) => callApi(() => api.post(`/communities/${id}/leave`)),
  getMessages: (id) => callApi(() => api.get(`/communities/${id}/messages`)),
  postMessage: (id, content) => callApi(() => api.post(`/communities/${id}/messages`, { content })),
  create: (data) => callApi(() => api.post('/communities', data)),
};

export const counselingAPI = {
  getCounselors: () => callApi(() => api.get('/counseling/counselors')),
  getActiveSession: () => callApi(() => api.get('/counseling/sessions/active')),
  requestSession: (data) => callApi(() => api.post('/counseling/sessions', data)),
  getSessionMessages: (sessionId) => callApi(() => api.get(`/counseling/sessions/${sessionId}/messages`)),
  sendMessage: (sessionId, content) =>
    callApi(() => api.post(`/counseling/sessions/${sessionId}/messages`, { content })),
  closeSession: (sessionId) => callApi(() => api.post(`/counseling/sessions/${sessionId}/close`)),
};

export const crisisAPI = {
  getResources: () => callApi(() => api.get('/crisis/resources')),
  getHotlines: () => callApi(() => api.get('/crisis/hotlines')),
  getCenters: () => callApi(() => api.get('/crisis/centers')),
};

export const healingAPI = {
  getAll: (params) => callApi(() => api.get('/healing', { params })),
  getRecommended: () => callApi(() => api.get('/healing/recommended')),
  getByType: (type) => callApi(() => api.get(`/healing/type/${type}`)),
};

export const insightsAPI = {
  getWeekly: () => callApi(() => api.get('/insights/weekly')),
  getMonthly: () => callApi(() => api.get('/insights/monthly')),
  getStreak: () => callApi(() => api.get('/insights/streak')),
};

export const chatAPI = {
  send: (content) => callApi(() => api.post('/chat', { content })),
  getHistory: () => callApi(() => api.get('/chat/history')),
  clear: () => callApi(() => api.delete('/chat/history')),
};

export const adminAPI = {
  getStats: () => callApi(() => api.get('/admin/stats')),
  getUsers: () => callApi(() => api.get('/admin/users')),
  updateUserRole: (userId, role) => callApi(() => api.patch(`/admin/users/${userId}/role`, { role })),
  deleteUser: (userId) => callApi(() => api.delete(`/admin/users/${userId}`)),
  createHealingResource: (data) => callApi(() => api.post('/admin/healing', data)),
  updateHealingResource: (id, data) => callApi(() => api.put(`/admin/healing/${id}`, data)),
  deleteHealingResource: (id) => callApi(() => api.delete(`/admin/healing/${id}`)),
  createCounselor: (data) => callApi(() => api.post('/admin/counselors', data)),
  updateCounselor: (id, data) => callApi(() => api.put(`/admin/counselors/${id}`, data)),
  deleteCounselor: (id) => callApi(() => api.delete(`/admin/counselors/${id}`)),
  createCrisisResource: (data) => callApi(() => api.post('/admin/crisis', data)),
  updateCrisisResource: (id, data) => callApi(() => api.put(`/admin/crisis/${id}`, data)),
  deleteCrisisResource: (id) => callApi(() => api.delete(`/admin/crisis/${id}`)),
  createCommunity: (data) => callApi(() => api.post('/admin/communities', data)),
  updateCommunity: (id, data) => callApi(() => api.put(`/admin/communities/${id}`, data)),
  deleteCommunity: (id) => callApi(() => api.delete(`/admin/communities/${id}`)),
};

export const assessmentAPI = {
  getAll: () => callApi(() => api.get('/assessments')),
  getOne: (id) => callApi(() => api.get(`/assessments/${id}`)),
  submit: (id, answers) => callApi(() => api.post(`/assessments/${id}/submit`, { answers })),
  getResults: () => callApi(() => api.get('/assessments/results')),
};

export const courseAPI = {
  getAll: () => callApi(() => api.get('/courses')),
  getMine: () => callApi(() => api.get('/courses/mine')),
  getOne: (id) => callApi(() => api.get(`/courses/${id}`)),
  enroll: (id) => callApi(() => api.post(`/courses/${id}/enroll`)),
  updateProgress: (id, lessonId) => callApi(() => api.post(`/courses/${id}/progress`, { lessonId })),
};

export const bookingAPI = {
  getAll: () => callApi(() => api.get('/bookings')),
  create: (data) => callApi(() => api.post('/bookings', data)),
  cancel: (id) => callApi(() => api.patch(`/bookings/${id}/cancel`)),
  getCounselorBookings: () => callApi(() => api.get('/bookings/counselor')),
  confirm: (id) => callApi(() => api.patch(`/bookings/${id}/confirm`)),
  getAvailability: (counselorId) => callApi(() => api.get(`/bookings/availability/${counselorId}`)),
};

export default api;
