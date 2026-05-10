// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  MessagePayload,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};
export const fetchToken = async () => {
  try {
    const fcmMessaging = await getFirebaseMessaging();
    if (!fcmMessaging) return null;
    const token = await getToken(fcmMessaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};
export async function getNotificationPermissionAndToken() {
  // Step 1: Check if Notifications are supported in the browser.
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  // Step 2: Check if permission is already granted.
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  // Step 3: If permission is not denied, request permission from the user.
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

export const onMessageListener = async (
  callback: (msgPayload: MessagePayload) => void,
) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;
  return onMessage(messaging, callback);
};
