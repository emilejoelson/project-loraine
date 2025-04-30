import { countriesData } from '../components/store/country-data-store';
import { Country } from '../model/country';

export function countryFlagGenerator(countryData: Country): string | null {
  let country: Country | undefined;

  if (countryData.numeric.length) {
    country = countriesData.find((c) => c.numeric === countryData.numeric);
    if (country) {
      return country.numeric + '.svg';
    }
  }

  if (countryData.alpha2.length) {
    country = countriesData.find((c) => c.alpha2 === countryData.alpha2);
    if (country) {
      return country.alpha2 + '.svg';
    }
  }

  if (countryData.alpha3.length) {
    country = countriesData.find((c) => c.alpha3 === countryData.alpha3);
    if (country) {
      return country.alpha3 + '.svg';
    }
  }

  return null;
}
