import Counter from '../models/Counter.model';
import UserProfile from '../models/UserProfile.model';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Generates a unique, server-side Member ID in the format:
 * MEM-2026-000001, MEM-2026-000002
 *
 * Uses atomic sequence counters and verifies database uniqueness.
 */
export async function generateMemberId(year: number = CURRENT_YEAR): Promise<string> {
  const counterId = `member_id_${year}`;
  let isUnique = false;
  let attempts = 0;
  let memberId = '';

  while (!isUnique && attempts < 30) {
    attempts++;
    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNumber = counter ? counter.seq : attempts;
    memberId = `MEM-${year}-${seqNumber.toString().padStart(6, '0')}`;

    const existing = await UserProfile.findOne({
      $or: [{ memberId }, { adminId: memberId }],
    });
    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique Member ID. Please retry.');
  }

  return memberId;
}

/**
 * Generates a unique, server-side Admin ID in the format:
 * ADM-2026-000001, ADM-2026-000002
 *
 * Uses atomic sequence counters and verifies database uniqueness.
 */
export async function generateAdminId(year: number = CURRENT_YEAR): Promise<string> {
  const counterId = `admin_id_${year}`;
  let isUnique = false;
  let attempts = 0;
  let adminId = '';

  while (!isUnique && attempts < 30) {
    attempts++;
    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNumber = counter ? counter.seq : attempts;
    adminId = `ADM-${year}-${seqNumber.toString().padStart(6, '0')}`;

    const existing = await UserProfile.findOne({
      $or: [{ adminId }, { memberId: adminId }],
    });
    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique Admin ID. Please retry.');
  }

  return adminId;
}

