# Technical Specifications Supplement

Supplementary sections for the *Digital Platform for Marital, Family Support, and Life Transition Preparation* specification.

---

## 13. Crisis & Safety Protocol

### 13.1 Crisis Keyword Detection
Automated scanning of chat, forum posts, and assessment free-text for crisis indicators (suicide, self-harm, abuse, violence). On match:

| Trigger | Action |
|---------|--------|
| Suicidal ideation detected | Full-screen emergency popup with hotlines + mandatory 30-second pause before continuing |
| Abuse/domestic violence | Redirect to crisis resources + optional anonymous report to moderator |
| Child safety concern | Escalate to admin with mandatory reporting workflow |

### 13.2 Emergency Resources Display
- Persistent SOS button in all screens (bottom-right float)
- Hotline numbers: 3002 (Crisis), 112 (Emergency), 116 (Child Helpline)
- One-tap dial for mobile
- Location-aware nearest health center lookup (optional)

### 13.3 Counselor Safety
- Counselors can terminate a session if user is a danger to themselves or others
- Incident report form with automatic log preservation
- Peer counselor check-in after flagged sessions

### 13.4 Data Retention for Crisis Events
- Crisis-flagged conversations retained minimum 3 years
- Accessible only to platform safety team + legal
- User notified of retention upon flagging

---

## 14. Offline & Low Connectivity Mode

### 14.1 Offline-First Architecture

| Component | Offline Behavior |
|-----------|-----------------|
| Learning modules | Full download of videos, articles, podcasts. Progress synced on reconnect |
| Self-assessments | Completed locally, queued for sync. Results not lost on disconnect |
| Chat messages | Queued with delivery receipt. Undelivered after 7 days → SMS fallback |
| Community posts | Draft saved locally. Posted on reconnect |
| Profile edits | Applied locally, synced when online |

### 14.2 Bandwidth Optimization
- Adaptive bitrate for video streaming (240p–720p)
- Image lazy loading with blur placeholder
- API payload compression (gzip/brotli)
- GraphQL field selection to minimize overfetching

### 14.3 Connectivity Detection
- `navigator.onLine` listener with visual banner ("You're offline — changes will sync when connected")
- Sync progress indicator
- Conflict resolution: last-write-wins with undo notification

---

## 15. AI-Powered Features

### 15.1 AI Triage Chatbot (Phase 1)
Pre-booking assistant that:
- Asks intake questions (mood, urgency, topic)
- Suggests relevant self-assessment tests
- Recommends a counselor specialization
- Escalates to human if crisis keywords detected
- Available 24/7 with anonymous session

### 15.2 Personalized Recommendations (Phase 2)
- Course suggestions based on assessment results + past completions
- Counselor matching algorithm (specialty × availability × language × rating)
- Journal prompt generation based on user's stated concerns
- Community group suggestions (e.g., "Widowed Support" for grieving users)

### 15.3 Sentiment & Pattern Analysis (Phase 3)
- Weekly mood trend summary from journal entries
- Alert if sentiment drops below threshold for 3+ days
- Aggregate anonymized trends for platform insights (admin dashboard)

### 15.4 AI Ethics
- All AI interactions labeled ("This is an AI assistant")
- User can opt out of AI recommendations
- Human review of any AI-generated content before publication
- No sole automated decision-making for counselor assignments or pricing

---

## 16. Data Privacy & Compliance

### 16.1 Regulatory Framework
- Rwanda Law N° 058/2021 on data protection and privacy
- East African Community data protection guidelines
- GDPR compliance for any EU user (if applicable)

### 16.2 Data Classification

| Category | Examples | Retention |
|----------|----------|-----------|
| Essential | Name, email, age, relationship status | Duration of account + 12 months |
| Sensitive | Chat transcripts, assessment results, counselor notes | 3 years after last activity |
| Crisis-flagged | Sessions with crisis detection | 5 years (legal hold) |
| Payment | Transaction IDs, invoices | 7 years (tax compliance) |

### 16.3 User Rights
- Right to access: download all personal data as JSON/CSV
- Right to deletion: "Delete my account" with 30-day grace period
- Right to rectification: edit profile and assessment history
- Right to portability: export chat history, course completions
- Right to withdraw consent: opt out of AI analysis at any time

### 16.4 Counselor Confidentiality
- Counselors sign digital confidentiality agreement on onboarding
- Session recordings require explicit dual consent
- Breach notification to affected user within 72 hours
- Anonymous case studies require explicit opt-in from user

### 16.5 Security Measures
- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Passwords hashed with bcrypt (cost factor 12)
- JWT with refresh token rotation (7-day access, 30-day refresh)
- Rate limiting: 5 login attempts/min, 100 API requests/min per user
- Audit log for all admin/data access

---

## 17. Community Moderation & Safety

### 17.1 Automated Moderation
- Profanity filter (Kinyarwanda, English, French) with context awareness
- Hate speech detection using keyword + embedding model
- Spam detection (repeated posts, link flooding)
- Auto-hold: flagged content hidden until moderator review

### 17.2 User Reporting
- Report button on every post, comment, and profile
- Report reasons: Harassment, Spam, Hate speech, Crisis concern, Other
- Reporter remains anonymous to the reported user
- Status tracking: "Report received → Under review → Action taken"

### 17.3 Moderator Workflow
- Queue view: pending items sorted by severity (crisis > hate speech > spam)
- Actions: Approve, Reject, Warn user, Suspend user (1/7/30 days/permanent)
- Appeal process: user can appeal within 7 days → senior moderator review
- Moderator notes field for internal reference

### 17.4 Community Guidelines
- Displayed on registration with acknowledgment checkbox
- Abridged version pinned in every forum
- Updated via admin with 14-day notice to users

---

## 18. Monitoring, Logging & Alerts

### 18.1 Application Performance Monitoring
- Error tracking: Sentry or Datadog RUM
- API latency: p50 < 200ms, p95 < 500ms, p99 < 1000ms
- Uptime monitoring: 99.5% SLA with 15-minute alert if breached

### 18.2 Server & Infrastructure Monitoring
| Metric | Threshold | Alert |
|--------|-----------|-------|
| CPU usage | > 80% for 5 min | Slack + Email |
| Memory usage | > 85% | Slack |
| Disk I/O | > 90% capacity | PagerDuty |
| 5xx errors | > 1% of requests | Slack + Email |
| SSL cert expiry | < 14 days | Daily email |

### 18.3 Business Monitoring
- Daily active users (DAU)
- Counselor booking completion rate
- Course enrollment vs completion rate
- Subscription conversion funnel
- Churn rate (weekly)

### 18.4 Logging
- Structured JSON logs (correlation ID per request)
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Log retention: 30 days hot storage, 12 months cold
- No PII in log payloads (scoped IDs only)

---

## 19. Testing Strategy

### 19.1 Unit Tests
- Framework: Jest (Node.js) or pytest (Python)
- Coverage target: ≥ 80% branches, ≥ 90% lines
- Required for: all API endpoints, utility functions, model validations
- Run on every PR in CI pipeline

### 19.2 Integration Tests
- All API endpoints tested against a real test database
- Payment gateway sandbox integration tested weekly
- Chat/notification delivery verified end-to-end
- Auth flow (register → verify → login → refresh → logout)

### 19.3 End-to-End Tests
- Cypress (web) + Detox (mobile)
- Critical paths:
  1. Registration → Onboarding → Book first session
  2. Browse catalog → Enroll → Complete lesson → Get certificate
  3. Take assessment → Receive recommendation → Message counselor
  4. Subscribe → Access premium content → Cancel
- Run nightly on staging environment

### 19.4 Load Testing
- Tool: k6 or Artillery
- Targets:
  - 500 concurrent users with 10s ramp-up
  - Peak: 50 requests/second sustained for 5 minutes
  - Booking endpoint: < 2s p95 under load
- Run monthly and after every major deployment

### 19.5 Security Testing
- OWASP Top 10 scan (quarterly)
- Dependency vulnerability scan (weekly, automated)
- Penetration test (annual, third-party)
- Rate limit and brute-force resistance tests

---

## 20. CI/CD & DevOps

### 20.1 Pipeline Stages

| Stage | Tool | Trigger |
|-------|------|---------|
| Lint | ESLint / Ruff | Every push |
| Unit tests | Jest / pytest | Every push |
| Integration tests | Jest / pytest | PR to main |
| Build | Docker | PR to main |
| E2E tests | Cypress | Deploy to staging |
| Security scan | Snyk / Trivy | Weekly |
| Deploy staging | GitHub Actions | Merge to main |
| Deploy production | GitHub Actions | Tagged release |

### 20.2 Environments
| Environment | URL | DB | Data |
|-------------|-----|----|------|
| Development | `localhost:3000` | Local SQLite | Mock |
| Staging | `staging.platform.rw` | Staging Postgres | Anonymized |
| Production | `platform.rw` | Production Postgres | Live |

### 20.3 Infrastructure as Code
- Terraform or Pulumi for cloud resources
- Kubernetes manifests (or Docker Compose for MVP)
- Secrets managed via vault (HashiCorp Vault / AWS Secrets Manager)
- Zero-downtime deployment (rolling update)

### 20.4 Rollback Strategy
- Automated rollback if health check fails for 3 consecutive deployments
- Database migrations versioned and reversible
- Feature flags for gradual rollout of new features
- Canary releases for critical changes (10% → 50% → 100%)

---

## 21. Accessibility (WCAG 2.1 AA)

### 21.1 Compliance Targets
- WCAG 2.1 Level AA minimum (AAA preferred for non-text content)
- Screened with axe DevTools on every build

### 21.2 Key Requirements
| Principle | Requirement | Implementation |
|-----------|-------------|----------------|
| Perceivable | Text alternatives for all non-text content | `alt` on images, `aria-label` on icons |
| Perceivable | Captions for all video content | Burned-in or separate SRT |
| Operable | Full keyboard navigation | Tab order, focus indicators, skip links |
| Operable | No seizure-inducing content | No auto-playing media with >3 flashes/sec |
| Understandable | Consistent navigation | Same layout across authenticated pages |
| Understandable | Error identification | Inline validation with clear messages |
| Robust | Screen reader compatible | Semantic HTML, ARIA roles, live regions |

### 21.3 Specific Features
- Assessment questions support screen reader announcement
- Chat interface: focus management on new messages
- Video player: keyboard shortcuts (space = play/pause)
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Text can be resized to 200% without loss of functionality

---

## 22. Rating & Review System

### 22.1 Counselor Reviews
- Rating: 1–5 stars with mandatory comment (min 20 chars)
- Verified badge only for users who completed a session with that counselor
- Counselor can respond to reviews (one response per review)
- Reviews auto-published unless flagged for moderation

### 22.2 Course Reviews
- Rating: 1–5 stars + optional comment
- Completion badge: only users who completed ≥ 80% of course can review
- Helpful/unhelpful voting on reviews

### 22.3 Display Rules
- Average rating shown to 1 decimal place
- Total review count shown
- Reviews sorted: most recent first, highest rated filterable
- Counselors/courses with < 5 reviews show "New" badge instead of average

### 22.4 Abuse Prevention
- One review per user per counselor/course
- Review edited within 24 hours, deleted within 7 days
- Pattern detection: bulk 1-star reviews from same IP flagged
- Reporting reviews uses same community moderation pipeline

---

## 23. Onboarding & User Journey

### 23.1 Registration Flow
```
Land → Sign up (email/Google/Apple)
  → Welcome questionnaire (5 questions)
      1. What brings you here? (single select: pre-marital / married / difficulty / widowed / caring for elderly / retirement)
      2. Age range (18-25 / 26-35 / 36-45 / 46-60 / 60+)
      3. Immediate need (single select: find counselor / take course / join community / not sure)
      4. Preferred language (English / Kinyarwanda / French)
      5. How urgent? (Today / This week / Just exploring)
  → Recommended path (personalized dashboard)
  → Free trial starts (7 days with full access)
```

### 23.2 Conversion Funnel
| Step | Metric | Target |
|------|--------|--------|
| Signed up | Registration count | — |
| Completed onboarding | % completion | > 85% |
| Booked first session | % of completed onboarding | > 30% |
| Attended first session | % of booked | > 80% |
| Still active after 30 days | % of signed up | > 40% |
| Converted to paid | % after trial ends | > 15% |

### 23.3 Dropoff Recovery
- Abandoned registration: email reminder after 1 hour with incentive
- Onboarding incomplete: push notification after 24h ("Finish setting up your path")
- No booking after 7 days: counselor introduction email with photo + bio
- Missed session: SMS + email 1 hour before, reschedule link
- Trial ending: email at day 5 and day 7 with discount offer

### 23.4 First-Time User Experience
- Dashboard shows single CTA: "Take your first step"
- Guided tour (3 tooltips): Navigation → Courses → Counselor
- Empty states show encouragement + suggested action
- Achievement unlocked: first profile picture, first assessment, first session

---

## 24. API Contract

### 24.1 Protocol
- RESTful JSON API over HTTPS
- Base URL: `https://api.platform.rw/v1`
- Authentication: Bearer JWT in `Authorization` header

### 24.2 Rate Limiting
| Scope | Limit | Window |
|-------|-------|--------|
| Unauthenticated | 30 requests | 1 minute |
| Authenticated | 100 requests | 1 minute |
| Booking endpoint | 10 requests | 1 minute |
| Chat send | 60 messages | 1 minute |

### 24.3 Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/refresh` | Refresh JWT |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| DELETE | `/profile` | Delete account |
| GET | `/courses` | List courses |
| GET | `/courses/:id` | Course detail with modules |
| POST | `/courses/:id/enroll` | Enroll in course |
| GET | `/courses/:id/progress` | User progress |
| GET | `/counselors` | List counselors (filterable) |
| GET | `/counselors/:id` | Counselor detail + availability |
| POST | `/bookings` | Create booking |
| GET | `/bookings` | User booking list |
| DELETE | `/bookings/:id` | Cancel booking |
| POST | `/chat/:sessionId/message` | Send message |
| GET | `/chat/:sessionId` | Get chat history |
| POST | `/assessments/:id/submit` | Submit assessment |
| GET | `/assessments/results` | Assessment history |
| GET | `/community/posts` | Forum posts (paginated) |
| POST | `/community/posts` | Create post |
| POST | `/community/posts/:id/comments` | Add comment |
| POST | `/payments/subscribe` | Start subscription |
| GET | `/payments/history` | Payment history |
| GET | `/admin/users` | List users (admin only) |
| GET | `/admin/analytics` | Platform stats |

### 24.4 Error Format
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 47 seconds.",
    "retryAfter": 47
  }
}
```

### 24.5 Webhooks
| Event | Payload | Destination |
|-------|---------|-------------|
| `booking.confirmed` | User ID, counselor ID, time | User notification |
| `payment.failed` | User ID, subscription ID | Billing retry |
| `crisis.detected` | Anonymized session ID | Safety team |
| `review.flagged` | Review ID, reason | Moderation queue |

---

## 25. Data Backup & Disaster Recovery

### 25.1 Backup Schedule
| Data | Frequency | Type | Retention |
|------|-----------|------|-----------|
| User accounts | Daily | Full | 30 days |
| Chat messages | Continuous | Incremental (15 min) | 7 days |
| Course content | Weekly | Full | 3 months |
| Payment records | Daily | Full | 7 years |
| Database | Daily | Snapshot | 30 days + monthly archive |

### 25.2 Recovery Targets
- Recovery Point Objective (RPO): 15 minutes for chat, 24 hours for other data
- Recovery Time Objective (RTO): 4 hours for full platform restore
- Critical path (auth + chat): 1 hour

### 25.3 Disaster Recovery Plan
1. **Detection**: Automated health check failure → PagerDuty alert
2. **Assessment**: Engineer on-call determines severity (partial / full outage)
3. **Failover**: DNS switch to secondary region (target: 10 min)
4. **Restore**: Latest clean snapshot → staging → validate → promote
5. **Communication**: Status page update every 30 minutes
6. **Post-mortem**: Root cause analysis within 72 hours

### 25.4 Cross-Region Replication
- Primary region: `eu-west-1` (Frankfurt, low latency for Africa)
- Secondary region: `eu-west-2` (London, standby)
- Database replicas: Multi-AZ with synchronous commit
- File storage: Cross-region replication enabled for media

---

## 26. Service-Level Objectives (SLOs)

| Service | Metric | Target |
|---------|--------|--------|
| API availability | Uptime | 99.5% (≈ 3.65 days downtime/year max) |
| API latency | p95 response time | < 500ms |
| Web app load | Time to Interactive | < 3s on 3G |
| Mobile app cold start | Launch to usable | < 2s |
| Chat delivery | Message delivered | < 1s p95 |
| Video streaming | Start playback | < 3s p95 |
| Search results | Query response | < 800ms p95 |
| Payment processing | Confirmation | < 5s |
| Notification delivery | Push/SMS/Email | < 30s p95 |
| Backup recovery | Full restore | < 4 hours |

---

## 27. Glossary

| Term | Definition |
|------|------------|
| AAC | Augmentative and Alternative Communication (accessibility) |
| AES-256 | Advanced Encryption Standard with 256-bit key |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration / Continuous Deployment |
| DAU | Daily Active Users |
| GDPR | General Data Protection Regulation (EU) |
| JWT | JSON Web Token |
| Multi-AZ | Multiple Availability Zones (AWS) |
| PII | Personally Identifiable Information |
| p50 / p95 / p99 | 50th / 95th / 99th percentile latency |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SLO | Service-Level Objective |
| TLS | Transport Layer Security |
| WCAG | Web Content Accessibility Guidelines |
