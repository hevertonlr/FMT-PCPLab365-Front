import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../interfaces/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  private toastSubject = new Subject<Toast>();
  toastState = this.toastSubject.asObservable();
  private toasts: Toast[] = [];
  toastsUpdated: EventEmitter<Toast[]> = new EventEmitter();

  showToast(type: string, title: string, message: string) {
    if (this.toasts.length >= 5) {
      this.removeToast(this.toasts[0]);
      //this.toasts.shift();
    }
    const icon = this.icon();
    let toast: Toast = {
      type,
      title,
      message,
      icon,
      enter: true,
      leave: false,
      show: true,
    };
    this.toasts.push(toast);
    this.toastSubject.next(toast);
    this.toastsUpdated.emit(this.toasts);
  }
  removeToast(toast: Toast) {
    toast.leave = true;
    setTimeout(() => {
      toast.show = false;
      this.toasts = this.toasts.filter((t) => t !== toast);
      this.toastsUpdated.emit(this.toasts);
    }, 300);
  }

  getToasts = (): Toast[] => this.toasts;
  private icon(): string {
    switch (this.type) {
      case 'success':
        return 'heroCheckCircle';
      case 'error':
        return 'heroXCircle';
      case 'warning':
        return 'heroExclamationTriangle';
      case 'info':
        return 'heroExclamationCircle';
      default:
        return '';
    }
  }
}
