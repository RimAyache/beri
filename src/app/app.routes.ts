import { Routes } from '@angular/router';

import { StorefrontLayoutComponent } from './core/layout/storefront-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: StorefrontLayoutComponent,
    children: [
      { path: '', component: ProductsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: SignupComponent },
      { path: 'not-found', component: NotFoundComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{ path: '', component: AdminComponent }],
  },
  { path: '**', redirectTo: 'not-found' },
];
