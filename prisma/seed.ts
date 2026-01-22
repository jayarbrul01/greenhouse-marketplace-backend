import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Import PrismaClient using namespace import to work around ESM re-export issues
// Note: Prisma Client must be generated first (run: npx prisma generate)
import * as Prisma from "@prisma/client";
const { PrismaClient } = Prisma as any;

// Define RoleName type manually until Prisma Client is generated
type RoleName = "BUYER" | "SELLER" | "WISHLIST" | "ADMIN";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles: RoleName[] = ["BUYER", "SELLER", "WISHLIST", "ADMIN"];

  for (const name of roles) {
    // Use type assertion to work around Prisma Client type checking
    // This is needed until Prisma Client is regenerated after schema changes
    await prisma.role.upsert({
      where: { name: name as any },
      update: {},
      create: { name: name as any }
    });
  }

  console.log("✅ Seeded all roles:", roles.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
