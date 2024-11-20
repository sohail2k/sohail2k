/// aws-session-expiry.js
(() => {
    'use strict';

    // Function to read the expiration time from the cookie
    const getAWSSessionExpiry = () => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            if (cookie.startsWith('aws-signer-token_us-east-1')) {
                const expiryTime = cookie.match(/Expires=([^;]+)/)?.[1];
                return expiryTime ? new Date(expiryTime) : null;
            }
        }
        return null;
    };

    // Function to display the expiry time
    const displaySessionExpiry = (expiry) => {
        if (!expiry) return;

        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.backgroundColor = '#ffcc00';
        banner.style.color = '#000';
        banner.style.textAlign = 'center';
        banner.style.fontSize = '16px';
        banner.style.zIndex = '9999';
        banner.style.padding = '5px';

        const timeLeft = Math.floor((expiry - new Date()) / 1000 / 60);
        banner.textContent = `AWS Session Expires at ${expiry.toLocaleTimeString()} (${timeLeft} minutes remaining)`;
        document.body.appendChild(banner);
    };

    // Call functions to handle the session expiry
    const sessionExpiry = getAWSSessionExpiry();
    if (sessionExpiry) {
        displaySessionExpiry(sessionExpiry);
    }
})();
