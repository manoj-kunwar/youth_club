import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function check() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hamro_chowk';
  await mongoose.connect(uri);
  console.log('Connected to:', uri);

  const db = mongoose.connection.db;
  if (!db) {
    console.error('No db connected');
    return;
  }

  const collections = await db.listCollections().toArray();
  console.log('\n--- COLLECTIONS & DOCUMENT COUNTS ---');
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`• ${c.name}: ${count} documents`);
  }

  console.log('\n--- DETAILED RECORDS ---');
  for (const c of collections) {
    const docs = await db.collection(c.name).find({}).toArray();
    console.log(`\n=== Collection: ${c.name} (${docs.length} items) ===`);
    docs.forEach((doc, idx) => {
      console.log(`[${idx + 1}] ID: ${doc._id} |`, JSON.stringify({
        email: doc.email,
        role: doc.role,
        fullName: doc.fullName,
        name: doc.name,
        title: doc.title,
        subject: doc.subject,
        memberId: doc.memberId,
        adminId: doc.adminId,
        action: doc.action,
        sectionKey: doc.sectionKey,
        orgName: doc.orgName
      }));
    });
  }

  await mongoose.disconnect();
}

check().catch(console.error);
