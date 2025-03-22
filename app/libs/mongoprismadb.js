import { PrismaClient } from "../../generated/mongo";

const globalForMongoPrisma = globalThis;

// Initialize Prisma Client for MongoDB if it doesn't already exist
export const mongoprisma =
  globalForMongoPrisma.mongoprisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongoPrisma.mongoprisma = mongoprisma;
}
