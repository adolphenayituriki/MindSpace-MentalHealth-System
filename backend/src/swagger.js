const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MindSpace API',
      version: '1.0.0',
      description: 'Mental health support platform API',
    },
    servers: [
      { url: '/', description: 'Current server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [],
};

const spec = swaggerJsdoc(options);

spec.paths = {
  '/api/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      responses: { 200: { description: 'OK' } },
    },
  },
  '/api/auth/anonymous': {
    post: {
      tags: ['Auth'],
      summary: 'Create anonymous session',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                displayName: { type: 'string' },
                language: { type: 'string', enum: ['en', 'rw'] },
              },
              required: ['displayName'],
            },
          },
        },
      },
      responses: { 200: { description: 'Anonymous session created' } },
    },
  },
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register with email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 6 },
                displayName: { type: 'string' },
                language: { type: 'string', enum: ['en', 'rw'] },
              },
              required: ['email', 'password', 'displayName'],
            },
          },
        },
      },
      responses: { 201: { description: 'User registered' } },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login with email',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: { 200: { description: 'Login successful' } },
    },
  },
  '/api/auth/profile': {
    get: {
      tags: ['Auth'],
      summary: 'Get profile',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Profile data' } },
    },
    patch: {
      tags: ['Auth'],
      summary: 'Update profile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: { 'application/json': { schema: { type: 'object' } } },
      },
      responses: { 200: { description: 'Profile updated' } },
    },
  },
  '/api/moods': {
    get: {
      tags: ['Moods'],
      summary: 'List moods',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Mood list' } },
    },
    post: {
      tags: ['Moods'],
      summary: 'Create mood entry',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                value: { type: 'integer', minimum: 1, maximum: 5 },
                emoji: { type: 'string' },
                note: { type: 'string' },
              },
              required: ['value', 'emoji'],
            },
          },
        },
      },
      responses: { 201: { description: 'Mood created' } },
    },
  },
  '/api/moods/today': {
    get: {
      tags: ['Moods'],
      summary: "Get today's mood",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Today's mood or null" } },
    },
  },
  '/api/moods/insights': {
    get: {
      tags: ['Moods'],
      summary: 'Mood insights',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Mood insights data' } },
    },
  },
  '/api/journals/prompts': {
    get: {
      tags: ['Journals'],
      summary: 'Get writing prompts',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'lang', in: 'query', schema: { type: 'string', enum: ['en', 'rw'] } },
      ],
      responses: { 200: { description: 'List of prompts' } },
    },
  },
  '/api/journals': {
    get: {
      tags: ['Journals'],
      summary: 'List journal entries',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Journal list' } },
    },
    post: {
      tags: ['Journals'],
      summary: 'Create journal entry',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                prompt: { type: 'string' },
              },
              required: ['content'],
            },
          },
        },
      },
      responses: { 201: { description: 'Journal created' } },
    },
  },
  '/api/journals/{id}': {
    get: {
      tags: ['Journals'],
      summary: 'Get journal entry',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Journal entry' } },
    },
    patch: {
      tags: ['Journals'],
      summary: 'Update journal entry',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Journal updated' } },
    },
    delete: {
      tags: ['Journals'],
      summary: 'Delete journal entry',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Journal deleted' } },
    },
  },
  '/api/chat': {
    post: {
      tags: ['Chat'],
      summary: 'Send chat message',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { content: { type: 'string' } },
              required: ['content'],
            },
          },
        },
      },
      responses: { 200: { description: 'AI response' } },
    },
  },
  '/api/chat/history': {
    get: {
      tags: ['Chat'],
      summary: 'Get chat history',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Chat messages' } },
    },
    delete: {
      tags: ['Chat'],
      summary: 'Clear chat history',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'History cleared' } },
    },
  },
  '/api/communities': {
    get: {
      tags: ['Communities'],
      summary: 'List all communities',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Community list' } },
    },
  },
  '/api/communities/mine': {
    get: {
      tags: ['Communities'],
      summary: 'My joined communities',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Joined communities' } },
    },
  },
  '/api/communities/{id}': {
    get: {
      tags: ['Communities'],
      summary: 'Get community details',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Community details' } },
    },
  },
  '/api/communities/{id}/join': {
    post: {
      tags: ['Communities'],
      summary: 'Join community',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Joined' } },
    },
  },
  '/api/communities/{id}/leave': {
    post: {
      tags: ['Communities'],
      summary: 'Leave community',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Left' } },
    },
  },
  '/api/communities/{id}/messages': {
    get: {
      tags: ['Communities'],
      summary: 'Get community messages',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Messages' } },
    },
    post: {
      tags: ['Communities'],
      summary: 'Send community message',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { content: { type: 'string' } },
              required: ['content'],
            },
          },
        },
      },
      responses: { 201: { description: 'Message sent' } },
    },
  },
  '/api/counseling/counselors': {
    get: {
      tags: ['Counseling'],
      summary: 'List counselors',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Counselor list' } },
    },
  },
  '/api/counseling/sessions': {
    post: {
      tags: ['Counseling'],
      summary: 'Request counseling session',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { topic: { type: 'string' } },
            },
          },
        },
      },
      responses: { 201: { description: 'Session created' } },
    },
  },
  '/api/counseling/sessions/active': {
    get: {
      tags: ['Counseling'],
      summary: 'Get active session',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Active session or null' } },
    },
  },
  '/api/counseling/sessions/{id}': {
    get: {
      tags: ['Counseling'],
      summary: 'Get session details',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Session details' } },
    },
  },
  '/api/counseling/sessions/{id}/messages': {
    get: {
      tags: ['Counseling'],
      summary: 'Get session messages',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Messages' } },
    },
    post: {
      tags: ['Counseling'],
      summary: 'Send session message',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { content: { type: 'string' } },
              required: ['content'],
            },
          },
        },
      },
      responses: { 201: { description: 'Message sent' } },
    },
  },
  '/api/counseling/sessions/{id}/close': {
    post: {
      tags: ['Counseling'],
      summary: 'Close session',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Session closed' } },
    },
  },
  '/api/crisis/resources': {
    get: {
      tags: ['Crisis'],
      summary: 'List crisis resources',
      responses: { 200: { description: 'Resource list' } },
    },
  },
  '/api/crisis/hotlines': {
    get: {
      tags: ['Crisis'],
      summary: 'List crisis hotlines',
      responses: { 200: { description: 'Hotline list' } },
    },
  },
  '/api/crisis/centers': {
    get: {
      tags: ['Crisis'],
      summary: 'List crisis centers',
      responses: { 200: { description: 'Center list' } },
    },
  },
  '/api/insights/weekly': {
    get: {
      tags: ['Insights'],
      summary: 'Weekly reflection insights',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'lang', in: 'query', schema: { type: 'string', enum: ['en', 'rw'] } }],
      responses: { 200: { description: 'Weekly insights' } },
    },
  },
  '/api/healing': {
    get: {
      tags: ['Healing'],
      summary: 'List healing resources',
      responses: { 200: { description: 'Resource list' } },
    },
  },
  '/api/healing/type/{type}': {
    get: {
      tags: ['Healing'],
      summary: 'Filter by type',
      parameters: [{ name: 'type', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Filtered resources' } },
    },
  },
  '/api/healing/recommended': {
    get: {
      tags: ['Healing'],
      summary: 'Personalized recommendations',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Recommended resources' } },
    },
  },
  '/api/healing/{id}': {
    get: {
      tags: ['Healing'],
      summary: 'Get resource details',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Resource details' } },
    },
  },
  '/api/admin/stats': {
    get: {
      tags: ['Admin'],
      summary: 'Platform stats',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Stats data' } },
    },
  },
  '/api/admin/users': {
    get: {
      tags: ['Admin'],
      summary: 'List users',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'User list' } },
    },
  },
  '/api/admin/users/{id}/role': {
    patch: {
      tags: ['Admin'],
      summary: 'Update user role',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Role updated' } },
    },
  },
  '/api/admin/users/{id}': {
    delete: {
      tags: ['Admin'],
      summary: 'Delete user',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'User deleted' } },
    },
  },
  '/api/admin/healing': {
    post: {
      tags: ['Admin - Healing'],
      summary: 'Create healing resource',
      security: [{ bearerAuth: [] }],
      responses: { 201: { description: 'Created' } },
    },
  },
  '/api/admin/healing/{id}': {
    put: {
      tags: ['Admin - Healing'],
      summary: 'Update healing resource',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Updated' } },
    },
    delete: {
      tags: ['Admin - Healing'],
      summary: 'Delete healing resource',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Deleted' } },
    },
  },
  '/api/admin/counselors': {
    post: {
      tags: ['Admin - Counselors'],
      summary: 'Create counselor',
      security: [{ bearerAuth: [] }],
      responses: { 201: { description: 'Created' } },
    },
  },
  '/api/admin/counselors/{id}': {
    put: {
      tags: ['Admin - Counselors'],
      summary: 'Update counselor',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Updated' } },
    },
    delete: {
      tags: ['Admin - Counselors'],
      summary: 'Delete counselor',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Deleted' } },
    },
  },
  '/api/admin/crisis': {
    post: {
      tags: ['Admin - Crisis'],
      summary: 'Create crisis resource',
      security: [{ bearerAuth: [] }],
      responses: { 201: { description: 'Created' } },
    },
  },
  '/api/admin/crisis/{id}': {
    put: {
      tags: ['Admin - Crisis'],
      summary: 'Update crisis resource',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Updated' } },
    },
    delete: {
      tags: ['Admin - Crisis'],
      summary: 'Delete crisis resource',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Deleted' } },
    },
  },
  '/api/admin/communities': {
    post: {
      tags: ['Admin - Communities'],
      summary: 'Create community',
      security: [{ bearerAuth: [] }],
      responses: { 201: { description: 'Created' } },
    },
  },
  '/api/admin/communities/{id}': {
    put: {
      tags: ['Admin - Communities'],
      summary: 'Update community',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Updated' } },
    },
    delete: {
      tags: ['Admin - Communities'],
      summary: 'Delete community',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Deleted' } },
    },
  },
};

module.exports = spec;
