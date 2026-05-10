import { NextResponse, type NextRequest } from "next/server";
import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";

// Firebase Admin error codes that indicate a bad/expired token (client's fault)
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!,
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    }),
  });
}

export async function POST(request: NextRequest) {
  const { token, title, message, link } = await request.json();

  const payload: Message = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };

  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
