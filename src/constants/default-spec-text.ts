const DEFAULT_SPEC_TEXT = JSON.stringify({
  openapi: '3.0.0',

  info: {
    title: 'JSONPlaceholder Demo API',
    version: '1.0.0',
  },

  servers: [
    {
      url: 'https://jsonplaceholder.typicode.com',
    },
  ],

  paths: {
    '/posts/{id}': {
      get: {
        summary: 'Get post',

        description: 'Returns one post',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Post ID',

            schema: {
              type: 'integer',
            },
          },

          {
            name: '_expand',
            in: 'query',

            description: 'Expand user',

            schema: {
              type: 'string',
            },
          },

          {
            name: 'Authorization',

            in: 'header',

            description: 'Bearer token',

            schema: {
              type: 'string',
            },
          },

          {
            name: 'session',

            in: 'cookie',

            description: 'Session id',

            schema: {
              type: 'string',
            },
          },
        ],

        responses: {
          200: {
            description: 'Successful response',

            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },

                example: {
                  id: 1,
                  title: 'Sample title',
                  body: 'Sample body',
                },
              },
            },
          },

          404: {
            description: 'Post not found',
          },
        },
      },
    },

    '/posts': {
      post: {
        summary: 'Create post',

        description: 'Creates a new post',

        requestBody: {
          required: true,

          description: 'New post',

          content: {
            'application/json': {
              example: {
                title: 'New title',
                body: 'Post body',
                userId: 1,
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Created',

            content: {
              'application/json': {
                example: {
                  id: 101,
                  title: 'New title',
                  body: 'Post body',
                  userId: 1,
                },
              },
            },
          },
        },
      },
    },
  },
});

export default DEFAULT_SPEC_TEXT;
