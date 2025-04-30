import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { countryFlagGenerator } from '../../utils/country-flag-generator';
import { CountryPhoneCode } from '../../model/country';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { countriesPhoneCodeData } from '../store/country-phone-code-data';
import { countriesData } from '../store/country-data-store';
import { TField } from '../../model/field';

@Component({
  selector: 'app-countries-phone-code-selector-input',
  standalone: true,
  templateUrl: './countries-phone-code-selector-input.html',
  styleUrl: './countries-phone-code-selector-input.scss',
  imports: [MatAutocompleteModule, ReactiveFormsModule, AsyncPipe],
})
export class CountriesPhoneCodeSelectorInputComponent implements OnInit {
  @Input({ required: true }) countryCodeControle!: FormControl;
  @Input({ required: true }) isFormSubmited!: boolean;
  @Input({ required: true }) fieldData!: Omit<
    TField,
    'label' | 'validators' | 'errorMessage' | 'formControlName'
  > & { formControlName: FormControl };
  @Input() className: string = '';

  countriesOptions: CountryPhoneCode[] = countriesPhoneCodeData;
  filteredCountriesOptions!: Observable<CountryPhoneCode[]>;

  private isFocus = false;

  onFoucs() {
    this.isFocus = true;
  }

  onBlur() {
    this.isFocus = false;
  }

  get isValidToShowError() {
    const isFieldValid = this.countryCodeControle.valid === true;
    const isFieldToched = this.countryCodeControle.touched === true;

    return (
      (!isFieldValid && isFieldToched && !this.isFocus) ||
      (!isFieldValid && this.isFormSubmited && !this.isFocus)
    );
  }

  private _filter(value: string | null) {
    const filterValue = value?.toLowerCase() ?? '';

    return this.countriesOptions.filter((country) => {
      return country.phoneCode.toLowerCase().includes(filterValue);
    });
  }

  generateCountryFlag(countryCode: string) {
    const countryData = countriesData.find((c) => c.numeric === countryCode);

    if (!countryData) {
      return null;
    }

    return countryFlagGenerator(countryData);
  }

  ngOnInit(): void {
    const countryCodeField = this.countryCodeControle;

    if (!countryCodeField) {
      return;
    }

    this.filteredCountriesOptions = this.countryCodeControle.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }
}
