import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="access-denied-container">
      <h1>Access Denied</h1>
      <p>Sorry, you don't have permission to access this page.</p>
      <p>This area requires administrator privileges.</p>
      <button (click)="goBack()">Go Back</button>
    </div>
  `,
  styles: [
    `
      .access-denied-container {
        text-align: center;
        padding: 50px 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      h1 {
        color: #d32f2f;
        margin-bottom: 20px;
      }
      button {
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #303f9f;
      }
    `,
  ],
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }
}
