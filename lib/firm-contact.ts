export const FIRM_CONTACT_EMAIL = "kinsleyadvocates@gmail.com";
export const FIRM_CONTACT_PHONE = "+254 704 561 831";
export const FIRM_WEBSITE_URL = "https://www.kinsleyadvocates.com";
export const FIRM_WEBSITE_LABEL = "www.kinsleyadvocates.com";

export function getFirmPhoneHref() {
  return `tel:${FIRM_CONTACT_PHONE.replace(/\s+/g, "")}`;
}

export function getFirmMailtoHref() {
  return `mailto:${FIRM_CONTACT_EMAIL}`;
}
