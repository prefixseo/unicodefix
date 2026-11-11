/**
 * Load Google Tag Manager after the visitor's first meaningful interaction.
 * The GTM container is initialized at most once per page.
 */
(function () {
    'use strict';

    var containerId = 'GTM-5T9S3T7Z';
    var loaded = false;
    var events = ['mousemove', 'touchstart', 'scroll', 'keydown'];

    function loadTagManager() {
        if (loaded) return;
        loaded = true;

        events.forEach(function (eventName) {
            window.removeEventListener(eventName, loadTagManager);
        });

        // Avoid duplicate container injection if another integration added it.
        if (document.querySelector('script[data-unicodefix-gtm]')) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(containerId);
        script.setAttribute('data-unicodefix-gtm', 'true');
        document.head.appendChild(script);
    }

    events.forEach(function (eventName) {
        window.addEventListener(eventName, loadTagManager, {
            once: true,
            passive: true
        });
    });
})();
