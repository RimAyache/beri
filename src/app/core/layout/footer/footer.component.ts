import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Authservice } from '../../../core/auth/authentication.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly authService = inject(Authservice);

  readonly isLoggedIn = this.authService.isLoggedIn;

  onSignOut(): void {
    this.authService.logout().subscribe();
  }
}
