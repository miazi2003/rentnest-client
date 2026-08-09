# RentNest Frontend API Integration

This document maps the backend endpoints consumed by the current frontend source. Paths are relative to `BACKEND_URL` unless the browser-side category fallback is explicitly mentioned.

Protected server-side helpers read the HttpOnly `accessToken` cookie and forward it as a Bearer token. Public reads may use Next.js revalidation; authenticated data and mutations use `cache: "no-store"`.

## Authentication

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Register | `registerForm` -> `registerAction` -> `register` | POST | `/api/auth/register` | Public | Create a tenant or landlord account. |
| Email/password login | `loginForm` -> `loginAction` -> `login` | POST | `/api/auth/login` | Public | Authenticate credentials and return an access token/user payload. |
| Current user | `AuthProvider` -> `getCurrentUserAction` -> `getCurrentUser` | GET | `/api/auth/me` | Bearer token | Load the authenticated user for context, profile display, and role-aware UI. |

Frontend logout does not call a backend endpoint; `logoutAction` removes the `accessToken` cookie.

## Social authentication

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Google login | `SocialLoginButtons` -> `googleLoginAction` -> `googleLoginApi` | POST | `/api/auth/google` | Public | Exchange a Google Identity Services credential for the backend access token. |
| Facebook login | `SocialLoginButtons` -> `facebookLoginAction` -> `facebookLoginApi` | POST | `/api/auth/facebook` | Public | Exchange a Facebook JavaScript SDK access token for the backend access token. |

Both Server Actions validate the provider value, store the returned access token in an HttpOnly cookie, refresh the user through `/api/auth/me`, and redirect according to the returned role. The browser uses only `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_FACEBOOK_APP_ID`; no provider secret belongs in frontend configuration.

## Properties and public categories

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Property listing | Home and `/properties` -> `propertyAction` -> `getProperty` | GET | `/api/properties` | Public | Load available properties used by cards, search, filters, sorting, pagination, locations, and counts. |
| Property details | `/properties/[id]` and landlord edit pages -> `getPropertyByIdAction` | GET | `/api/properties/:id` | Public | Load full property details or edit-form initial data. |
| Public categories | Property and landlord forms -> `getCategories` | GET | `/api/categories` | Public | Load category options and category management data. |

Public property list/detail reads use a 60-second Next.js revalidation window. The server-side property category helper uses 300 seconds. Landlord forms can retry the public category request in the browser through `NEXT_PUBLIC_BACKEND_URL`.

Search, filter, sort, and pagination presentation on `/properties` operates on the property data returned by the listing integration.

## Tenant rentals

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Rental list | Tenant dashboard/requests/payments -> `getRentalRequest` | GET | `/api/rentals` | Bearer token; tenant | Load all pages of the tenant's rental requests. |
| Rental detail | Payment page and verification refresh -> `getRentalRequestById` | GET | `/api/rentals/:id` | Bearer token; tenant | Load one rental request and its current status. |
| Create rental request | `RentModal` -> `createRentalAction` -> `createRentalRequest` | POST | `/api/rentals` | Bearer token; tenant | Submit validated property and rental dates. |

## Payments

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Payment history | Tenant dashboard/payments -> `getPaymentHistory` | GET | `/api/payments` | Bearer token; tenant | Load all pages of recorded tenant payments. |
| Create Checkout Session | `PaymentPageClient` -> `handleCreateCheckoutSessionAction` -> `createCheckoutSession` | POST | `/api/payments/create` | Bearer token; tenant | Send `rentalRequestId` and receive a Stripe Hosted Checkout URL. |
| Verify Checkout Session | `PaymentSuccessClient` -> `handleVerifyPaymentSessionAction` -> `verifyPaymentSession` | GET | `/api/payments/verify/:sessionId` | Bearer token supplied by frontend | Read the returned session/payment status for the success UI. |

Current payment flow:

```text
Approved rental
-> POST /api/payments/create
-> Stripe Hosted Checkout
-> success/cancel return route
-> backend webhook authoritatively updates payment and rental state
-> GET /api/payments/verify/:sessionId
-> frontend refreshes payment and rental data
```

The success UI retries pending/processing verification results up to five times and fetches the latest rental detail when verification returns a rental request ID. There is no Stripe Elements or direct card-entry integration in this frontend.

## Reviews

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Property reviews | Tenant review modal -> `handleGetPropertyReviewsAction` -> `getPropertyReviews` | GET | `/api/reviews/property/:propertyId` | Public | Load reviews for a property before review submission. |
| Create review | Tenant dashboard -> `handleCreateReviewAction` -> `createReview` | POST | `/api/reviews` | Bearer token; tenant | Submit a validated property ID, rating, and comment. |

The frontend has no personal review-list integration; it only reads reviews by property and submits new reviews.

## Landlord

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Owned properties | Landlord dashboard/properties -> `getMyPropertiesAction` | GET | `/api/landlord/properties` | Bearer token; landlord | Load listings owned by the current landlord. |
| Incoming requests | Landlord dashboard/requests -> `getIncomingRequestsAction` | GET | `/api/landlord/requests` | Bearer token; landlord | Load requests for the landlord's properties. |
| Approve/reject request | `RequestListTable` -> `handleRequestAction` | PATCH | `/api/landlord/requests/:requestId` | Bearer token; landlord | Set a validated request decision. |
| Create property | `PropertyCreateForm` -> `createPropertyAction` | POST | `/api/landlord/properties` | Bearer token; landlord | Create a validated property. |
| Update property | `PropertyEditForm` -> `updatePropertyAction` | PUT | `/api/landlord/properties/:propertyId` | Bearer token; landlord | Update an owned property. |
| Delete property | `DeletePropertyButton` -> `deletePropertyAction` | DELETE | `/api/landlord/properties/:propertyId` | Bearer token; landlord | Delete an owned property. |

## Admin

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| User list | Admin dashboard/users -> `getUsersAction` -> `getUsersList` | GET | `/api/admin/users` | Bearer token; admin | Load real user data for tables and dashboard summaries. |
| User status | `UserTable`/`UserRow` -> `updateUserStatusAction` | PATCH | `/api/admin/users/:id` | Bearer token; admin | Change a user between supported active/banned states. |
| Property monitoring | Admin dashboard/properties -> `PropertyAction` | GET | `/api/admin/properties` | Bearer token; admin | Load real property data for monitoring and analytics. |
| Rental monitoring | Admin dashboard/rentals -> `rentalActions` | GET | `/api/admin/rentals` | Bearer token; admin | Load real rental data for monitoring and analytics. |

The current admin frontend does not submit property or rental mutations. Dashboard counts and charts are calculated from API responses rather than hard-coded analytics defaults.

## Category management

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Category list | Admin dashboard/categories -> `getCategoriesAction` | GET | `/api/categories` | Public | Load current categories. |
| Create category | `CategoryForm` -> `createCategoryAction` | POST | `/api/admin/categories` | Bearer token; admin | Create a validated category. |
| Update category | `CategoryForm` -> `updateCategoryAction` | PUT | `/api/admin/categories/:id` | Bearer token; admin | Update a validated category. |
| Delete category | `DeleteCategoryDialog` -> `deleteCategoryAction` | DELETE | `/api/admin/categories/:id` | Bearer token; admin | Delete a category. |

## Contact

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Contact submission | `/contact` -> `contactAction` -> `submitContactMessage` | POST | `/api/contact` | Public | Submit name, email, optional subject, and message. |

The Zod schema applies: `name` 1-100 characters, valid `email`, optional `subject` up to 200 characters, and `message` 5-2000 characters. The page renders inline validation, loading, success, and backend error states and clears the form after success. No email-delivery or newsletter endpoint is called.

## Profile

| Feature | Frontend Component/Action | Method | Backend Endpoint | Auth | Purpose |
|---|---|---|---|---|---|
| Load profile | `/dashboard/profile` -> `getProfileApi` | GET | `/api/profile` | Bearer token | Load name, phone, email, role, status, and account dates. |
| Update profile | `ProfileForms` -> `updateProfileAction` -> `updateProfileApi` | PATCH | `/api/profile` | Bearer token | Update editable `name` and `phone`. |
| Change password | `ProfileForms` -> `changePasswordAction` -> `changePasswordApi` | PATCH | `/api/profile/password` | Bearer token | Submit `currentPassword` and `newPassword` through the separate password form. |

After profile update success, `ProfileForms` calls `AuthProvider.getUser()` and refreshes the route. Email, role, and account status are displayed as read-only values.

## Frontend routes using these integrations

Verified routes include:

- Public: `/`, `/about`, `/contact`, `/properties`, `/properties/[id]`, `/login`, `/register`
- Shared authenticated: `/dashboard`, `/dashboard/profile`
- Tenant: `/dashboard/tenant`, `/dashboard/tenant/requests`, `/dashboard/tenant/requests/[id]/pay`, `/dashboard/tenant/payments`, `/dashboard/tenant/payments/success`, `/dashboard/tenant/payments/cancel`, `/dashboard/tenant/reviews`
- Landlord: `/dashboard/landlord`, `/dashboard/landlord/properties`, `/dashboard/landlord/properties/new`, `/dashboard/landlord/properties/[id]`, `/dashboard/landlord/properties/[id]/edit`, `/dashboard/landlord/requests`
- Admin: `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/properties`, `/dashboard/admin/rentals`, `/dashboard/admin/categories`
- Payment return aliases: `/payment/success`, `/payment/cancel`

## Error, loading, and cache behavior

- Root/global, dashboard, and properties error boundaries provide recovery UI.
- `not-found.tsx` handles unknown routes and missing resources routed to not-found behavior.
- Root, dashboard, property list, and property detail loading files provide loading/skeleton feedback.
- Public property and review reads use bounded revalidation; protected lists and mutations use uncached requests.
- API helpers safely handle missing configuration, authentication, network failures, non-JSON responses, and backend status/messages.

## Environment variables used by source

| Variable | Exposure | Use |
|---|---|---|
| `BACKEND_URL` | Server only | Base URL for frontend API helpers and Server Actions. |
| `NEXT_PUBLIC_BACKEND_URL` | Public | Browser-side public category fallback in landlord forms. |
| `JWT_SECRET` | Server only | JWT verification in `src/proxy.ts`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public | Google Identity Services initialization. |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | Public | Facebook JavaScript SDK initialization. |

Only variable names are documented. Actual secret values must remain outside version control.
