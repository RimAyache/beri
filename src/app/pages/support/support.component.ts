import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { config } from '../../shared/config';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-support',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  private readonly authService = inject(AuthService);

  protected readonly support = config.support;

  protected readonly submitted = signal(false);
  protected readonly messageSent = signal(false);

  protected readonly supportForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl(this.authService.currentUser?.email ?? '', [
      Validators.required,
      Validators.email,
    ]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  protected sendMessage(): void {
    this.submitted.set(true);

    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    const { name, email, subject, message } = this.supportForm.getRawValue();
    const body = `${message}\n\n—\n${name} (${email})`;
    const query = `subject=${encodeURIComponent(subject ?? '')}&body=${encodeURIComponent(body)}`;

    window.location.href = `mailto:${this.support.email}?${query}`;
    this.messageSent.set(true);
  }

  protected writeAnother(): void {
    this.supportForm.reset({ email: this.authService.currentUser?.email ?? '' });
    this.submitted.set(false);
    this.messageSent.set(false);
  }
}
