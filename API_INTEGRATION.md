# RentNest API Integration

This document maps the backend endpoints actually consumed by the RentNest frontend. Endpoints are relative to `BACKEND_URL`, except for the explicitly noted browser-side category fallback, which uses `NEXT_PUBLIC_BACKEND_URL`.

API helpers generally return `{ ok, status, data, message? }`. Protected helpers read the HttpOnly `accessToken` cookie on the server and forward it as `Authorization: Bearer <token>`.

## Authentication APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Login | `/login` | `loginForm` → `loginAction` → `login` | POST | `/api/auth/login` | Public | Default fetch behavior | Validate credentials and return the access token and user used by the login action. |
| Registration | `/register` | `registerForm` → `registerAction` → `register` | POST | `/api/auth/register` | Public | Default fetch behavior | Create a tenant or landlord account from validated registration data. |
| Current user | Global `AuthProvider`; `/properties`; `/dashboard/profile` | `getCurrentUserAction` → `getCurrentUser` | GET | `/api/auth/me` | Bearer token | `cache: "no-store"` | Load the authenticated account for context, role-aware UI, and profile display. |

Login and registration API helpers catch network/configuration errors and safely parse JSON. Their Server Actions validate form data with Zod and return user-facing messages. The current-user helper returns a 401-style result when no cookie is present, while `AuthProvider` falls back to `user: null`.

## Public Property APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Property listing | `/`, `/properties` | `HomePage`/`PropertiesPage` → `propertyAction` → `getProperty` | GET | `/api/properties` | Public | `next.revalidate: 60` | Load public property cards, counts, search, and filter data. |
| Property details | `/properties/[id]`; landlord edit routes | `getPropertyByIdAction` → `getPropertyById` | GET | `/api/properties/:id` | Public | `next.revalidate: 60` | Load one property's details and prefill landlord editing when applicable. |
| Public categories | Landlord create/edit routes | `getCategoriesAction` → `getCategories` | GET | `/api/categories` | Public | `next.revalidate: 300` | Populate property category selection. |
| Browser category fallback | Landlord property create/edit forms | `PropertyCreateForm`, `PropertyEditForm` | GET | `/api/categories` | Public | Browser default fetch behavior | Retry category loading directly from `NEXT_PUBLIC_BACKEND_URL` when the Server Action returns no categories. |

Property actions normalize missing listing payloads to empty arrays and return structured errors. Detail actions validate IDs with Zod. Pages display empty or unavailable states when data cannot be loaded.

## Tenant APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Tenant rentals | `/dashboard/tenant`, `/dashboard/tenant/payments`; admin dashboard supplementary data | `getRentalRequest` | GET | `/api/rentals` | Bearer token | `cache: "no-store"` | Load the authenticated tenant's rental requests and statuses. |
| Rental detail | `/dashboard/tenant/requests/[id]/pay`; payment verification enrichment | `getRentalRequestById` | GET | `/api/rentals/:id` | Bearer token | `cache: "no-store"` | Load the rental selected for payment and refresh its latest state after verification. |
| Submit rental request | `/properties/[id]` | `RentModal` → `createRentalAction` → `createRentalRequest` | POST | `/api/rentals` | Bearer token; tenant UI restriction | `cache: "no-store"` | Submit validated property, start-date, and end-date data. |

Tenant pages normalize missing rentals to empty arrays. Rental creation uses Zod validation and Sonner success/error notifications.

## Payment APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Payment history | `/dashboard/tenant`, `/dashboard/tenant/payments` | `getPaymentHistory` | GET | `/api/payments` | Bearer token | `cache: "no-store"` | Load the tenant's completed and recorded payments. |
| Create checkout session | `/dashboard/tenant/requests/[id]/pay` | `PaymentPageClient` → `handleCreateCheckoutSessionAction` → `createCheckoutSession` | POST | `/api/payments/create` | Bearer token | `cache: "no-store"` | Send a validated rental request ID and receive a Stripe Hosted Checkout URL. |
| Verify checkout session | `/dashboard/tenant/payments/success` | `PaymentSuccessClient` → `handleVerifyPaymentSessionAction` → `verifyPaymentSession` | GET | `/api/payments/verify/:sessionId` | Bearer token | `cache: "no-store"` | Verify the returned Stripe session and display payment status and receipt data. |

Payment actions validate rental request and session IDs with Zod. The checkout page handles missing URLs and API failures with toasts. The success page retries verification up to five times at two-second intervals for pending/processing states, renders a retryable error state, and fetches current rental details after successful verification when a rental request ID is returned.

## Review APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Property reviews | `/dashboard/tenant` review modal | `LeaveReviewModal` → `handleGetPropertyReviewsAction` → `getPropertyReviews` | GET | `/api/reviews/property/:propertyId` | Public | `next.revalidate: 60` | Load existing property reviews before presenting review submission state. |
| Submit review | `/dashboard/tenant` | `TenantDashboardClient` → `handleCreateReviewAction` → `createReview` | POST | `/api/reviews` | Bearer token | `cache: "no-store"` | Submit a validated rating, comment, and property ID. |

Review actions validate IDs and review payloads with Zod. The tenant UI reports submission success and backend/network errors through Sonner.

## Landlord APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Landlord properties | `/dashboard/landlord`, `/dashboard/landlord/properties` | `getMyPropertiesAction` → `getMyProperties` | GET | `/api/landlord/properties` | Bearer token | `cache: "force-cache"`; tag `landlord-properties` | Load listings owned by the authenticated landlord. |
| Incoming requests | `/dashboard/landlord`, `/dashboard/landlord/requests` | `getIncomingRequestsAction` → `getRentalRequestForLandlord` | GET | `/api/landlord/requests` | Bearer token | `cache: "force-cache"`; tag `landlord-requests` | Load rental requests for the landlord's properties. |
| Approve/reject request | `/dashboard/landlord/requests` | `RequestListTable` → `handleRequestAction` → `handleAcceptOrRejectRequest` | PATCH | `/api/landlord/requests/:requestId` | Bearer token | `cache: "no-store"`; revalidates `/dashboard/landlord/requests` | Update a validated rental request status. |
| Create property | `/landlord/properties/new`, `/dashboard/landlord/properties/new` | `PropertyCreateForm` → `createPropertyAction` → `createProperty` | POST | `/api/landlord/properties` | Bearer token | `cache: "no-store"`; revalidates `/dashboard/landlord/properties` | Create a validated landlord property listing. |
| Update property | `/landlord/properties/[id]/edit`, `/dashboard/landlord/properties/[id]/edit` | `PropertyEditForm` → `updatePropertyAction` → `updateProperty` | PUT, then PATCH on HTTP 405 | `/api/landlord/properties/:propertyId` | Bearer token | `cache: "no-store"`; paths and `landlord-properties` tag revalidated | Update a validated property while supporting either backend update method. |
| Delete property | `/dashboard/landlord/properties` | `DeletePropertyButton` → `deletePropertyAction` → `deleteProperty` | DELETE | `/api/landlord/properties/:propertyId` | Bearer token | `cache: "no-store"`; related paths, `landlord-properties`, and `landlord-requests` revalidated | Delete an owned property and invalidate dependent views. |

Landlord list actions return empty arrays when the API fails or returns an unexpected shape. Mutation actions validate payloads with Zod, return structured failures, and display Sonner notifications in their client components.

## Admin APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| User directory | `/dashboard/admin`, `/dashboard/admin/users` | `getUsersAction` → `getUsersList` | GET | `/api/admin/users` | Bearer token; admin route protection | `cache: "no-store"` | Load users for dashboard statistics and the searchable, sortable user table. |
| User status management | `/dashboard/admin/users` | `UserTable`/`UserRow` → `updateUserStatusAction` → `updateUserStatus` | PATCH | `/api/admin/users/:id` | Bearer token; admin route protection | `cache: "no-store"`; revalidates `/dashboard/admin` and `/dashboard/admin/users` | Ban or unban a validated user by changing status to `BLOCKED` or `ACTIVE`. |
| Property monitoring | `/dashboard/admin`, `/dashboard/admin/properties` | `PropertyAction` → `getAllProperty` | GET | `/api/admin/properties` | Bearer token; admin route protection | `cache: "no-store"` | Load all properties for admin summaries and inspection. |
| Rental monitoring | `/dashboard/admin`, `/dashboard/admin/rentals` | `rentalActions` → `getAllRentalRequest` | GET | `/api/admin/rentals` | Bearer token; admin route protection | `cache: "no-store"` | Load all rental requests for platform monitoring. |

Admin API helpers handle missing tokens, fetch failures, non-JSON responses, and backend status/message values. Admin pages and tables normalize supported response shapes and render empty states.

No admin property or rental mutation endpoint is consumed by the current frontend; those modules provide monitoring and table interactions only.

## Category APIs

| Feature | Frontend Route | Component/Action | Method | Backend Endpoint | Auth | Cache/Revalidation | Purpose |
|---|---|---|---|---|---|---|---|
| Category list | `/dashboard/admin`, `/dashboard/admin/categories` | `getCategoriesAction` → `getCategoriesApi` | GET | `/api/categories`; fallback `/api/admin/categories` when public request fails | Public first; Bearer token for fallback | `cache: "no-store"` | Load categories for admin summaries and management. |
| Create category | `/dashboard/admin/categories` | `CategoryForm` → `createCategoryAction` → `createCategoryApi` | POST | `/api/admin/categories` | Bearer token | `cache: "no-store"`; revalidates admin categories and properties paths; calls `revalidateTag("categories")` | Create a validated category. |
| Update category | `/dashboard/admin/categories` | `CategoryForm` → `updateCategoryAction` → `updateCategoryApi` | PUT, then PATCH on HTTP 405 | `/api/admin/categories/:id` | Bearer token | `cache: "no-store"`; revalidates admin categories and properties paths; calls `revalidateTag("categories")` | Update a validated category while supporting either backend update method. |
| Delete category | `/dashboard/admin/categories` | `DeleteCategoryDialog` → `deleteCategoryAction` → `deleteCategoryApi` | DELETE | `/api/admin/categories/:id` | Bearer token | `cache: "no-store"`; revalidates admin categories and properties paths; calls `revalidateTag("categories")` | Delete a validated category ID. |

Category forms perform required-field checks before invoking Zod-validated Server Actions. Results are communicated through Sonner and the list is refreshed after successful mutations.

## Authentication Flow

```text
Register form
→ registerAction (Zod validation)
→ POST /api/auth/register
→ redirect to login after success

Login form
→ loginAction (Zod validation)
→ POST /api/auth/login
→ HttpOnly accessToken cookie
→ AuthProvider calls GET /api/auth/me
→ Next.js proxy checks authentication and JWT role for protected routes
```

The proxy treats `/`, `/about`, `/login`, `/register`, and `/properties...` as public. Other matched application routes require `accessToken`. It redirects authenticated visitors away from login/register and restricts `/dashboard/admin`, `/dashboard/tenant`, `/dashboard/landlord`, and `/landlord` by JWT role.

## Payment Flow

```text
Approved rental request
→ PaymentPageClient checks that it is not already ACTIVE or COMPLETED
→ POST /api/payments/create with rentalRequestId
→ Browser redirects to Stripe Hosted Checkout
→ Stripe returns to the configured success or cancel route
→ Backend webhook processing updates payment/rental state
→ Success page calls GET /api/payments/verify/:sessionId
→ Pending/processing results are polled
→ Latest rental detail is fetched when verification returns its ID
```

The webhook itself belongs to the backend and is not implemented in this repository. The frontend's polling text and verification behavior explicitly account for webhook processing delay.

## Cache and Revalidation Strategy

### Cached reads

- Public property lists and details use `next: { revalidate: 60 }`.
- Public property reviews use `next: { revalidate: 60 }`.
- The property-form category helper uses `next: { revalidate: 300 }`.
- Landlord properties use `cache: "force-cache"` with the `landlord-properties` tag.
- Landlord incoming requests use `cache: "force-cache"` with the `landlord-requests` tag.

### Uncached reads and mutations

Authenticated current-user, tenant rental, payment, admin, category-management, review mutation, and landlord mutation requests use `cache: "no-store"`.

### Path revalidation

- Property creation revalidates `/dashboard/landlord/properties`.
- Request approval/rejection revalidates `/dashboard/landlord/requests`.
- Property updates revalidate landlord property lists/details and public property lists/details.
- Property deletion revalidates landlord properties, landlord requests, tenant dashboard, and public properties.
- Category mutations revalidate `/dashboard/admin/categories` and `/properties`.

### Tag revalidation

- Property update revalidates `landlord-properties`.
- Property deletion revalidates `landlord-properties` and `landlord-requests`.
- Category mutations call `revalidateTag("categories")`. The current category fetches do not attach a `categories` tag, so path revalidation is the effective invalidation mechanism for the documented category views.

## Error Handling

- **API return objects:** helpers return status-aware `ok`, `status`, `data`, and optional `message` results; most JSON parsing uses a `null` fallback.
- **Zod validation:** Server Actions reject malformed forms, entity IDs, rental dates, property payloads, category data, review data, and payment identifiers before calling the backend.
- **Sonner notifications:** authentication, rental, landlord, category, payment, review, and logout components display success and error toasts.
- **Inline states:** authentication forms render action messages; payment verification renders progress, retry, timeout, and success states.
- **Loading states:** root and dashboard `loading.tsx` files provide skeleton/loading UI, with additional local pending states in forms and payment components.
- **Empty states:** property lists, dashboard tables, request lists, payments, and reviews safely handle missing or empty arrays.
- **Error boundary status:** no custom `error.tsx` exists in the current frontend, so the documentation does not claim a project-specific App Router error boundary.
