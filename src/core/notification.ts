export const pushNotification = (title: string, message: string) => {
  chrome.notifications.create(
    'Brancho',
    {
      type: 'basic',
      title: title,
      message: message,
      iconUrl: 'img/b-icon-24.png',
      priority: 2,
    },
    (notificationId) => {
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 3000);
    }
  );
};
