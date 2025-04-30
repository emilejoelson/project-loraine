import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, TIconName } from '../icon/icon.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  toasts: any[] = [];
  toastService = inject(ToastService);

  ngOnInit() {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  closeToast(toast: any) {
    this.toastService.removeToast(toast);
  }

  getIconName(icon: string): TIconName {
    const validIcons: TIconName[] = [
      'successIcon',
      'errorIcon',
      'infoIcon',
      'warningIcon',
    ];
    return validIcons.includes(icon as TIconName)
      ? (icon as TIconName)
      : 'infoIcon';
  }
}
