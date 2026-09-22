import { Resend } from 'resend';
import { config } from './env';

export const resend = new Resend(config.RESEND_API_KEY);

export const emailConfig = {
  from: `${config.RESEND_FROM_NAME} <${config.RESEND_FROM_EMAIL}>`,
  fromName: config.RESEND_FROM_NAME,
  fromEmail: config.RESEND_FROM_EMAIL,
};
