import {
  cert,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  // Replace escaped newlines from environment variable format
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminMessaging = getMessaging();
