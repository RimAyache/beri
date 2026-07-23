import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { AddToCartComponent } from './add-to-cart.component';


describe('AddToCartComponent', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A product used for testing',
  };
  
  const mockauthService = {
    isLoggedIn: {subscribe: (callback: (value: boolean) => void) => {
      callback(true); 
      return { unsubscribe() {} }; 
    },
  };
}

  it ('should not be created if user is not logged in', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        expect(screen.getByText('Please log in to add items to your cart.')).toBeTruthy();
        expect(screen.getByText('Add to Cart')).toBeNull();
      }
    }
  }

  it ('should create the component if user is logged in', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        expect(screen.getByText('Add to Cart')).toBeTruthy();
      }
    }
  }

  it ('should not show add to cart if user is not logged in', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        expect(screen.getByText('Add to Cart')).toBeNull();
      }
    }
  }

  it ('should decrease the quantity when - is clicked', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        const previousQuantity = screen.quantity;
        const decrementButton = screen.getByText('-');
        fireEvent.click(decrementButton);
        expect(screen.quantity).toBe(previousQuantity - 1);
      }
    }
  }

  it ('should remove the item from the cart and show + when quantity is 1 and - is clicked', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        if (screen.quantity === 1) {
          const decrementButton = screen.getByText('-');
          fireEvent.click(decrementButton);
          expect(screen.getByText('+')).toBeTruthy();
          expect(screen.getByText('0')).toBeTruthy();
          expect(screen.getByText('Add to Cart')).toBeTruthy();
        }
      }
    }
  }

  it ('should increase the quantity when + is clicked', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        if (screen.quantity  >= 1) {
        const previousQuantity = screen.quantity;
        const incrementButton = screen.getByText('+');
        fireEvent.click(incrementButton);
        expect(screen.quantity).toBe(previousQuantity+1);
      }
    }
    }
  }

  it (' should not be available when the product is not available', () => {
    mockauthService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        if (!mockProduct.available) {
          expect(screen.getByText('Add to Cart')).toBeNull();
          expect(screen.getByText('Out of Stock')).toBeTruthy();
        }
      }
    }
  }

});



  
    