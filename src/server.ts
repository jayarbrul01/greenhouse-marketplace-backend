import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function main() {
  await prisma.$connect();
  app.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
