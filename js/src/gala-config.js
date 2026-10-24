/* ===================================================================
   GALA 400 — SINGLE CONFIG SPOT (hours, phone, conversion labels).
   scripts/bip_build.py reads this file and writes the same values into
   the static HTML (visible text + schema.org), then the browser keeps
   [data-hours] spans in sync. Change here -> re-run the build.
   Hours confirmed by client via RF DIGITAL on 24/10/2026: 08:00-24:00 daily (schema/GBP).
   Visible wording (t38u, 24/10/2026): "Aperti 7 giorni su 7" - no visible clock hours.
   =================================================================== */
window.GALA_CONFIG = {
  "hoursShort": "7 giorni su 7",
  "hoursLong": "Aperti 7 giorni su 7, anche sabato e domenica",
  "hoursPhrase": "7 giorni su 7, anche sabato e domenica",
  "opens": "08:00",
  "closes": "23:59",
  "phoneDisplay": "349 420 8551",
  "phoneE164": "+393494208551",
  "adsId": "AW-18106797178",
  "callConversion": "AW-18106797178/BHIeCLvLzdIcEPqY_7lD",
  "telClickConversion": "AW-18106797178/tG61CLym4LocEPqY_7lD",
  "ga4Id": "G-TLQ5WCBTJK",
  "cityFallbackA": "nella tua zona",
  "cityFallbackName": "in zona"
};
