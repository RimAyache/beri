# Admin Orders Grid

Adds a dedicated **Orders** page under `/admin/orders`, mirroring the existing
**Products** admin page: a full-page ag-grid table instead of the small plain-HTML
"Latest Orders" list that stays on the dashboard.

## Files added

| File | Purpose |
|---|---|
| `src/app/pages/admin/orders/admin-orders.component.ts` | Page component: ag-grid setup, column defs, loads rows via `OrderService.getOrders()` |
| `src/app/pages/admin/orders/admin-orders.component.html` | Template — single `<ag-grid-angular>` bound to signals |
| `src/app/pages/admin/orders/admin-orders.component.css` | Sizes the grid to fill the viewport (`calc(100vh - 4rem)`) |
| `src/app/pages/admin/orders/cell-renderers/order-status-chip-renderer.component.ts` | ag-grid cell renderer for the `Status` column |
| `src/app/pages/admin/orders/cell-renderers/order-status-chip-renderer.component.html` | Chip template |
| `src/app/pages/admin/orders/cell-renderers/order-status-chip-renderer.component.css` | Chip colors per status (green/amber/red) |

## Files changed

| File | Change |
|---|---|
| `src/app/services/order.ts` | Added `getOrders(): Observable<Order[]>` — returns the full mock order list (`getRecentOrders()` still exists separately for the dashboard's top-N view) |
| `src/app/app.routes.ts` | Added child route `{ path: 'orders', loadComponent: () => import('./pages/admin/orders/admin-orders.component')... }` under `admin` |
| `src/app/core/layout/admin-layout.component.html` | Added a third sidebar nav link (`routerLink="/admin/orders"`, receipt icon) between Products and the "back to store" exit link |

## How it works

- **Grid setup** follows the same pattern as `admin-products.component.ts`: registers
  `AllCommunityModule` via `ModuleRegistry` at module scope, uses a `themeQuartz` instance
  with the same brand colors/fonts as Products, and drives `rowData` through a signal
  (`rowData = signal<OrderRow[]>([])`) rather than the imperative grid API — required
  because the app is zoneless (`provideZonelessChangeDetection()`).
- **Row shape**: a local `OrderRow` view-model (`Id, Customer, Date, Total, Status`) is
  mapped from the `Order` domain model (`src/app/models/order.model.ts`) via a `toRow()`
  function, same convention as `ProductRow`/`toRow(product)` in the Products page.
- **Columns**:
  - `Id` → "Order" header, narrow fixed width
  - `Customer` → flex
  - `Date` → narrow fixed width
  - `Total` → formatted as USD currency via `Intl.NumberFormat`
  - `Status` → rendered by `OrderStatusChipRenderer`, a small `ICellRendererAngularComp`
    that colors the chip green/amber/red for `Completed` / `Pending` / `Cancelled`
- **Pagination**: enabled, 10 rows/page (same defaults as Products).
- **No editing or delete**: unlike Products (which has an editable `Description` column
  and a delete-button renderer), the Orders grid is currently **read-only** — there's no
  backend endpoint to update or delete an order, so nothing is wired for it. (See
  memory: `academy-api` backend is auth-only — no order endpoints exist yet.)
- **Data source**: still the same in-memory `MOCK_ORDERS` array in `OrderService` that
  already backed the dashboard's "Latest Orders" table — no backend changes were made.

## Verification performed

- `npx tsc --noEmit -p tsconfig.app.json` — no type errors.
- Ran `ng serve` and loaded `http://localhost:4200/admin/orders` in a real browser:
  confirmed sortable/filterable columns, currency formatting, colored status chips,
  working pagination footer, and the new active "Orders" sidebar icon.

## Possible follow-ups (not done — out of scope for this change)

- Wire `getOrders()` to a real backend endpoint once one exists.
- Add order status updates / cancellation from the grid (would need a backend endpoint
  and a cell renderer or editable `Status` column, similar to Products' delete button).
- Add a details/drill-down view per order (the `Order` model has no line items yet).
