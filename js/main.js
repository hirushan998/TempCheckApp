 //Service Worker 
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://eloquent-cactus-989093.netlify.app/service-worker.js')
    .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
    });
}