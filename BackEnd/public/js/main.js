function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/*
Public key are send from server side to frontend and are set as "data-pub-key" attribute of button.
However, we can even expose it, but I prefer to keep it this way.
You can also generate the public & private key pair by running './node_modules/.bin/web-push generate-vapid-keys' 
on terminal or cmd.
*/
const publicVapidKey = $('#send-notification-button').attr('data-pub-key')

async function triggerPushNotification() {
  if ("serviceWorker" in navigator) {
    const registerServiceworker = await navigator.serviceWorker.register("/js/sw.js", {
      scope: "/js/",
    });
    const subscribe = await registerServiceworker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    await fetch("/send-notification", {
      method: "POST",
      body: JSON.stringify(subscribe),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    console.error("Service workers are not supported in this browser");
  }
}

$("#send-notification-button").on("click", () => {
  triggerPushNotification();
});
