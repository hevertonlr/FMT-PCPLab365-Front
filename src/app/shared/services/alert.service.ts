import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  show: boolean = false;
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  message: string = '';
  errors: string[] = [];
  alertShown = new EventEmitter<void>();

  showAlert(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    errors: string[] = [],
  ): void {
    this.type = type;
    this.message = message;
    this.errors = errors;
    this.show = true;
    this.alertShown.emit();
  }

  hideAlert = () => {
    this.show = false;
  };
}
