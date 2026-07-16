(function () {
  'use strict';

  var SEND_TO = 'AW-18106797178/tG61CLym4LocEPqY_7lD';

  function acceptedCategories() {
    try {
      if (typeof CookieConsent === 'undefined') return [];
      return CookieConsent.getUserPreferences().acceptedCategories || [];
    } catch (e) {
      return [];
    }
  }

  function hasAdsConsent() {
    return acceptedCategories().indexOf('ads') !== -1;
  }

  function hasAnalyticsConsent() {
    return acceptedCategories().indexOf('analytics') !== -1;
  }

  function trackPhoneClick() {
    if (typeof gtag !== 'function') return;

    // GA4-only event: fires with analytics consent, even if ads cookies are refused
    if (hasAnalyticsConsent()) {
      gtag('event', 'phone_click_ga4', {
        event_category: 'engagement',
        event_label: 'tel_click',
        method: 'phone'
      });
    }

    // Google Ads conversion + lead: still gated on ads consent (unchanged)
    if (!hasAdsConsent()) return;
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

  function showFormSuccess() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('ok') !== '1') return;
    var ok = document.getElementById('richiamata-ok');
    if (ok) ok.hidden = false;
    var form = document.querySelector('form[name="richiamata"]');
    if (form) {
      form.querySelectorAll('input, button[type="submit"]').forEach(function (el) {
        if (el.type === 'hidden' || el.name === 'bot-field') return;
        if (el.type === 'submit') el.style.display = 'none';
        else el.disabled = true;
      });
    }
    var hash = (window.location.hash || '').replace(/^#/, '');
    var target =
      (hash && document.getElementById(hash)) ||
      document.getElementById('richiamata') ||
      document.getElementById('contatti') ||
      document.querySelector('.contact2');
    if (target) {
      try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { target.scrollIntoView(true); }
    }
  }

  function initTracking() {
    bindTelLinks();
    bindForms();
    showFormSuccess();
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
      if (ads || analytics) initTracking();
    };
  });
})();
