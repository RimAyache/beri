import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../../components/layout/navbar/navbar.component';
import { FooterComponent } from '../../components/layout/footer/footer.component';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './storefront-layout.component.html',
  styleUrl: './storefront-layout.component.css',
})
export class StorefrontLayoutComponent {}
