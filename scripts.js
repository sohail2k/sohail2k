/// aws-session-expiry.js
(() => {
    'use strict';

    const getCookieExpiry = (cookieName) => {
        const cookies = document.cookie.split('; ');
        let cookieValue = null;

        // Search for the cookie
        cookies.forEach(cookie => {
            if (cookie.startsWith(`${cookieName}=`)) {
                cookieValue = cookie.split('=')[1];
                console.log('Cookie Found:', cookie);
            }
        });

        if (!cookieValue) {
            console.error(`Cookie "${cookieName}" not found.`);
            return null;
        }

        // Extract the Expires attribute by observing browser behavior
        // Example: "2024-11-20T22:38:02.788Z"
        const cookieExpiryTime = "2024-11-20T22:38:02.788Z"; // Replace this with the actual expiry time

        return new Date(cookieExpiryTime);
    };

    const formatTimeLeft = (timeLeftInSeconds) => {
        const hours = Math.floor(timeLeftInSeconds / 3600);
        const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
        const seconds = timeLeftInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const displaySessionExpiry = (expiry) => {
        if (!expiry) return;

        // Create a banner if it doesn't already exist
        let banner = document.getElementById('session-expiry-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'session-expiry-banner';
            banner.style.position = 'fixed';
            banner.style.bottom = '0';
            banner.style.left = '0';
            banner.style.backgroundColor = '#ffcc00';
            banner.style.color = '#000';
            banner.style.textAlign = 'left';
            banner.style.fontSize = '14px';
            banner.style.zIndex = '9999';
            banner.style.padding = '5px 10px';
            banner.style.borderTopRightRadius = '8px';
            banner.style.boxShadow = '2px -2px 5px rgba(0, 0, 0, 0.3)';
            banner.style.maxWidth = '400px'; // Limit the width to only what's necessary
            banner.style.wordWrap = 'break-word'; // Ensure text wraps if it exceeds the width
            document.body.appendChild(banner);
        }

        // Update the banner every 5 seconds
        const updateBanner = () => {
            const now = new Date();
            const timeLeftInSeconds = Math.max(0, Math.floor((expiry - now) / 1000)); // Time left in seconds

            if (timeLeftInSeconds > 0) {
                banner.textContent = `AWS Session Expires at ${expiry.toLocaleTimeString()} (${formatTimeLeft(timeLeftInSeconds)} remaining)`;
            } else {
                banner.textContent = `AWS Session has expired!`;
                clearInterval(timerInterval); // Stop the timer when the session expires
            }
        };

        updateBanner(); // Update immediately on load
        const timerInterval = setInterval(updateBanner, 1000); // Update every 5 seconds
    };

    // Name of the cookie holding the session token
    const cookieName = 'aws-signer-token_us-east-1';
    const sessionExpiry = getCookieExpiry(cookieName);

    if (sessionExpiry) {
        displaySessionExpiry(sessionExpiry);
    } else {
        console.error('Could not determine session expiry.');
    }
})();
