import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Articles API',
      description: 'Simple API for creating and querying articles, with paginating function and basic authentication.',
      version: '1.0.0',
    },
  },
  components: {
    schemas: {
      NewArticle: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
      },
      NewTokenRequest: {
        type: 'object',
        properties: {
          platform: { type: 'string' },
        },
      },
      RenewTokenRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'UUID',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ['./routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
