const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Talento Humano API',
      version: '1.0.0',
      description: 'API REST para la plataforma de gestión de Talento Humano - Universidad Iberoamericana',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
