import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { countryFlagGenerator } from '../../utils/country-flag-generator';
import { Country } from '../../model/country';
import { Observable, map, startWith } from 'rxjs';
import { countriesData } from '../store/country-data-store';
import { AsyncPipe } from '@angular/common';
import { TField } from '../../model/field';

@Component({
  selector: 'app-countries-selector-input',
  standalone: true,
  templateUrl: './countries-selector-input.html',
  styleUrl: './countries-selector-input.scss',
  imports: [MatAutocompleteModule, ReactiveFormsModule, AsyncPipe],
})
export class CountriesSelectorInputComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) fieldData!: TField;
  @Input({ required: true }) isFormSubmited!: boolean;
  @Input() className: string = '';

  countriesOptions: Country[] = countriesData;
  filteredCountriesOptions!: Observable<Country[]>;

  private isFocus = false;

  onFoucs() {
    this.isFocus = true;
  }

  onBlur() {
    this.isFocus = false;
  }

  get isValidToShowError() {
    const isFieldValid =
      this.formGroup.get(this.fieldData.formControlName)?.valid === true;
    const isFieldToched =
      this.formGroup.get(this.fieldData.formControlName)?.touched === true;

    return (
      (!isFieldValid && isFieldToched && !this.isFocus) ||
      (!isFieldValid && this.isFormSubmited && !this.isFocus)
    );
  }

  generateCountryFlag(country: Country) {
    return countryFlagGenerator(country);
  }

  ngOnInit(): void {
    const countryField = this.formGroup.get('countryField');

    if (!countryField) {
      return;
    }

    this.filteredCountriesOptions = countryField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.countriesOptions.filter((country) => {
      return country.name.toLowerCase().includes(filterValue);
    });
  }
}
