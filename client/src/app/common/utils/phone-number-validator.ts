import { countriesPhoneCodeData } from '../components/store/country-phone-code-data';

export function validatePhoneNumber(
  phoneNumber: string,
  countryName: string,
): boolean {
  const country = countriesPhoneCodeData.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase(),
  );

  if (!country) {
    /* console.error(`Country "${countryName}" not found.`); */
    return false;
  }

  // Remove non-digit characters from the phone number
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the phone number starts with the country's phone code
  const phoneCodeWithoutPlus = country.phoneCode.slice(1);
  if (!cleanedPhoneNumber.startsWith(phoneCodeWithoutPlus)) {
    /* console.error( */
    /*   `Phone number "${phoneNumber}" does not start with the country code "${phoneCodeWithoutPlus}" for ${countryName}.`, */
    /* ); */
    return false;
  }

  // Check if the phone number has the correct total digits
  const phoneNumberWithoutCode = cleanedPhoneNumber.slice(
    phoneCodeWithoutPlus.length,
  );
  if (phoneNumberWithoutCode.length !== country.totalDigits) {
    /* console.error( */
    /*   `Phone number "${phoneNumber}" does not have ${country.totalDigits} digits (excluding country code) for ${countryName}.`, */
    /* ); */
    return false;
  }

  return true;
}
