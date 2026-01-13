import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Import PrismaClient using namespace import to work around ESM re-export issues
// Note: Prisma Client must be generated first (run: npx prisma generate)
import * as Prisma from "@prisma/client";
const { PrismaClient } = Prisma as any;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
