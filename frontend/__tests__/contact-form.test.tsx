import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  phone: z.string().trim().max(25, 'Phone number cannot exceed 25 characters').optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(200, 'Subject cannot exceed 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
});

describe('Contact Page Client-Side Validation Tests', () => {
  it('accepts valid contact form inputs with phone', () => {
    const result = contactSchema.safeParse({
      name: 'Aarav Joshi',
      email: 'aarav.joshi@example.com',
      phone: '+977 9848123456',
      subject: 'Youth Tournament Sponsorship',
      message: 'We are interested in partnering with High School Youth Club for the upcoming tournament.',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid contact form inputs without phone (optional)', () => {
    const result = contactSchema.safeParse({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '',
      subject: 'Volunteering Inquiry',
      message: 'I want to join the community cleaning program in Krishnapur.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty or short full name (< 2 characters)', () => {
    const result = contactSchema.safeParse({
      name: 'A',
      email: 'test@example.com',
      subject: 'General Question',
      message: 'Valid message with more than 10 characters.',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Name must be at least 2 characters');
    }
  });

  it('rejects invalid email formats', () => {
    const result = contactSchema.safeParse({
      name: 'Valid Name',
      email: 'not-an-email@',
      subject: 'General Question',
      message: 'Valid message with more than 10 characters.',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email address');
    }
  });

  it('rejects subject with fewer than 3 characters', () => {
    const result = contactSchema.safeParse({
      name: 'Valid Name',
      email: 'valid@example.com',
      subject: 'Hi',
      message: 'Valid message with more than 10 characters.',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Subject must be at least 3 characters');
    }
  });

  it('rejects message with fewer than 10 characters', () => {
    const result = contactSchema.safeParse({
      name: 'Valid Name',
      email: 'valid@example.com',
      subject: 'General Inquiry',
      message: 'Too short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Message must be at least 10 characters');
    }
  });

  it('correctly formats WhatsApp numbers for wa.me links', () => {
    const formatWhatsapp = (raw: string) => {
      const digits = raw.replace(/\D/g, '');
      return digits.length === 10 ? `977${digits}` : digits;
    };

    expect(formatWhatsapp('+977 9748886690')).toBe('9779748886690');
    expect(formatWhatsapp('9748886690')).toBe('9779748886690');
    expect(formatWhatsapp('+977-9812345678')).toBe('9779812345678');
  });
});
