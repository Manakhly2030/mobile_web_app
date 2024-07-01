<script setup>
import { onMounted, getCurrentInstance } from "vue";
import { RouterView } from "vue-router";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
const isChrome = navigator.userAgent.toLowerCase().includes("chrome");

const { proxy } = getCurrentInstance();

onMounted(() => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");

      getToken(messaging, { vapidKey: firebaseConfig.vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Token: ", currentToken);
            const loggedInUser = proxy.get_logged_in_user();

            if (loggedInUser) {
              proxy.frappe
                .customApiCall(
                  "api/method/one_fm.api.api.store_fcm_token",
                  {
                    employee_id: loggedInUser.employee_data.employee_id,
                    fcm_token: currentToken,
                    device_os: "Web",
                  },
                  "POST"
                )
                .then((res) => {
                  if (res.status_code == 200) {
                    console.log("Stored FCM Token");
                  } else {
                    this.notify.error("Error", res.message);
                  }
                });
            }
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });

      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        const notificationTitle =
          payload?.notification?.title || "Notification";
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

        if (Notification.permission === "granted") {
          const notification = new Notification(
            notificationTitle,
            notificationOptions
          );
          notification.onclick = (event) => {
            event.preventDefault();
            if (isChrome) {
              window.open(notificationOptions.data.url, "_blank");
            } else {
              window.open(payload?.notification?.click_action, "_blank");
            }
          };
        }
      });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
