import { getPublicStats } from '../services/entities.service';
import Member from '../models/Member.model';
import Activity from '../models/Activity.model';
import Event from '../models/Event.model';
import UserProfile from '../models/UserProfile.model';

describe('Real Dynamic Homepage Statistics Service', () => {
  it('should return 0 for counts and null for grassrootsDriven when database is empty', async () => {
    // Mock countDocuments to return 0
    const memberCountSpy = jest.spyOn(Member, 'countDocuments').mockResolvedValue(0 as never);
    const memberDistinctSpy = jest.spyOn(Member, 'distinct').mockResolvedValue([] as never);
    const userProfileCountSpy = jest.spyOn(UserProfile, 'countDocuments').mockResolvedValue(0 as never);
    const activityCountSpy = jest.spyOn(Activity, 'countDocuments').mockResolvedValue(0 as never);
    const eventCountSpy = jest.spyOn(Event, 'countDocuments').mockResolvedValue(0 as never);

    const stats = await getPublicStats();

    expect(stats.activeVolunteers).toBe(0);
    expect(stats.projectsExecuted).toBe(0);
    expect(stats.annualFestivals).toBe(0);
    expect(stats.grassrootsDriven).toBeNull();

    memberCountSpy.mockRestore();
    memberDistinctSpy.mockRestore();
    userProfileCountSpy.mockRestore();
    activityCountSpy.mockRestore();
    eventCountSpy.mockRestore();
  });

  it('should accurately calculate real numbers when data exists', async () => {
    // Mock counts
    const memberCountSpy = jest.spyOn(Member, 'countDocuments').mockResolvedValue(15 as never);
    const memberDistinctSpy = jest.spyOn(Member, 'distinct').mockResolvedValue(['test@member.com'] as never);
    const userProfileCountSpy = jest.spyOn(UserProfile, 'countDocuments').mockResolvedValue(5 as never);
    const activityCountSpy = jest.spyOn(Activity, 'countDocuments').mockResolvedValue(8 as never);
    const eventCountSpy = jest.spyOn(Event, 'countDocuments').mockImplementation(((filter: any) => {
      if (filter && filter.status === 'completed') return Promise.resolve(2) as never;
      if (filter && filter.$or) return Promise.resolve(3) as never; // festivals
      return Promise.resolve(5) as never; // total events
    }) as any);

    const stats = await getPublicStats();

    // 15 members + 5 user volunteers = 20 active volunteers
    expect(stats.activeVolunteers).toBe(20);
    // 8 published activities + 2 completed events = 10 projects executed
    expect(stats.projectsExecuted).toBe(10);
    // 3 festivals
    expect(stats.annualFestivals).toBe(3);
    // Real percentage string calculated dynamically
    expect(stats.grassrootsDriven).toBeDefined();
    expect(stats.grassrootsDriven).toMatch(/^\d+%$/);

    memberCountSpy.mockRestore();
    memberDistinctSpy.mockRestore();
    userProfileCountSpy.mockRestore();
    activityCountSpy.mockRestore();
    eventCountSpy.mockRestore();
  });
});
