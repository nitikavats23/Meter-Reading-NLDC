// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
    10
  );

  const superAdmin = await prisma.user.upsert({
    where: { username: 'superadmin' }, // ✅ only @unique field on User
    update: {},
    create: {
      username: 'superadmin',
      password: hashedPassword,
      userType: 'SUPER_ADMIN',

      // ✅ Email belongs here, not on User
      profile: {
        create: {
          fullName: 'Super Admin',
          designation: 'Super Administrator',
          email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com',
          phone: process.env.SUPER_ADMIN_PHONE || '0000000000',
        },
      },

      // ✅ Role from RoleAssignment model
      role: {
        create: {
          role: Role.SUPER_ADMIN,
          approverId: null,
        },
      },

      // ✅ Auto-approve the super admin
      approvals: {
        create: {
          status: 'Activated',
          remarks: 'Seeded super admin — auto activated',
        },
      },
    },
  });

  console.log('✅ Super Admin seeded successfully');
  console.log('   Username :', superAdmin.username);
  console.log('   User ID  :', superAdmin.id);
  console.log('   Role     :', 'SUPER_ADMIN');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });