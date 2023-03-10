export default (): any => ({
  provider: process.env.PROVIDER || 'kr-express-user',
  port: parseInt(process.env.PORT, 10) || 3000,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  authentication: {
    hashSize: 10,
    secret: process.env.SECRET_KEY || 'super_secret',
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: 'http://localhost',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '7d',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  database: {
    host: process.env.MONGODB_URI,
    options: {
      dbName: process.env.DB_NAME || 'kr-express-user-service',
      w: 'majority',
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
})
