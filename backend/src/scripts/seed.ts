import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before importing models
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserProfile } from '../models/UserProfile.model';
import { SiteSettings } from '../models/SiteSettings.model';
import { SiteContent } from '../models/SiteContent.model';

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/high_school_youth_club';
  console.log(`[SEED] Connecting to MongoDB at ${mongoUri}...`);
  await mongoose.connect(mongoUri);

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@highschoolyouthclub.org').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  // 1. Ensure Super Admin
  let admin = await UserProfile.findOne({
    $or: [{ email: adminEmail }, { email: 'admin@hamrochowk.org' }],
  }).select('+passwordHash');

  if (admin) {
    admin.email = adminEmail;
    admin.passwordHash = passwordHash;
    admin.role = 'SUPER_ADMIN';
    admin.status = 'active';
    admin.fullName = 'High School Youth Club Admin';
    if (!admin.adminId) {
      admin.adminId = 'HSYC-ADM-4F82B7';
      admin.memberId = admin.adminId;
    }
    await admin.save();
    console.log(`[SEED] Updated existing Super Admin: ${adminEmail}`);
  } else {
    admin = await UserProfile.create({
      fullName: 'High School Youth Club Admin',
      email: adminEmail,
      phone: '+977 9800000000',
      role: 'SUPER_ADMIN',
      status: 'active',
      passwordHash,
      adminId: 'HSYC-ADM-4F82B7',
      memberId: 'HSYC-ADM-4F82B7',
      bio: 'System Administrator for High School Youth Club Portal',
    });
    console.log(`[SEED] Created new Super Admin: ${adminEmail}`);
  }

  // 2. Ensure Default Site Settings
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      orgName: 'High School Youth Club',
      tagline: 'Empowering Youth. Transforming Communities.',
      contactEmail: 'hsyc172@gmail.com',
      contactPhone: '+977 9748886690',
      address: 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal',
      socialLinks: {
        facebook: 'https://www.facebook.com/share/1EKK6u46Qd/',
        whatsapp: 'https://wa.me/9779748886690',
        tiktok: 'https://www.tiktok.com/@hsyc172',
        instagram: 'https://www.instagram.com/hsyc172',
        youtube: 'https://www.youtube.com/@hsyc172',
      },
      portalConfig: {
        clubNepaliName: 'हाई स्कूल युवा क्लब',
        registrationNumber: 'HSYC-KP5-2080',
        establishedYear: 2020,
        allowPublicRegistration: true,
      },
    });
    console.log(`[SEED] Seeded default Site Settings`);
  } else {
    settings.orgName = 'High School Youth Club';
    settings.contactEmail = 'hsyc172@gmail.com';
    settings.contactPhone = '+977 9748886690';
    settings.address = 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal';
    settings.socialLinks = {
      facebook: 'https://www.facebook.com/share/1EKK6u46Qd/',
      whatsapp: 'https://wa.me/9779748886690',
      tiktok: 'https://www.tiktok.com/@hsyc172',
      instagram: 'https://www.instagram.com/hsyc172',
      youtube: 'https://www.youtube.com/@hsyc172',
    };
    await settings.save();
    console.log(`[SEED] Updated Site Settings with official contact & social channels`);
  }

  // 3. Ensure Default Site Content (Hero & About)
  const heroContent = await SiteContent.findOne({ sectionKey: 'hero' });
  if (!heroContent) {
    await SiteContent.create({
      sectionKey: 'hero',
      contentPayload: {
        title: 'Empowering Nepali Youth. Transforming Communities.',
        subtitle: 'A grassroots youth community dedicated to social welfare, cultural preservation, and environmental protection in Krishnapur-5.',
        ctaButton: { text: 'Explore Events', link: '/events' },
      },
      published: true,
    });
    console.log(`[SEED] Seeded Hero Section`);
  }

  const aboutContent = await SiteContent.findOne({ sectionKey: 'about' });
  if (!aboutContent) {
    await SiteContent.create({
      sectionKey: 'about',
      contentPayload: {
        title: 'Building Community From the Ground Up',
        subtitle: 'High School Youth Club was founded in Gulariya, Krishnapur-5, Kanchanpur to empower youth through education, sports, and leadership.',
        content: 'Our mission is to foster social cohesion, organize constructive community welfare programs, and provide a platform for personal development for local youth.',
      },
      published: true,
    });
    console.log(`[SEED] Seeded About Section`);
  }

  console.log('[SEED] Seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[SEED] Error during seeding:', err);
  process.exit(1);
});
