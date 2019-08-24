/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: '{{messagingSenderId}}',
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notification = payload.notification

  return self.registration.showNotification(notification.title.title, {
    body: notification.body,
    icon: '/img/logo/favicon.png',
    badge: notification.avatar,
  })
})
