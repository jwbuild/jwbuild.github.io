"use strict";
self.addEventListener('push', function (event) {
    console.log('Push event received', event);
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notification';
    const options = {
        body: data.body || 'Default notification body',
        icon: data.icon || '/vite.svg',
        badge: data.badge || '/vite.svg',
    };
    console.log('Push event received', event);
    event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
self.addEventListener('install', (event) => {
    console.log('Service worker installed!');
});
self.addEventListener('activate', (event) => {
    console.log('Service worker activated!');
});
//# sourceMappingURL=service-worker.js.map