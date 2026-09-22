import { createContactSchema } from '../validators/entities.validator';

describe('Contact Inquiry Server-Side Validation Tests', () => {
  it('validates a correct contact payload', () => {
    const input = {
      name: 'Binod Bhatta',
      email: 'binod@example.com',
      phone: '+977 9812345678',
      subject: 'Community Sanitation Project',
      message: 'I would like to participate in this weekend clean-up activity.',
    };

    const parsed = createContactSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe('Binod Bhatta');
      expect(parsed.data.email).toBe('binod@example.com');
      expect(parsed.data.phone).toBe('+977 9812345678');
    }
  });

  it('normalizes email to lowercase and trims whitespace', () => {
    const input = {
      name: '  Kiran Thapa  ',
      email: '  Kiran.Thapa@Example.COM  ',
      subject: '  Meeting Inquiry  ',
      message: '  Please let me know when the general meeting is scheduled.  ',
    };

    const parsed = createContactSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe('Kiran Thapa');
      expect(parsed.data.email).toBe('kiran.thapa@example.com');
      expect(parsed.data.subject).toBe('Meeting Inquiry');
      expect(parsed.data.message).toBe('Please let me know when the general meeting is scheduled.');
    }
  });

  it('rejects invalid email address', () => {
    const input = {
      name: 'User Name',
      email: 'not-a-valid-email',
      subject: 'Inquiry Subject',
      message: 'Valid message with more than 10 characters.',
    };

    const parsed = createContactSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].path).toContain('email');
    }
  });

  it('rejects message with fewer than 10 characters', () => {
    const input = {
      name: 'User Name',
      email: 'user@example.com',
      subject: 'Inquiry',
      message: 'Short',
    };

    const parsed = createContactSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].path).toContain('message');
    }
  });

  it('rejects subject with fewer than 3 characters', () => {
    const input = {
      name: 'User Name',
      email: 'user@example.com',
      subject: 'Hi',
      message: 'Valid message with more than 10 characters.',
    };

    const parsed = createContactSchema.safeParse(input);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].path).toContain('subject');
    }
  });
});
