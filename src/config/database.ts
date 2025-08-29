export const databaseConfig = {
  // Database connection
  url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/woodpecker_beats',
  
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000,
  },
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Logging
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

export const prismaConfig = {
  // Prisma specific settings
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  
  // Error formatting
  errorFormat: 'pretty',
  
  // Datasources
  datasources: {
    db: {
      url: databaseConfig.url,
    },
  },
}
