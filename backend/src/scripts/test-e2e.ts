import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import http from 'http';
import app from '../server';

interface TestSummary {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestSummary[] = [];

async function runTest(name: string, fn: (baseUrl: string) => Promise<void>, baseUrl: string) {
  const start = Date.now();
  try {
    await fn(baseUrl);
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  ✓ ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err.message || String(err), durationMs: Date.now() - start });
    console.error(`  ✗ ${name}: ${err.message || err}`);
  }
}

async function request(baseUrl: string, endpoint: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
} = {}) {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // not json
  }

  return { status: res.status, ok: res.ok, json, text };
}

async function main() {
  console.log('\n=============================================================');
  console.log('  HIGH SCHOOL YOUTH CLUB — COMPREHENSIVE END-TO-END TEST SUITE');
  console.log('=============================================================\n');

  // Connect to existing server or start temporary test instance
  let server: http.Server | null = null;
  let baseUrl = process.env.TEST_API_URL || 'http://localhost:5001';

  let isRunning = false;
  try {
    const healthCheck = await fetch(`${baseUrl}/health`);
    if (healthCheck.ok) {
      isRunning = true;
      console.log(`[E2E] Reusing active server running at ${baseUrl}`);
    }
  } catch {
    isRunning = false;
  }

  if (!isRunning) {
    const { connectDatabase } = await import('../config/database');
    await connectDatabase(process.env.MONGODB_URI || '');
    const testPort = 5099;
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server!.listen(testPort, () => {
        console.log(`[E2E] Test server listening on port ${testPort}`);
        resolve();
      });
    });
    baseUrl = `http://localhost:${testPort}`;
  }
  let adminToken = '';
  let memberToken = '';
  let createdEventId = '';
  let createdEventSlug = '';
  let createdNoticeId = '';
  let createdMemberId = '';
  let contactMessageId = '';

  try {
    // 1. Health
    await runTest('1. System Health Check', async (url) => {
      const res = await request(url, '/health');
      const status = res.json?.data?.status || res.json?.status;
      if (res.status !== 200 || status !== 'ok') {
        throw new Error(`Expected 200 ok, got ${res.status}: ${res.text}`);
      }
    }, baseUrl);

    // 2. Admin Auth - Invalid Credentials
    await runTest('2. Admin Auth - Reject Invalid Password', async (url) => {
      const res = await request(url, '/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'admin@highschoolyouthclub.org', password: 'WrongPassword!999' },
      });
      if (res.status !== 401) {
        throw new Error(`Expected 401 for bad password, got ${res.status}`);
      }
    }, baseUrl);

    // 3. Admin Auth - Valid Login
    await runTest('3. Admin Auth - Successful Login & JWT Issuance', async (url) => {
      const res = await request(url, '/api/v1/auth/login', {
        method: 'POST',
        body: { email: 'admin@highschoolyouthclub.org', password: process.env.ADMIN_PASSWORD || 'Admin@12345' },
      });
      if (res.status !== 200 || !res.json?.data?.token) {
        throw new Error(`Login failed: ${res.status} ${res.text}`);
      }
      adminToken = res.json.data.token;
      if (res.json.data.user.role !== 'SUPER_ADMIN') {
        throw new Error(`Expected SUPER_ADMIN role, got: ${res.json.data.user.role}`);
      }
    }, baseUrl);

    // 4. Member Self-Registration & Activation
    const testMemberEmail = `test.member.${Date.now()}@example.com`;
    let testMemberGeneratedId = '';
    await runTest('4. Member Auth - Self-Registration & Activation', async (url) => {
      const res = await request(url, '/api/v1/auth/register', {
        method: 'POST',
        body: {
          fullName: 'Ram Bahadur Thapa',
          email: testMemberEmail,
          password: 'MemberPassword@123',
          confirmPassword: 'MemberPassword@123',
          phone: '+977 9811223344',
        },
      });
      if (res.status !== 201 || !res.json?.data?.memberId) {
        throw new Error(`Registration failed: ${res.status} ${res.text}`);
      }
      testMemberGeneratedId = res.json.data.memberId;
      if (!testMemberGeneratedId.startsWith('MEM-2026-')) {
        throw new Error(`Expected Member ID format MEM-2026-XXXXXX, got: ${testMemberGeneratedId}`);
      }

      // Activate the account in database to simulate successful OTP verification
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI || '');
      }
      const UserProfile = (await import('../models/UserProfile.model')).default;
      await UserProfile.updateOne(
        { email: testMemberEmail },
        { status: 'active', isEmailVerified: true }
      );

      // Log in as the newly activated member
      const loginRes = await request(url, '/api/v1/auth/login', {
        method: 'POST',
        body: {
          emailOrId: testMemberEmail,
          password: 'MemberPassword@123',
        },
      });

      if (loginRes.status !== 200 || !loginRes.json?.data?.token) {
        throw new Error(`Member login failed: ${loginRes.status} ${loginRes.text}`);
      }

      memberToken = loginRes.json.data.token;
      if (loginRes.json.data.user.role !== 'MEMBER') {
        throw new Error(`Expected MEMBER role, got: ${loginRes.json.data.user.role}`);
      }
    }, baseUrl);

    // 5. Member Duplicate Registration Rejection
    await runTest('5. Member Auth - Prevent Duplicate Email Registration', async (url) => {
      const res = await request(url, '/api/v1/auth/register', {
        method: 'POST',
        body: {
          fullName: 'Ram Bahadur Thapa',
          email: testMemberEmail,
          password: 'MemberPassword@123',
          confirmPassword: 'MemberPassword@123',
        },
      });
      if (res.status !== 409) {
        throw new Error(`Expected 409 Conflict for duplicate registration, got ${res.status}`);
      }
    }, baseUrl);

    // 6. Member Token Verification via /users/me
    await runTest('6. Authenticated Session - GET /api/v1/users/me', async (url) => {
      const res = await request(url, '/api/v1/users/me', {
        headers: { Authorization: `Bearer ${memberToken}` },
      });
      if (res.status !== 200 || res.json?.data?.email !== testMemberEmail) {
        throw new Error(`Failed to fetch current user profile: ${res.status}`);
      }
    }, baseUrl);

    // 7. RBAC Check - Member Cannot Perform Admin Actions
    await runTest('7. RBAC Check - Member Blocked from Creating Events (403)', async (url) => {
      const res = await request(url, '/api/v1/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${memberToken}` },
        body: {
          title: 'Unauthorized Member Event',
          description: 'This should be blocked',
          eventType: 'cultural',
          date: new Date().toISOString(),
          location: 'Krishnapur',
        },
      });
      if (res.status !== 403) {
        throw new Error(`Expected 403 Forbidden for member creating event, got: ${res.status}`);
      }
    }, baseUrl);

    await runTest('8. RBAC Check - Member Blocked from Reading Audit Logs (403)', async (url) => {
      const res = await request(url, '/api/v1/admin/audit', {
        headers: { Authorization: `Bearer ${memberToken}` },
      });
      if (res.status !== 403) {
        throw new Error(`Expected 403 Forbidden for member reading audit logs, got: ${res.status}`);
      }
    }, baseUrl);

    // 9. Admin Event Lifecycle (with Nepali Unicode Slug)
    await runTest('9. Admin Event Lifecycle - Create Event with Nepali Title & Unicode Fallback', async (url) => {
      const res = await request(url, '/api/v1/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'नेपाली नयाँ वर्ष २०८१ - शुभकामना आदानप्रदान कार्यक्रम',
          shortDescription: 'स्थानीय युवाहरू तथा जेष्ठ नागरिकहरूको सहभागितामा नयाँ वर्षको शुभकामना आदानप्रदान।',
          description: 'हाम्रो चोक कम्युनिटी तथा हाई स्कुल युवा क्लबद्वारा आयोजित विशेष सांस्कृतिक तथा शुभकामना आदानप्रदान कार्यक्रम।',
          eventType: 'cultural',
          date: new Date(Date.now() + 86400000 * 7).toISOString(),
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          location: 'वडा नं ५ सामुदायिक भवन, गुलरिया',
          ward: '5',
          organizer: 'High School Youth Club',
          published: true,
        },
      });

      if (res.status !== 201 || !res.json?.data?._id) {
        throw new Error(`Failed to create event: ${res.status} ${res.text}`);
      }
      createdEventId = res.json.data._id;
      createdEventSlug = res.json.data.slug;
      if (!createdEventSlug) {
        throw new Error(`Event slug was empty or failed to generate!`);
      }
    }, baseUrl);

    // 10. Public Read Event by Slug
    await runTest('10. Public Event Read - Fetch Event by Generated Slug', async (url) => {
      const res = await request(url, `/api/v1/events/slug/${encodeURIComponent(createdEventSlug)}`);
      if (res.status !== 200 || res.json?.data?._id !== createdEventId) {
        throw new Error(`Failed to retrieve event by slug: ${res.status}`);
      }
    }, baseUrl);

    // 11. Admin Edit Event
    await runTest('11. Admin Event Lifecycle - Update Event', async (url) => {
      const res = await request(url, `/api/v1/events/${createdEventId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          location: 'वडा नं ५ खेल मैदान, गुलरिया',
        },
      });
      if (res.status !== 200 || res.json?.data?.location !== 'वडा नं ५ खेल मैदान, गुलरिया') {
        throw new Error(`Failed to update event: ${res.status}`);
      }
    }, baseUrl);

    // 12. Admin Notice Lifecycle
    await runTest('12. Admin Notice Lifecycle - Create & Pin Notice', async (url) => {
      const res = await request(url, '/api/v1/notices', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          title: 'क्लबको वार्षिक साधारण सभा सम्बन्धी अत्यन्त जरुरी सूचना',
          content: 'हाई स्कुल युवा क्लबको चौथो वार्षिक साधारण सभा आगामी शनिबार बिहान ११:०० बजे आयोजना हुने भएकाले सबै सदस्यहरूको उपस्थितिका लागि अनुरोध गरिन्छ।',
          category: 'urgent',
          priority: 'high',
          published: true,
          pinned: false,
        },
      });
      if (res.status !== 201 || !res.json?.data?._id) {
        throw new Error(`Failed to create notice: ${res.status} ${res.text}`);
      }
      createdNoticeId = res.json.data._id;

      // Pin notice
      const pinRes = await request(url, `/api/v1/notices/${createdNoticeId}/pin`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { pinned: true },
      });
      if (pinRes.status !== 200 || !pinRes.json?.data?.pinned) {
        throw new Error(`Failed to pin notice: ${pinRes.status}`);
      }
    }, baseUrl);

    // 13. Admin Community Member Management (Testing /admin/members route alias)
    await runTest('13. Admin Members Lifecycle - Create Member via /admin/members', async (url) => {
      const res = await request(url, '/api/v1/admin/members', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          fullName: 'Bikash Chaudhary',
          nepaliName: 'बिकेश चौधरी',
          role: 'executive',
          position: 'General Secretary',
          email: 'bikash@highschoolyouthclub.org',
          phone: '+977 9800112233',
          bio: 'Youth activist and environmental lead at Krishnapur-5.',
          status: 'active',
        },
      });
      if (res.status !== 201 || !res.json?.data?._id) {
        throw new Error(`Failed to create member via /admin/members: ${res.status} ${res.text}`);
      }
      createdMemberId = res.json.data._id;
    }, baseUrl);

    // 14. Public Contact Form Submission
    await runTest('14. Public Contact Inquiry - Submit Message', async (url) => {
      const res = await request(url, '/api/v1/contact', {
        method: 'POST',
        body: {
          name: 'Sita Sharma',
          email: 'sita.sharma@example.com',
          phone: '+977 9848123456',
          subject: 'Community Blood Donation Drive Inquiry',
          message: 'Hello, I would like to volunteer for the upcoming community health and blood donation program in Ward 5.',
        },
      });
      if (res.status !== 201 || !(res.json?.data?._id || res.json?.data?.id)) {
        throw new Error(`Failed to submit contact message: ${res.status} ${res.text}`);
      }
      contactMessageId = res.json.data._id || res.json.data.id;
    }, baseUrl);

    // 15. Admin Contact Inquiry Management
    await runTest('15. Admin Contacts - Read & Mark As Read via /admin/contacts', async (url) => {
      const res = await request(url, '/api/v1/admin/contacts', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !Array.isArray(res.json?.data)) {
        throw new Error(`Failed to list contact messages: ${res.status}`);
      }

      const markRes = await request(url, `/api/v1/admin/contacts/${contactMessageId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { isRead: true },
      });
      if (markRes.status !== 200) {
        throw new Error(`Failed to mark contact as read: ${markRes.status}`);
      }
    }, baseUrl);

    // 16. CMS Content Management
    await runTest('16. CMS Content Management - Update Hero Section via PUT /content/hero', async (url) => {
      const res = await request(url, '/api/v1/content/hero', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          sectionKey: 'hero',
          contentPayload: {
            title: 'Empowering Krishnapur Youth. Building a Brighter Community.',
            subtitle: 'Join High School Youth Club in Kanchanpur for community development and environmental stewardship.',
            ctaButton: { text: 'Join Our Community', link: '/auth/register' },
          },
        },
      });
      if (res.status !== 200) {
        throw new Error(`Failed to update hero content: ${res.status} ${res.text}`);
      }

      // Verify public GET /content/hero
      const getRes = await request(url, '/api/v1/content/hero');
      if (getRes.status !== 200 || !getRes.json?.data?.contentPayload?.title?.includes('Empowering Krishnapur Youth')) {
        throw new Error(`Public content GET did not reflect update: ${getRes.status}`);
      }
    }, baseUrl);

    // 17. Site Settings Management
    await runTest('17. Site Settings Management - Update Settings via PUT /settings', async (url) => {
      const res = await request(url, '/api/v1/settings', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: {
          orgName: 'High School Youth Club',
          contactEmail: 'contact@highschoolyouthclub.org',
          contactPhone: '+977 9800000000',
          address: 'Gulariya, Krishnapur-5, Kanchanpur, Nepal',
          portalConfig: {
            clubNepaliName: 'हाई स्कुल युवा क्लब',
            registrationNumber: 'HSYC-KP5-2080',
            establishedYear: 2020,
            allowPublicRegistration: true,
          },
        },
      });
      if (res.status !== 200) {
        throw new Error(`Failed to update site settings: ${res.status} ${res.text}`);
      }
    }, baseUrl);

    // 18. Audit Log Persistence Verification
    await runTest('18. Audit Logs Persistence - Verify Real Actions Recorded in /admin/audit', async (url) => {
      const res = await request(url, '/api/v1/admin/audit', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200 || !Array.isArray(res.json?.data)) {
        throw new Error(`Failed to fetch audit logs: ${res.status}`);
      }

      const actions = res.json.data.map((l: any) => l.action);
      const hasNoticeOrEvent = actions.some((a: string) => a.toLowerCase().includes('create') || a.toLowerCase().includes('update'));
      if (!hasNoticeOrEvent) {
        throw new Error(`Audit logs do not contain expected actions. Found: ${actions.join(', ')}`);
      }
    }, baseUrl);

    // 19. Clean up created test entities (leaves baseline database clean & ready)
    await runTest('19. Admin Cleanup - Remove Test Entities', async (url) => {
      if (createdEventId) {
        await request(url, `/api/v1/events/${createdEventId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      if (createdNoticeId) {
        await request(url, `/api/v1/notices/${createdNoticeId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      if (createdMemberId) {
        await request(url, `/api/v1/admin/members/${createdMemberId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      if (contactMessageId) {
        await request(url, `/api/v1/admin/contacts/${contactMessageId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      if (testMemberEmail) {
        const UserProfile = (await import('../models/UserProfile.model')).default;
        await UserProfile.deleteOne({ email: testMemberEmail });
      }
    }, baseUrl);

  } finally {
    if (server) {
      await new Promise<void>((resolve) => {
        server!.close(() => resolve());
      });
      await mongoose.disconnect();
    }
  }

  console.log('\n=============================================================');
  console.log('                   E2E TEST SUMMARY');
  console.log('=============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  results.forEach((r) => {
    const status = r.passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${r.name} (${r.durationMs}ms)`);
    if (r.error) {
      console.log(`       Error: ${r.error}`);
    }
  });

  console.log(`\nTotal: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 19 END-TO-END TESTS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('[E2E FATAL]', err);
  process.exit(1);
});
