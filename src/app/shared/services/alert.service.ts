import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  show: boolean = false;
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  message: string = '';
  errors: string[] = [];

  showAlert(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    errors: string[] = [],
  ): void {
    this.type = type;
    this.message = message;
    this.errors = errors;
    this.show = true;
  }

  hideAlert = () => {
    this.show = false;
  };
}
