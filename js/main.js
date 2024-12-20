let deferredPrompt;

// window.addEventListener("beforeinstallprompt", (e) => {
//     e.preventDefault();
//     deferredPrompt = e;
//     document.getElementById("installPopup").style.display = "block";
// });

document.getElementById("installBtn").addEventListener("click", () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }
            deferredPrompt = null;
        });
    }
    document.getElementById("installPopup").style.display = "none";
});

document.getElementById("dismissBtn").addEventListener("click", () => {
    document.getElementById("installPopup").style.display = "none";
});
 
 //Service Worker 
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://server-room-monitor.netlify.app/service-worker.js')
    .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
    });
}

// Element
const batteryLevelElement = document.getElementById("battery-level");
const batteryPercentageElement = document.getElementById("battery-percentage");

function fetchBatteryPercent(){

    const apiUrl = 'https://api.thingspeak.com/channels/2733531/fields/6.json?api_key=EOLMMSM5C3LP7VA1&sort=desc&results=1';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const { field6: percent } = data.feeds[0];

            // // Calculate battery percentage based on voltage
            let batteryPercentage = percent;
            batteryPercentage = Math.min(Math.max(batteryPercentage, 0), 100);

            // Update battery indicator and percentage
            updateBatteryIndicator(batteryPercentage);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function updateBatteryIndicator(batteryPercentage) {
    batteryLevelElement.style.width = `${batteryPercentage}%`;
    batteryPercentageElement.textContent = `${batteryPercentage.toFixed(0)}%`;

    // Optionally, add more styling or color changes based on battery level
    if (batteryPercentage < 20) {
        batteryLevelElement.style.backgroundColor = "#e74c3c"; // Red color for low battery
    } else if (batteryPercentage < 50) {
        batteryLevelElement.style.backgroundColor = "#f39c12"; // Yellow for medium battery
    } else {
        batteryLevelElement.style.backgroundColor = "#2ecc71"; // Green for high battery
    }
}

fetchBatteryPercent();

// Fetch data every 10 seconds
setInterval(() => {
    fetchBatteryPercent();
}, 10000);