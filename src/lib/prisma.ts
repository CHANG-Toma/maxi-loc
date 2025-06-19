import { PrismaClient } from '../../prisma/generated/client'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'
import { fetch as undiciFetch } from 'undici'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL!

// Utiliser l'adaptateur PlanetScale pour l'environnement de production
const adapter = new PrismaPlanetScale({ 
  url: connectionString, 
  fetch: undiciFetch 
})

export const prisma = 
  globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
