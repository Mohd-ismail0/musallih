import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getEnv } from '../config/env';

export interface DecodedIdToken {
  uid: string;
  email?: string;
  phone_number?: string;
  name?: string;
}

@Injectable()
export class FirebaseService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (admin.apps.length > 0) {
      this.initialized = true;
      return;
    }

    const env = getEnv();
    const credsPath = env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = env.FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const privateKey = env.FIREBASE_PRIVATE_KEY;

    if (credsPath) {
      try {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
        this.initialized = true;
      } catch {
        // applicationDefault reads GOOGLE_APPLICATION_CREDENTIALS
      }
    }

    if (!this.initialized && projectId && clientEmail && privateKey) {
      const key = privateKey.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: key,
        }),
      });
      this.initialized = true;
    }
  }

  isConfigured(): boolean {
    return this.initialized;
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    if (!this.initialized) {
      throw new ServiceUnavailableException(
        'Firebase Auth is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or GOOGLE_APPLICATION_CREDENTIALS.',
      );
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      email: decoded.email,
      phone_number: decoded.phone_number,
      name: decoded.name,
    };
  }
}
