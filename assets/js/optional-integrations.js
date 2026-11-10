/* Optional integrations entry point. No third-party scripts are loaded by default.
   Add a consent-aware analytics integration here only after configuring the
   measurement ID and the site's privacy/consent requirements. */
(()=>{'use strict';
const config=window.UNICODEFIX_CONFIG||{};
if(!config.analyticsMeasurementId||!window.UNICODEFIX_CONSENT||window.UNICODEFIX_CONSENT.analytics!==true)return;
// Analytics integration intentionally left unconfigured until the owner supplies
// the GA4 measurement ID and confirms the applicable consent setup.
})();
