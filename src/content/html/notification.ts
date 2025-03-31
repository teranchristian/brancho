import notificationHtml from '@content/html/notification.html';

export const showNotification = (branchName: string) => {
  // Remove the existing notification
  const existingNotification = document.getElementById("brancho-notification-container") as HTMLImageElement;
  if (existingNotification) {
    existingNotification.remove();
  }

  const container = document.createElement("div");
  container.id = 'brancho-notification-container'
  container.innerHTML = notificationHtml


  document.body.appendChild(container);

  const notification = container.querySelector("#brancho-extension-notification") as HTMLImageElement | null;
  if (!notification) {
    console.error('brancho: notification not found')
    return;
  }

  const iconElement = container.querySelector("#brancho-notification-icon") as HTMLImageElement | null;
  const iconUrl = chrome.runtime.getURL('img/brancho-icon.png');
  if (iconElement && iconUrl) {
    iconElement.src = iconUrl
  }
  const branchElement = container.querySelector("#brancho-branch-name") as HTMLImageElement;
  branchElement.innerText = branchName

  container.addEventListener("animationend", (event: AnimationEvent) => {
    if (event.animationName === "fadeOut") {
      container.remove();
    }
  });
}