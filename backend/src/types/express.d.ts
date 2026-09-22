import { IUserProfileDocument } from '../models/UserProfile.model';

// Extend Express Request to carry authenticated user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        supabaseId: string;
        email: string;
        profile: IUserProfileDocument;
      };
      sessionId?: string;
    }
  }
}

export {};
