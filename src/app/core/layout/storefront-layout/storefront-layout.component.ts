import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { MiniCartComponent } from '../../../shared/components/mini-cart/mini-cart.component';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MiniCartComponent],
  templateUrl: './storefront-layout.component.html',
  styleUrl: './storefront-layout.component.css',
})
export class StorefrontLayoutComponent {}
