importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCAPgYuYu15f_EAk7f8xLu0Brkx4K_kTs4",
  authDomain: "one-fm-mobile-web-app.firebaseapp.com",
  projectId: "one-fm-mobile-web-app",
  storageBucket: "one-fm-mobile-web-app.appspot.com",
  messagingSenderId: "256258706751",
  appId: "1:256258706751:web:5dd888a861dec84511578a",
  measurementId: "G-FQD615CL3T",
});

const messaging = firebase.messaging();
const isChrome = navigator.userAgent.toLowerCase().includes("chrome");

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "Notification";
  const notificationOptions = {
    body: payload?.notification?.body || "",
    icon: payload?.notification?.icon || "/assets/img/logo.png",
  };

  if (isChrome) {
    notificationOptions["data"] = {
      url: payload?.notification?.click_action,
    };
  } else {
    if (payload?.notification?.click_action) {
      notificationOptions["actions"] = [
        {
          action: payload.notification.click_action,
          title: "View Details",
        },
      ];
    }
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});
