import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Initialize Prisma Client if it doesn't already exist in the global scope
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
