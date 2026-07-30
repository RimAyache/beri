import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);

  protected readonly user = this.authService.currentUser;

  protected readonly fullName = computed(() => {
    const name = [this.user?.firstName, this.user?.lastName].filter(Boolean).join(' ');
    return name || this.user?.username || '—';
  });

  protected readonly initials = computed(() => {
    const first = this.user?.firstName?.[0] ?? this.user?.username?.[0] ?? '?';
    const last = this.user?.lastName?.[0] ?? '';
    return `${first}${last}`.toUpperCase();
  });
}
