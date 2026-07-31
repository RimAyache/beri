import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { config } from '../../shared/config';
import { AuthService } from '../../shared/services/auth.service';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  signupForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(config.auth.minPasswordLength),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator },
  );

  submitted = signal(false);
  registerError = signal<string | null>(null);

  onSubmit(): void {
    this.registerError.set(null);
    this.submitted.set(true);

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, username, email, password } = this.signupForm.getRawValue();
    this.authService
      .register({
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        username: username ?? '',
        email: email ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error: HttpErrorResponse) => this.registerError.set(this.extractErrorMessage(error)),
      });
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const body = error.error;

    if (Array.isArray(body?.errors) && body.errors.length > 0) {
      return body.errors.join(' ');
    }

    if (typeof body?.message === 'string') {
      return body.message;
    }

    return 'Something went wrong creating your account. Please try again.';
  }
}
