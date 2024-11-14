 //Service Worker 
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/realtime/service-worker.js')
    .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
    });
}