export interface CountryBase {
  numeric: string;
  name: string;
}

export interface Country extends CountryBase {
  alpha2: string;
  alpha3: string;
}

export interface CountryPhoneCode extends CountryBase {
  phoneCode: string;
  totalDigits: number;
}
