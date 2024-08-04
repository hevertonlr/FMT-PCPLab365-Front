import { Component } from '@angular/core';
import { AlertComponent } from 'app/shared/components/alert/alert.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
