# Problem 6: Live Scoreboard API Module Specification

## 📋 Overview

This document specifies the design and implementation requirements for a **Live Scoreboard API Module** that provides real-time score updates with robust security measures to prevent malicious score manipulation.

## 🎯 Business Requirements

1. **Real-time Scoreboard**: Display top 10 users with live score updates
2. **User Actions**: Users complete actions that increase their scores
3. **Live Updates**: Scoreboard updates in real-time when scores change
4. **Security**: Prevent unauthorized score manipulation and fraudulent activities
5. **Performance**: Handle concurrent users and high-frequency updates efficiently

## 🏗️ System Architecture

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Score Service │
│   (Website)     │◄──►│   (Auth Layer)   │◄──►│   (Core Logic)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  WebSocket      │    │  Rate Limiting   │    │   Database      │
│  (Live Updates) │    │  & Validation    │    │   (Scores)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📡 API Endpoints Specification

### 1. Score Update Endpoint

**POST** `/api/v1/scores/update`

Updates user score after completing an action with security validation.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Action-Token: <action_verification_token>
X-Request-ID: <unique_request_id>
```

**Request Body:**
```json
{
  "userId": "string",
  "actionType": "string",
  "scoreIncrement": "number",
  "actionMetadata": {
    "timestamp": "ISO8601",
    "sessionId": "string",
    "actionHash": "string",
    "clientFingerprint": "string"
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "newScore": 1250,
    "previousScore": 1200,
    "scoreIncrement": 50,
    "updatedAt": "2024-10-29T10:30:00Z"
  },
  "message": "Score updated successfully"
}
```

**Response (Error - 400/401/429):**
```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many score updates. Please wait before trying again.",
  "retryAfter": 60
}
```

### 2. Scoreboard Retrieval Endpoint

**GET** `/api/v1/scoreboard/top`

Retrieves the current top 10 users for scoreboard display.

**Query Parameters:**
```
?limit=10&includeRank=true&cacheControl=no-cache
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "scoreboard": [
      {
        "rank": 1,
        "userId": "user123",
        "username": "PlayerOne",
        "score": 2500,
        "avatar": "https://cdn.example.com/avatars/user123.jpg",
        "lastUpdated": "2024-10-29T10:25:00Z"
      }
    ],
    "totalUsers": 15420,
    "lastRefresh": "2024-10-29T10:30:00Z"
  }
}
```

### 3. WebSocket Connection for Live Updates

**WebSocket** `/ws/scoreboard`

Provides real-time scoreboard updates to connected clients.

**Connection Parameters:**
```
?token=<jwt_token>&clientId=<unique_client_id>
```

**Message Types:**

**Scoreboard Update:**
```json
{
  "type": "SCOREBOARD_UPDATE",
  "data": {
    "updatedRankings": [
      {
        "rank": 1,
        "userId": "user123",
        "username": "PlayerOne",
        "score": 2550,
        "previousRank": 2
      }
    ],
    "timestamp": "2024-10-29T10:30:00Z"
  }
}
```

**User Score Update:**
```json
{
  "type": "USER_SCORE_UPDATE",
  "data": {
    "userId": "user123",
    "newScore": 2550,
    "scoreIncrement": 50,
    "newRank": 1,
    "previousRank": 2
  }
}
```

## 🔒 Security & Anti-Fraud Measures

### 1. Authentication & Authorization

```typescript
interface SecurityConfig {
  jwtSecret: string;
  tokenExpiry: number;
  refreshTokenExpiry: number;
  actionTokenExpiry: number; // Short-lived action tokens
}
```

**Implementation Requirements:**
- JWT-based authentication for all score update requests
- Short-lived action tokens (30 seconds) to verify legitimate actions
- User session validation with device fingerprinting
- IP-based rate limiting per user

### 2. Rate Limiting & Validation

```typescript
interface RateLimitConfig {
  maxScoreUpdatesPerMinute: 10;
  maxScoreUpdatesPerHour: 100;
  maxScoreIncrementPerAction: 100;
  suspiciousActivityThreshold: 5;
}
```

**Anti-Fraud Rules:**
- Maximum score updates per time window (burst protection)
- Score increment validation based on action type
- Behavioral analysis for suspicious patterns
- Request deduplication using unique request IDs

### 3. Action Verification System

```typescript
interface ActionVerification {
  actionHash: string;        // Cryptographic hash of action data
  serverTimestamp: number;   // Server-side action completion time
  clientTimestamp: number;   // Client-side action completion time
  timeDriftTolerance: number; // Acceptable time difference (5 seconds)
  actionDifficulty: number;   // Expected minimum time to complete action
}
```

**Verification Process:**
1. Client completes action and generates action hash
2. Server validates action legitimacy and timing
3. Score increment is authorized only after successful verification
4. Suspicious activities are logged and flagged

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  current_score BIGINT DEFAULT 0,
  total_actions_completed INTEGER DEFAULT 0,
  last_score_update TIMESTAMP WITH TIME ZONE,
  account_status ENUM('active', 'suspended', 'banned') DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_score ON users(current_score DESC);
CREATE INDEX idx_users_last_update ON users(last_score_update);
```

### Score History Table
```sql
CREATE TABLE score_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  score_increment INTEGER NOT NULL,
  previous_score BIGINT NOT NULL,
  new_score BIGINT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  action_metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_score_history_user_time ON score_history(user_id, created_at);
CREATE INDEX idx_score_history_action_type ON score_history(action_type);
```

### Rate Limiting Table
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_rate_limits_user_endpoint_window 
ON rate_limits(user_id, endpoint, window_start);
```

## 🔄 System Flow Diagram

```mermaid
sequenceDiagram
    participant U as User/Frontend
    participant G as API Gateway
    participant A as Auth Service
    participant S as Score Service
    participant D as Database
    participant W as WebSocket Service
    participant C as Cache (Redis)

    Note over U,C: User Action Flow
    U->>G: 1. Complete Action (POST /scores/update)
    G->>A: 2. Validate JWT & Action Token
    A-->>G: 3. Authentication Result
    
    alt Authentication Success
        G->>S: 4. Process Score Update
        S->>S: 5. Validate Action & Rate Limits
        
        alt Validation Success
            S->>D: 6. Update User Score
            S->>D: 7. Log Score History
            D-->>S: 8. Updated Score Data
            S->>C: 9. Update Scoreboard Cache
            S-->>G: 10. Success Response
            G-->>U: 11. Score Update Confirmed
            
            Note over W,C: Live Update Flow
            S->>W: 12. Broadcast Score Update
            W->>W: 13. Update Connected Clients
            W-->>U: 14. Live Scoreboard Update
        else Validation Failed
            S-->>G: Anti-fraud Error
            G-->>U: Request Rejected
        end
    else Authentication Failed
        A-->>G: Auth Error
        G-->>U: Unauthorized
    end

    Note over U,C: Scoreboard Retrieval Flow
    U->>G: GET /scoreboard/top
    G->>C: Check Cache
    alt Cache Hit
        C-->>G: Cached Scoreboard
    else Cache Miss
        G->>S: Fetch from Database
        S->>D: Query Top Users
        D-->>S: User Rankings
        S->>C: Update Cache
        S-->>G: Fresh Scoreboard
    end
    G-->>U: Scoreboard Data
```

## ⚡ Performance Requirements

### Response Time Targets
- Score update API: < 200ms (95th percentile)
- Scoreboard retrieval: < 100ms (95th percentile)
- WebSocket message delivery: < 50ms

### Scalability Requirements
- Support 10,000 concurrent users
- Handle 1,000 score updates per second
- Maintain 5,000 active WebSocket connections

### Caching Strategy
```typescript
interface CacheConfig {
  scoreboardTTL: 30; // seconds
  userDataTTL: 300;  // seconds
  rateLimitTTL: 3600; // seconds
  leaderboardRefreshInterval: 10; // seconds
}
```

## 🚨 Error Handling & Monitoring

### Error Codes
```typescript
enum ScoreErrorCodes {
  INVALID_ACTION_TOKEN = 'SCORE_001',
  RATE_LIMIT_EXCEEDED = 'SCORE_002',
  INVALID_SCORE_INCREMENT = 'SCORE_003',
  SUSPICIOUS_ACTIVITY = 'SCORE_004',
  ACTION_VERIFICATION_FAILED = 'SCORE_005',
  DATABASE_ERROR = 'SCORE_006',
  WEBSOCKET_CONNECTION_FAILED = 'SCORE_007'
}
```

### Monitoring Metrics
- Score update success/failure rates
- Average response times per endpoint
- WebSocket connection count and message rates
- Fraud detection alerts and blocked requests
- Database query performance metrics

## 🧪 Testing Strategy

### Unit Tests
- Score calculation logic
- Anti-fraud validation rules
- Rate limiting algorithms
- WebSocket message handling

### Integration Tests
- End-to-end score update flow
- Real-time scoreboard synchronization
- Authentication and authorization
- Database transaction consistency

### Load Tests
- Concurrent score updates
- WebSocket connection stress testing
- Cache performance under load
- Rate limiting effectiveness

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/scoreboard
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=3600
ACTION_TOKEN_EXPIRY=30

# Rate Limiting
MAX_SCORE_UPDATES_PER_MINUTE=10
MAX_SCORE_UPDATES_PER_HOUR=100
MAX_SCORE_INCREMENT=100

# WebSocket
WS_PORT=3001
WS_HEARTBEAT_INTERVAL=30000

# Security
ENABLE_FRAUD_DETECTION=true
SUSPICIOUS_ACTIVITY_THRESHOLD=5
ACTION_TIME_DRIFT_TOLERANCE=5000
```

## 📚 Implementation Guidelines

### 1. Development Phases

**Phase 1: Core API (Week 1-2)**
- Basic score update endpoint
- User authentication
- Database schema implementation
- Basic rate limiting

**Phase 2: Real-time Features (Week 3)**
- WebSocket implementation
- Live scoreboard updates
- Caching layer integration

**Phase 3: Security & Anti-fraud (Week 4)**
- Advanced fraud detection
- Action verification system
- Enhanced monitoring and alerting

**Phase 4: Optimization (Week 5)**
- Performance tuning
- Load testing and optimization
- Production deployment preparation

### 2. Technology Stack Recommendations

**Backend Framework:** Node.js with Express.js/Fastify or Go with Gin
**Database:** PostgreSQL with Redis for caching
**WebSocket:** Socket.IO or native WebSocket with connection pooling
**Authentication:** JWT with refresh token mechanism
**Monitoring:** Prometheus + Grafana or DataDog
**Message Queue:** Redis Pub/Sub or RabbitMQ for scaling

### 3. Security Best Practices

- Implement rate limiting at multiple layers (application, proxy, CDN)
- Use HTTPS/WSS for all communications
- Validate and sanitize all input data
- Implement proper CORS policies
- Use database transactions for score updates
- Log all suspicious activities for analysis

## 💡 Additional Improvements & Considerations

### 1. Advanced Anti-Fraud Features
- **Machine Learning Integration**: Implement behavioral analysis to detect abnormal patterns
- **Device Fingerprinting**: Enhanced client identification beyond IP addresses
- **Action Replay Protection**: Prevent replay attacks using nonce-based verification
- **Geographical Analysis**: Flag unusual location-based activities

### 2. Scalability Enhancements
- **Horizontal Scaling**: Database sharding strategies for large user bases
- **CDN Integration**: Cache scoreboard data at edge locations
- **Microservices Architecture**: Separate score service from user management
- **Event-Driven Architecture**: Use message queues for decoupled processing

### 3. User Experience Improvements
- **Predictive Caching**: Pre-load scoreboard data based on user patterns
- **Graceful Degradation**: Fallback mechanisms when real-time updates fail
- **Optimistic Updates**: Update UI immediately, sync with server asynchronously
- **Personalized Views**: Show user's rank even if not in top 10

### 4. Analytics & Business Intelligence
- **Score Analytics Dashboard**: Track score distribution and user engagement
- **A/B Testing Framework**: Test different scoring mechanisms
- **User Segmentation**: Analyze scoring patterns by user demographics
- **Fraud Detection Reports**: Regular analysis of blocked activities

### 5. Operational Excellence
- **Health Check Endpoints**: Comprehensive service health monitoring
- **Circuit Breaker Pattern**: Protect against cascade failures
- **Blue-Green Deployment**: Zero-downtime deployments
- **Automated Backup & Recovery**: Regular database snapshots and point-in-time recovery

### 6. Future Feature Considerations
- **Leaderboard Categories**: Multiple scoreboards for different game modes
- **Team/Guild Scoring**: Group-based scoring mechanisms
- **Historical Rankings**: Track rank changes over time
- **Achievement System**: Badge/milestone integration with scoring
- **Social Features**: Friend leaderboards and score sharing

## 📋 Acceptance Criteria

### Functional Requirements ✅
- [ ] Score updates are processed within 200ms
- [ ] Top 10 scoreboard updates in real-time
- [ ] Anti-fraud system blocks suspicious activities
- [ ] Rate limiting prevents abuse
- [ ] WebSocket connections remain stable under load

### Non-Functional Requirements ✅
- [ ] System handles 10,000 concurrent users
- [ ] 99.9% uptime during business hours
- [ ] All API responses include proper error handling
- [ ] Comprehensive logging and monitoring implemented
- [ ] Security audit passes with no critical vulnerabilities

### Security Requirements ✅
- [ ] All score updates require valid authentication
- [ ] Action verification prevents unauthorized score increases
- [ ] Rate limiting effectively blocks malicious requests
- [ ] Suspicious activities are detected and logged
- [ ] Data transmission is encrypted (HTTPS/WSS)

---

## 📝 Notes for Backend Engineering Team

1. **Start with MVP**: Implement core functionality first, then add advanced features
2. **Security First**: Do not compromise on anti-fraud measures - they are critical
3. **Monitor Everything**: Implement comprehensive logging from day one
4. **Test Thoroughly**: Pay special attention to race conditions in score updates
5. **Document APIs**: Use OpenAPI/Swagger for API documentation
6. **Consider Edge Cases**: Handle network failures, concurrent updates, and edge cases gracefully

This specification provides a comprehensive foundation for implementing a robust, secure, and scalable live scoreboard system. The engineering team should adapt specific implementation details based on the chosen technology stack and infrastructure requirements.