import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertService } from 'app/shared/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}

  get icon(): string {
    return `assets/images/alerts.svg#${this.alertService.type}`;
  }

  closeAlert = () => this.alertService.hideAlert();
  opactity = () => (this.alertService.show ? 'opacity-100' : 'opacity-0');
}
