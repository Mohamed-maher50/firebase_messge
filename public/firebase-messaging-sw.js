importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAlaxTTBUgwEPScMY_v7Lw1M4GGJ98ySo4",
  authDomain: "ar-chess-academy.firebaseapp.com",
  projectId: "ar-chess-academy",
  storageBucket: "ar-chess-academy.firebasestorage.app",
  messagingSenderId: "119951307268",
  appId: "1:119951307268:web:93ed8b0832b181da63bb51",
  measurementId: "G-Y1VW0M5TRJ",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
