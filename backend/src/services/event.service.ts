import mongoose from 'mongoose';
import Event, { IEventDocument } from '../models/Event.model';
import { buildPaginationMeta } from '../utils/apiResponse';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';
import type { CreateEventInput, UpdateEventInput, EventFilterParams } from '../validators/event.validator';

// ─── listEvents ───────────────────────────────────────────────────────────
export async function listEvents(params: EventFilterParams) {
  const { page, limit, sortBy, sortOrder, search, status, eventType, published, dateFrom, dateTo } = params;
  const skip = (page - 1) * limit;

  const filter: mongoose.FilterQuery<IEventDocument> = {};

  if (status) filter['status'] = status;
  if (eventType) filter['eventType'] = eventType;
  if (typeof published === 'boolean') filter['published'] = published;
  if (dateFrom || dateTo) {
    filter['date'] = {};
    if (dateFrom) filter['date']['$gte'] = new Date(dateFrom);
    if (dateTo) filter['date']['$lte'] = new Date(dateTo);
  }
  if (search) {
    filter['$or'] = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { organizer: { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort['date'] = -1;
  }

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate('createdBy', 'fullName email avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Event.countDocuments(filter),
  ]);

  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

// ─── getEventById ─────────────────────────────────────────────────────────
export async function getEventById(id: string): Promise<IEventDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Event');
  }
  const event = await Event.findById(id).populate('createdBy', 'fullName email avatar');
  if (!event) throw new NotFoundError('Event');
  return event;
}

// ─── getEventBySlug ───────────────────────────────────────────────────────
export async function getEventBySlug(slug: string): Promise<IEventDocument> {
  const event = await Event.findOne({ slug }).populate('createdBy', 'fullName email avatar');
  if (!event) throw new NotFoundError('Event');
  return event;
}

// ─── createEvent ──────────────────────────────────────────────────────────
export async function createEvent(
  data: CreateEventInput,
  userId: mongoose.Types.ObjectId | string
): Promise<IEventDocument> {
  const shortDesc = (data.shortDescription && data.shortDescription.trim())
    ? data.shortDescription.trim()
    : (data.description.length > 250 ? data.description.slice(0, 250) + '...' : data.description);

  const event = new Event({
    ...data,
    shortDescription: shortDesc,
    date: new Date(data.date),
    registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : undefined,
    createdBy: userId,
  });

  try {
    await event.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      throw new ConflictError('An event with this title already exists');
    }
    throw err;
  }

  return event;
}

// ─── updateEvent ──────────────────────────────────────────────────────────
export async function updateEvent(
  id: string,
  data: UpdateEventInput
): Promise<IEventDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Event');

  const updateData: Record<string, unknown> = { ...data };
  if (data.date) updateData['date'] = new Date(data.date);
  if (data.registrationDeadline) updateData['registrationDeadline'] = new Date(data.registrationDeadline);

  const event = await Event.findById(id);
  if (!event) throw new NotFoundError('Event');

  Object.assign(event, updateData);

  try {
    await event.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      throw new ConflictError('An event with this title already exists');
    }
    throw err;
  }

  return event;
}

// ─── deleteEvent ──────────────────────────────────────────────────────────
export async function deleteEvent(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Event');
  const result = await Event.findByIdAndDelete(id);
  if (!result) throw new NotFoundError('Event');
}

// ─── publishEvent ─────────────────────────────────────────────────────────
export async function publishEvent(id: string, published: boolean): Promise<IEventDocument> {
  return updateEvent(id, { published, status: published ? 'published' : 'draft' });
}
