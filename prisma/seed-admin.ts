import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/hash";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@parthub.com";
  const adminPassword = "admin123";
  const adminName = "Admin User";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists!");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Current role: ${existingAdmin.role}`);
    
    // Update to ADMIN if not already
    if (existingAdmin.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: Role.ADMIN },
      });
      console.log("   ✅ Updated role to ADMIN");
    }
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(adminPassword);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role: ${admin.role}`);
  console.log("\n📝 You can now login at: http://localhost:3000/auth/login");
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

