const express = require('express');
const cors = require('cors');
const http = require('http');
const { execSync } = require('child_process');
const connectDB = require('./config/db');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const journalRoutes = require('./routes/journal');
const chatRoutes = require('./routes/chat');
const communityRoutes = require('./routes/communities');
const counselingRoutes = require('./routes/counseling');
const crisisRoutes = require('./routes/crisis');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/insights', require('./routes/insights'));
app.use('/api/healing', require('./routes/healing'));
app.use('/api/admin', require('./routes/admin'));

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

function startServer(port) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, attempting to free it...`);
        try {
          const cmd = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -ti:${port}`;
          const output = execSync(cmd, { encoding: 'utf8', timeout: 3000 });
          const lines = output.trim().split('\n').filter(Boolean);
          let pid = null;
          if (process.platform === 'win32') {
            for (const line of lines) {
              const parts = line.trim().split(/\s+/);
              if (parts.length >= 5 && parts[1] === `${port}`) {
                pid = parts[parts.length - 1];
                break;
              }
            }
          } else {
            pid = lines[0].trim();
          }
          if (pid) {
            process.kill(parseInt(pid), 'SIGTERM');
            console.log(`Killed process ${pid} on port ${port}`);
            setTimeout(() => {
              server.removeAllListeners('error');
              server.listen(port, () => {
                console.log(`MindSpace API running on port ${port}`);
                resolve();
              });
            }, 1000);
            return;
          }
        } catch (_) {}
        console.log(`Could not free port ${port}, trying port ${port + 1}...`);
        server.removeAllListeners('error');
        startServer(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
    server.listen(port, () => {
      console.log(`MindSpace API running on port ${port}`);
      resolve();
    });
  });
}

connectDB().then(() => startServer(config.port)).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

module.exports = { app, server };
