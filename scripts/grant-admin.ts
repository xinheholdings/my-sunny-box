import { getPrismaClient } from "../src/lib/prisma";

const emailArgument = process.argv.find((argument) => argument.startsWith("--email="));
const email = emailArgument?.slice("--email=".length).trim().toLowerCase();

async function main() {
  if (!email) {
    console.error("Usage: npm run admin:grant -- --email=user@example.com");
    process.exitCode = 1;
    return;
  }

  const prisma = getPrismaClient();

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: { id: true, email: true, role: true },
    });
    console.log(`Admin access granted: ${user.email} (${user.id})`);
  } catch (error) {
    console.error(`Unable to grant admin access. Confirm that ${email} is already registered.`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
