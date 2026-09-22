import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function cleanupDummyData() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hamro_chowk';
  console.log(`[CLEANUP] Connecting to database at ${uri}...`);
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  console.log('\n[CLEANUP] Starting comprehensive dummy/test data removal...');

  // 1. Clean test User Profiles (Keep only authentic Super Admin and real accounts)
  const realEmails = [
    (process.env.SUPER_ADMIN_EMAIL || 'admin@highschoolyouthclub.org').toLowerCase(),
    'manojkunwar933@gmail.com',
  ];

  const userResult = await db.collection('userprofiles').deleteMany({
    email: { $nin: realEmails },
  });
  console.log(`[CLEANUP] Deleted ${userResult.deletedCount} dummy/test user profiles`);

  // Ensure remaining accounts have their statistics/records reset to clean real defaults (0 hours, 0 events, etc.)
  await db.collection('userprofiles').updateMany(
    { email: { $in: realEmails } },
    {
      $set: {
        volunteerHours: 0,
        eventsAttended: 0,
        projectsBacked: 0,
        achievementsCount: 0,
        leadershipRank: 'Youth Leader',
      },
    }
  );
  console.log(`[CLEANUP] Reset activity statistics for real accounts to default clean state (0s)`);

  // 2. Clean Events
  const eventResult = await db.collection('events').deleteMany({});
  console.log(`[CLEANUP] Deleted ${eventResult.deletedCount} dummy/test events`);

  // 3. Clean Event Registrations
  if (await db.collection('eventregistrations').countDocuments() > 0) {
    const regResult = await db.collection('eventregistrations').deleteMany({});
    console.log(`[CLEANUP] Deleted ${regResult.deletedCount} test event registrations`);
  }

  // 4. Clean Notices
  const noticeResult = await db.collection('notices').deleteMany({});
  console.log(`[CLEANUP] Deleted ${noticeResult.deletedCount} test notices`);

  // 5. Clean Gallery Items
  const galleryResult = await db.collection('galleries').deleteMany({});
  console.log(`[CLEANUP] Deleted ${galleryResult.deletedCount} test gallery items`);

  // 6. Clean Contact Messages / Inquiries
  const contactResult = await db.collection('contactmessages').deleteMany({});
  console.log(`[CLEANUP] Deleted ${contactResult.deletedCount} test contact messages`);

  // 7. Clean Activities
  const activityResult = await db.collection('activities').deleteMany({});
  console.log(`[CLEANUP] Deleted ${activityResult.deletedCount} test activities`);

  // 8. Clean Achievements
  const achievementResult = await db.collection('achievements').deleteMany({});
  console.log(`[CLEANUP] Deleted ${achievementResult.deletedCount} test achievements`);

  // 9. Clean Members collection (if used for public member directory separate from userprofiles)
  const memberResult = await db.collection('members').deleteMany({});
  console.log(`[CLEANUP] Deleted ${memberResult.deletedCount} test members`);

  // 10. Clean Audit Logs (both auditlogs and audit_logs)
  const auditResult = await db.collection('auditlogs').deleteMany({});
  console.log(`[CLEANUP] Deleted ${auditResult.deletedCount} test audit log entries from auditlogs`);
  if (await db.collection('audit_logs').countDocuments() > 0) {
    await db.collection('audit_logs').deleteMany({});
  }

  // Ensure Super Admin has ID
  await db.collection('userprofiles').updateOne(
    { email: 'admin@highschoolyouthclub.org' },
    {
      $set: {
        adminId: 'HSYC-ADM-4F82B7',
        memberId: 'HSYC-ADM-4F82B7',
      },
    }
  );

  // 11. Drop obsolete legacy otpverifications collection if present
  try {
    await db.collection('otpverifications').drop();
    console.log('[CLEANUP] Dropped obsolete otpverifications collection');
  } catch {
    // Collection already removed or does not exist
  }

  // 12. Reset Counters
  await db.collection('counters').deleteMany({});
  console.log(`[CLEANUP] Reset sequence counters`);

  console.log('\n[CLEANUP] Verifying database state post-cleanup...');
  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  Collection [${c.name}]: ${count} records`);
  }

  console.log('\n[CLEANUP] Remaining User Profiles:');
  const remainingUsers = await db.collection('userprofiles').find({}).toArray();
  remainingUsers.forEach((u) => {
    console.log(`  ✓ ${u.email} (${u.role}) - ${u.fullName} [ID: ${u.adminId || u.memberId}]`);
  });

  await mongoose.disconnect();
  console.log('\n[CLEANUP] Database cleanup finished successfully!');
}

cleanupDummyData().catch((err) => {
  console.error('[CLEANUP] Error:', err);
  process.exit(1);
});
