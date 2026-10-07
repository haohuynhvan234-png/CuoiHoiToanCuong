import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Event Rental API Documentation',
      version: '1.0.0',
      description: 'API Documentation cho hệ thống cho thuê bàn ghế, rạp và phụ kiện sự kiện (Cưới Hỏi Toàn Cường)',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token theo cú pháp: Bearer <token>'
        }
      },
      schemas: {
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Thao tác thành công'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Thông báo lỗi chi tiết'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;