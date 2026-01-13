import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Import PrismaClient using namespace import to work around ESM re-export issues
// Note: Prisma Client must be generated first (run: npx prisma generate)
import * as Prisma from "@prisma/client";
const { PrismaClient } = Prisma as any;

// Define RoleName type manually until Prisma Client is generated
type RoleName = "BUYER" | "SELLER" | "WISHLIST";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles: RoleName[] = ["BUYER", "SELLER", "WISHLIST"];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log("✅ Seeded roles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
