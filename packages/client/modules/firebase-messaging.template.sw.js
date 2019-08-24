/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-messaging.js')

firebase.initializeApp({
  messagingSenderId: '{{messagingSenderId}}',
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  const notification = payload.notification || {}

  return registration.showNotification(notification.title, {
    body: notification.body,
    icon: '/img/logo/favicon.png',
    badge: notification.avatar,
  })
})
