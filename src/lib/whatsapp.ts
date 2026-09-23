const TAJIK_COUNTRY_CODE = "992";
const TAJIK_LOCAL_NUMBER_LENGTH = 9; // e.g. 981533003, without the 992 country code

export function buildWhatsAppUrl(phone: string, message: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === TAJIK_LOCAL_NUMBER_LENGTH) {
    digits = TAJIK_COUNTRY_CODE + digits;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
