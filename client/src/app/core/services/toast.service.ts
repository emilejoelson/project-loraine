import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TIconName } from '../../shared/ui/icon/icon.component';


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<any[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  createToast(type: string, text: string): void {
    const iconMap: Record<string, TIconName> = {
      success: 'successIcon',
      error: 'errorIcon',
      warning: 'warningIcon',
      info: 'infoIcon',
    };
    const icon: TIconName = iconMap[type] || 'infoIcon';
    const toast = { type, text, icon };
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);
    setTimeout(() => this.removeToast(toast), 60000);
  }

  removeToast(toast: any): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter((t) => t !== toast);
    this.toastsSubject.next(updatedToasts);
  }
}
