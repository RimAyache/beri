import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { config } from '../../config';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;

  protected readonly shipping = computed(() =>
    this.subtotal() >= config.cart.freeShippingThreshold ? 0 : config.cart.shippingFee,
  );
  protected readonly total = computed(() => this.subtotal() + this.shipping());

  protected readonly submitted = signal(false);
  protected readonly orderPlaced = signal(false);

  checkoutForm = new FormGroup({
    contact: new FormGroup({
      email: new FormControl(this.authService.currentUser?.email ?? '', [
        Validators.required,
        Validators.email,
      ]),
    }),
    delivery: new FormGroup({
      country: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      saveInfo: new FormControl(false),
    }),
    payment: new FormGroup({
      cardType: new FormControl('Visa', [Validators.required]),
      cardNumber: new FormControl('', [Validators.required]),
      expiry: new FormControl('', [Validators.required]),
      cvv: new FormControl('', [Validators.required]),
      holderName: new FormControl('', [Validators.required]),
      saveInfo: new FormControl(false),
    }),
  });

  payNow(): void {
    this.submitted.set(true);

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.cartService.clearCart();
    this.orderPlaced.set(true);
  }

  continueShopping(): void {
    this.router.navigate(['/shop']);
  }
}
