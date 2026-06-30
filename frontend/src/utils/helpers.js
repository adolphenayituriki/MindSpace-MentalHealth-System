export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRW(date) {
  const d = new Date(date);
  const months = [
    'Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena',
    'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getMoodColor(value) {
  const colors = {
    5: '#4CAF50',
    4: '#8BC34A',
    3: '#FFC107',
    2: '#FF9800',
    1: '#F44336',
  };
  return colors[value] || '#9E9E9E';
}

export function getMoodEmoji(value) {
  const emojis = { 5: '😊', 4: '🙂', 3: '😐', 2: '😔', 1: '😢' };
  return emojis[value] || '😐';
}

export function getGreeting(lang) {
  const hour = new Date().getHours();
  if (lang === 'rw') {
    if (hour < 12) return 'Mwaramutse neza';
    if (hour < 17) return 'Mwiriwe neza';
    return 'Mwiriwe, umugoroba mwiza';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
