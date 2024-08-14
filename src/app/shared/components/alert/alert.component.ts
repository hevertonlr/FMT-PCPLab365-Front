import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import {
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
  heroExclamationTriangleSolid,
  heroXCircleSolid,
} from '@ng-icons/heroicons/solid';
import { AlertService } from 'app/shared/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  providers: [
    provideIcons({
      heroExclamationTriangleSolid,
      heroXCircleSolid,
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
      heroXMark,
    }),
  ],
})
export class AlertComponent implements OnInit, OnDestroy {
  private autoCloseTimer: any;
  constructor(public alertService: AlertService) {}
  ngOnDestroy(): void {
    this.clearAutoCloseTimer();
  }

  ngOnInit(): void {
    this.alertService.alertShown.subscribe(() => this.startAutoCloseTimer());
  }

  get icon(): string {
    switch (this.alertService.type) {
      case 'success':
        return 'heroCheckCircleSolid';
      case 'error':
        return 'heroXCircleSolid';
      case 'warning':
        return 'heroExclamationTriangleSolid';
      case 'info':
        return 'heroExclamationCircleSolid';
      default:
        return '';
    }
  }

  closeAlert = () => this.alertService.hideAlert();
  opactity = () => (this.alertService.show ? 'opacity-100' : 'opacity-0 ');
  startAutoCloseTimer = () =>
    (this.autoCloseTimer = setTimeout(() => {
      this.closeAlert();
    }, 5000));
  clearAutoCloseTimer = () => {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  };
}
