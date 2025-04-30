import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-radio-button',
  imports: [ReactiveFormsModule],
  templateUrl: './custom-radio-button.component.html',
  styleUrl: './custom-radio-button.component.scss'
})

export class CustomRadioButtonComponent implements OnChanges {
  @Input() formGroup!: FormGroup;
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) value: string = '';
  @Input({ required: true }) classInput: string = '';
  @Input({ required: true }) classLabel: string = '';
  @Input({ required: true }) classOption: string = '';
  @Input() title: string = '';
  @Input() isSelected: boolean = false;
  @Output() onSelect = new EventEmitter<void>();

  private currentLabelClass: string = '';

  handleClick() {
    if (!this.isSelected) {  // Only emit if not already selected
      this.onSelect.emit();
    }
  }

  getLabelClass(): string {
    // Cache the class string to avoid recalculations
    if (this.currentLabelClass === '') {
      this.currentLabelClass = `${this.classLabel} ${this.isSelected ? 'bg-[#362E75] text-white' : 'bg-gray-100 text-[#362E75]'}`;
    }
    return this.currentLabelClass;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSelected']) {
      this.currentLabelClass = '';
    }
  }
}
