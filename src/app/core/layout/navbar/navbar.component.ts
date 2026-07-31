import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly itemCount = this.cartService.itemCount;

  onSignOut(): void {
    this.authService.logout().subscribe();
  }

  onCartOpen(): void {
    this.cartService.closeMiniCart();
  }
}
