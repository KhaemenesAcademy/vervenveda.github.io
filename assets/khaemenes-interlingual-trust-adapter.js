/* VNV Wave 05 — Interlingual browser trust boundary (inactive candidate).
 * A legacy verified bit in origin-local storage is not publisher/STOS authority.
 * This adapter does not change the source library, mutate user data, or do I/O.
 * Opt-in: public HTML must explicitly load it and use the normalized API.
 */
(function(root){"use strict";
  function interpret(value) {
    if(!value || typeof value!=="object" || typeof value.translation!=="string" || !value.translation.trim())return null;
    const source=typeof value.source==="string"?value.source:"unknown";
    const personal=source==="sovereign-local-reviewed" || source==="user-reviewed-local";
    const identity=source==="same-language";
    const classification=personal?"origin-local-user-review":identity?"same-language-identity":"unverified-source";
    return Object.freeze({
      translation:value.translation,
      source,
      sourceStatus:typeof value.status==="string"?value.status:"unclassified",
      reviewScope:classification,
      locallyReviewed:personal,
      publisherReviewed:false,
      sovereignApproved:false,
      verified:false,
      authoritative:false
    });
  }
  function lookup({from="en",to="es",text=""}={}) {
    const original=root.KhaemenesSovereignTranslate?.lookupLocal;
    if(typeof original!=="function")return null;
    try {return interpret(original({from,to,text}));}catch{return null;}
  }
  root.KhaemenesInterlingualTrust=Object.freeze({
    version:"1.0-audit-candidate",
    interpret,lookup,
    scope:"browser-presentation-only",
    sovereignAuthority:false
  });
})(window);
