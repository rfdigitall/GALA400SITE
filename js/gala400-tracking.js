(function () {
  'use strict';

  var SEND_TO = 'AW-18106797178/tG61CLym4LocEPqY_7lD';

  function hasAdsConsent() {
    try {
      if (typeof CookieConsent === 'undefined') return false;
      var accepted = CookieConsent.getUserPreferences().acceptedCategories || [];
      return accepted.indexOf('ads') !== -1;
    } catch (e) {
      return false;
    }
  }

  function trackPhoneClick() {
    if (!hasAdsConsent() || typeof gtag !== 'function') return;
    gtag('event', 'conversion', { send_to: SEND_TO });
    gtag('event', 'generate_lead', { method: 'phone' });
  }

  function trackLead(source) {
    if (!hasAdsConsent() || typeof gtag !== 'function') return;
    gtag('event', 'generate_lead', { method: source || 'form' });
  }

  function bindTelLinks(root) {
    (root || document).querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      if (link.__gala400TelBound) return;
      link.__gala400TelBound = true;
      link.addEventListener('click', trackPhoneClick);
    });
  }

  function bindForms(root) {
    (root || document).querySelectorAll('form[data-ads-track]').forEach(function (form) {
      if (form.__gala400FormBound) return;
      form.__gala400FormBound = true;
      form.addEventListener('submit', function () {
        trackLead(form.getAttribute('data-ads-track') || 'form');
      });
    });
  }

  function initTracking() {
    bindTelLinks();
    bindForms();
  }

  window.gtag_report_conversion = function (url) {
    trackPhoneClick();
    if (typeof url !== 'undefined') window.location.href = url;
    return false;
  };

  document.addEventListener('DOMContentLoaded', function () {
    initTracking();

    var orig = window.gala400UpdateConsent;
    window.gala400UpdateConsent = function (analytics, ads) {
      if (typeof orig === 'function') orig(analytics, ads);
      if (ads) initTracking();
    };
  });
})();
