# 🧠 MindSpace

> **Your mind deserves care** — An AI-powered mental health companion built for Rwanda, in Kinyarwanda and English, free and anonymous by default.

**Team:** Mugabo Hussein & Nayituriki Adolphe  
**Institution:** ICT Chamber  
**Date:** 29th May 2026  
**Contact:** 0785324625

---

## The Problem

| Stat | Detail |
|------|--------|
| **18.6%** | of Rwandans face a mental health condition |
| **52%+** | among genocide survivors |
| **27.4%** | of youth deeply impacted by trauma |
| **~18** | psychiatrists for 14M+ Rwandans |
| **95%** | of youth never step into a clinic |

**Key barriers:** Access gap, affordability, stigma, no cultural fit.

---

## What MindSpace Does

MindSpace provides a **complete support ladder** with six core features:

1. **AI Companion** — 24/7 emotionally intelligent chat in Kinyarwanda & English with crisis detection
2. **Guided Journaling** — Culturally relevant prompts with AI reflections
3. **Peer Communities** — Anonymous topic communities (Anxiety, Grief, PTSD, Burnout) moderated by counselors
4. **Mood Insights** — Daily mood tracking with weekly AI-powered reflections
5. **Async Counseling** — Message licensed counselors with no booking required
6. **Crisis Resources** — Verified local Rwandan NGOs, health centers, and tap-to-call hotlines

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io (ready for future real-time features)
- **Auth:** JWT with anonymous OR email-based login
- **i18n:** Built-in Kinyarwanda & English support

---

## Project Structure

```
mindspace-app/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/            # DB connection & app config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routers
│   │   ├── services/          # Business logic (AI, insights)
│   │   ├── utils/             # Helpers & constants
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI components by feature
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── communities/
│   │   │   ├── counseling/
│   │   │   ├── crisis/
│   │   │   ├── insights/
│   │   │   ├── journal/
│   │   │   ├── mood/
│   │   │   └── onboarding/
│   │   ├── contexts/          # React contexts (Auth, Theme)
│   │   ├── hooks/             # Custom hooks
│   │   ├── i18n/              # Translation files (en, rw)
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API client
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx, App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md
└── package.json               # Root workspace scripts
```

---

## Flow / User Journey

```
1. Open App → Language Select (Kinyarwanda / English)
2. Auth → Anonymous (default) OR Email registration
3. Quick Onboard → 3 questions set AI tone & suggest communities
4. Dashboard → Daily mood check-in, calendar, insights
5. Core Loop:
   ├── 🤖 Chat with AI companion
   ├── 📝 Journal with prompts
   ├── 👥 Join peer communities
   └── 📊 Review mood insights
6. Escalation Path:
   AI → Peer Community → Async Counselor → Crisis Resources
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/anonymous` | Anonymous login |
| POST | `/api/auth/register` | Email registration |
| POST | `/api/auth/login` | Email login |
| GET | `/api/auth/profile` | Get user profile |
| PATCH | `/api/auth/profile` | Update profile |
| POST | `/api/moods` | Log today's mood |
| GET | `/api/moods` | Get mood history |
| GET | `/api/moods/today` | Get today's mood |
| GET | `/api/moods/insights` | Get mood insights |
| GET/POST | `/api/journals` | CRUD journal entries |
| GET | `/api/journals/prompts` | Get writing prompts |
| POST | `/api/chat` | Send AI chat message |
| GET | `/api/chat/history` | Get chat history |
| GET/POST | `/api/communities` | Community CRUD |
| POST | `/api/communities/:id/join` | Join community |
| POST | `/api/communities/:id/messages` | Post to community |
| GET | `/api/counseling/counselors` | List counselors |
| POST | `/api/counseling/sessions` | Request session |
| GET | `/api/crisis/resources` | Crisis resources |
| GET | `/api/insights/weekly` | Weekly AI reflection |

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** v6+ (local or Atlas)
- **npm** v9+

### 1. Clone & Install

```bash
git clone <repo-url>
cd mindspace-app

# Install root dependencies
npm install

# Install backend & frontend dependencies
npm run install:all
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindspace
JWT_SECRET=your_secure_random_secret
NODE_ENV=development
```

### 3. Seed the Database (Optional)

```bash
npm run seed
```

This populates sample communities, counselors, and crisis resources.

### 4. Run the App

```bash
# From root — runs both backend & frontend concurrently
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend
npm run dev:backend    # http://localhost:5000

# Terminal 2: Frontend
npm run dev:frontend   # http://localhost:3000
```

### 5. Build for Production

```bash
npm run build:frontend
npm run start:backend  # Serves API + static frontend
```

---

## Database Models

| Model | Description |
|-------|-------------|
| `User` | Anonymous or email-authenticated users |
| `Mood` | Daily mood logs with value (1–5) and notes |
| `Journal` | Journal entries with prompts and mood |
| `Community` | Peer support topic communities |
| `Message` | Chat, community, and counseling messages |
| `Counselor` | Licensed counselor profiles |
| `CounselingSession` | Async counseling sessions |
| `CrisisResource` | Verified NGOs, health centers, hotlines |

---

## Key Features Detail

### AI Companion
- Responds in Kinyarwanda or English based on user preference
- Crisis keyword detection triggers resource suggestions
- Contextual responses based on user's emotional state

### Mood Tracking
- 5-point scale with culturally relevant labels
- Visual calendar (30-day view)
- Streak tracking to encourage consistency
- Weekly AI-generated insights

### Peer Communities
- Anonymous participation by default
- Topics: Anxiety, Depression, Grief, PTSD, Burnout, Relationships, Trauma, Stress
- Counselor-moderated for safety

### Async Counseling
- No booking — request a session instantly
- Auto-assigned to available licensed counselors
- Session management with status tracking

---

## Sustainability Model

- **Core app:** Always free — no paywall for support
- **Revenue:** Institutional subscriptions, counselor listing fees, anonymized data insights, premium features
- **Growth:** Partnerships with schools, NGOs, and government

---

## License

Built by Rwandans · For Rwandans · In the languages Rwanda speaks

© 2026 Mugabo Hussein & Nayituriki Adolphe — ICT Chamber
