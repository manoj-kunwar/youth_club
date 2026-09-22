import mongoose from 'mongoose';
import Member, { IMemberDocument } from '../models/Member.model';
import { buildPaginationMeta } from '../utils/apiResponse';
import { NotFoundError } from '../middleware/errorHandler';
import type { CreateMemberInput, UpdateMemberInput, MemberFilterParams } from '../validators/entities.validator';

export async function listMembers(params: MemberFilterParams) {
  const { page, limit, sortBy, sortOrder, search, role, status, isVolunteer } = params;
  const skip = (page - 1) * limit;
  const filter: mongoose.FilterQuery<IMemberDocument> = {};

  if (role) filter['role'] = role;
  if (status) filter['status'] = status;
  if (typeof isVolunteer === 'boolean') filter['isVolunteer'] = isVolunteer;
  if (search) {
    filter['$or'] = [
      { fullName: { $regex: search, $options: 'i' } },
      { nepaliName: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    : { role: 1, fullName: 1 };

  const [data, total] = await Promise.all([
    Member.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Member.countDocuments(filter),
  ]);
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getMemberById(id: string): Promise<IMemberDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Member');
  const member = await Member.findById(id);
  if (!member) throw new NotFoundError('Member');
  return member;
}

export async function createMember(data: CreateMemberInput): Promise<IMemberDocument> {
  const member = new Member(data);
  await member.save();
  return member;
}

export async function updateMember(id: string, data: UpdateMemberInput): Promise<IMemberDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Member');
  const member = await Member.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!member) throw new NotFoundError('Member');
  return member;
}

export async function deleteMember(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Member');
  const result = await Member.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('Member');
}
