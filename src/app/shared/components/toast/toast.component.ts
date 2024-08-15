import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle,
  heroExclamationCircle,
  heroExclamationTriangle,
  heroXCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { Toast } from 'app/shared/interfaces/toast';
import { ToastService } from 'app/shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  providers: [
    provideIcons({
      heroExclamationTriangle,
      heroXCircle,
      heroCheckCircle,
      heroExclamationCircle,
      heroXMark,
    }),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];

  private toastSubscription: Subscription;
  private toastsUpdatedSubscription: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSubscription = this.toastService.toastState.subscribe(
      (toast: Toast) => {
        this.toasts = this.toastService.getToasts();
        setTimeout(() => this.removeToast(toast), 5000);
      },
    );
    this.toastsUpdatedSubscription = this.toastService.toastsUpdated.subscribe(
      (updatedToasts: Toast[]) => {
        this.toasts = updatedToasts;
      },
    );
  }

  ngOnDestroy() {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.toastsUpdatedSubscription) {
      this.toastsUpdatedSubscription.unsubscribe();
    }
  }

  removeToast = (toast: Toast) => this.toastService.removeToast(toast);
}
