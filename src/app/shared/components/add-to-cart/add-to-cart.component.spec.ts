import { signal } from '@angular/core';
import { of } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../interfaces/product.interface';
import { AddToCartComponent } from './add-to-cart.component';

describe('AddToCartComponent', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A product used for testing',
    price: 10,
    category: 'test',
    image: '',
    rating: { rate: 0, count: 0 },
    available: true,
  };

  async function renderComponent(options: { loggedIn?: boolean; product?: Product } = {}) {
    const cartService = { addItem: jasmine.createSpy('addItem').and.returnValue(of({})) };
    const toastService = { show: jasmine.createSpy('show') };
    const authService = { isLoggedIn: signal(options.loggedIn ?? true) };

    await render(AddToCartComponent, {
      inputs: { product: options.product ?? mockProduct },
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: CartService, useValue: cartService },
        { provide: ToastService, useValue: toastService },
      ],
    });

    return { cartService, toastService };
  }

  it('should not show the add to cart control when the user is not logged in', async () => {
    await renderComponent({ loggedIn: false });
    expect(screen.queryByText('+')).toBeNull();
  });

  it('should show a collapsed + button when the user is logged in and no item is selected', async () => {
    await renderComponent();
    expect(screen.getByText('+')).toBeTruthy();
    expect(screen.queryByText('-')).toBeNull();
  });

  it('should expand to show the count and the - button when + is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('-')).toBeTruthy();
  });

  it('should increase the quantity when + is clicked again', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should send a POST request to the backend when + is clicked', async () => {
    const { cartService } = await renderComponent();
    fireEvent.click(screen.getByText('+'));
    expect(cartService.addItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('should remove the item and collapse back to + when - is clicked at quantity 1', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('-'));
    expect(screen.queryByText('-')).toBeNull();
    expect(screen.getByText('+')).toBeTruthy();
  });

  it('should show a toast and disable + when the maximum number of items is reached', async () => {
    const { toastService } = await renderComponent();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByText('+'));
    }
    expect(toastService.show).toHaveBeenCalled();
    expect((screen.getByText('+') as HTMLButtonElement).disabled).toBeTrue();
  });

  it('should show a toast and disable the button when the item is no longer available', async () => {
    const { toastService } = await renderComponent({ product: { ...mockProduct, available: false } });
    fireEvent.click(screen.getByText('+'));
    expect(toastService.show).toHaveBeenCalled();
    expect((screen.getByText('+') as HTMLButtonElement).disabled).toBeTrue();
  });
});
