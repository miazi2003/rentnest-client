# RentNest Frontend

RentNest is a responsive rental-property marketplace built with the Next.js App Router. It provides public property discovery, authenticated rental and payment workflows, and role-specific dashboards for tenants, landlords, and administrators.

## Links

- Frontend repository: https://github.com/miazi2003/rentnest-client
- Backend repository: https://github.com/miazi2003/L2A4--rentnest.git
- Live frontend: https://rentnest-client-so3z.vercel.app/
- Backend API: https://l2-a4-rentnest.vercel.app/

The repository URL is verified from `git remote -v`. The deployment URLs are the URLs already recorded by this repository; no new deployment URL was inferred.

## Demo accounts

These accounts are intentionally exposed by the login page for evaluation:

| Role | Email | Password |
|---|---|---|
| Tenant | `tenant@rentnest.com` | `Tenant@RentNest2026` |
| Landlord | `landlord@rentnest.com` | `Landlord@RentNest2028` |
| Admin | `admin@rentnest.com` | `Admin@RentNest2027` |

## Roles

- **TENANT**: browses properties, submits rental requests, tracks request and payment status, pays approved rentals through Stripe Hosted Checkout, and submits property reviews.
- **LANDLORD**: creates, edits, and deletes owned properties; views incoming rental requests; and approves or rejects pending requests.
- **ADMIN**: views real platform summaries and charts derived from API responses, manages users and categories, and monitors properties and rental requests.

## Current functionality

### Public experience

- Responsive homepage, About, Contact, property listing, and property detail pages
- Property search, category/availability/price filtering, sorting, and client-side pagination
- Property image galleries, landlord details, specifications, amenities, and reviews
- Light and dark themes through `next-themes`
- Responsive desktop and mobile navigation
- Branded 404 handling, route error boundaries, and loading/skeleton states

### Authentication and profile

- Email/password registration and login through Server Actions
- Google Identity Services login using a Google credential
- Facebook JavaScript SDK login using a Facebook access token
- HttpOnly `accessToken` cookie storage and `/api/auth/me` user refresh
- Role-aware redirects and route protection through `src/proxy.ts`
- Editable profile name and phone number
- Separate current-password/new-password form
- Read-only email, role, and account status display
- Logout by removing the frontend access-token cookie

### Rental, landlord, and admin workflows

- Tenant rental requests with validated property and lease dates
- Tenant request tracking, payment history, and review submission
- Landlord property creation, editing, deletion, and availability management
- Landlord approval/rejection of incoming requests
- Admin user status management and category CRUD
- Admin property and rental monitoring
- Dashboard statistics and charts calculated from current API data rather than fabricated defaults

### Contact

The Contact page uses this flow:

```text
Contact form -> contactAction -> POST /api/contact
```

Frontend validation matches the backend contract:

| Field | Validation |
|---|---|
| `name` | Required, 1-100 characters |
| `email` | Required, valid email address |
| `subject` | Optional, maximum 200 characters |
| `message` | Required, 5-2000 characters |

The form preserves inline validation, submission loading state, backend error feedback, success feedback, and clearing after success. The frontend does not claim email delivery, and the disabled footer newsletter control has no submission integration.

## Stripe Hosted Checkout

The frontend does not use Stripe Elements or collect card details directly. Its current flow is:

```text
Approved rental
-> frontend payment action
-> POST /api/payments/create
-> backend returns a Stripe Checkout Session URL
-> browser redirects to Stripe Hosted Checkout
-> success or cancel return route
-> backend webhook authoritatively completes the payment
-> success UI verifies the session and refreshes payment/rental state
```

The success UI calls `GET /api/payments/verify/:sessionId`, retries pending or processing results, and reloads the related rental state when an ID is returned. Payment history comes from `GET /api/payments`.

## Social login flows

### Google

```text
Google Identity Services
-> Google credential
-> googleLoginAction / googleLoginApi
-> POST /api/auth/google
-> HttpOnly accessToken cookie
-> GET /api/auth/me
-> role-aware dashboard redirect
```

Required frontend public identifier: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

### Facebook

```text
Facebook JavaScript SDK
-> Facebook access token
-> facebookLoginAction / facebookLoginApi
-> POST /api/auth/facebook
-> HttpOnly accessToken cookie
-> GET /api/auth/me
-> role-aware dashboard redirect
```

Required frontend public identifier: `NEXT_PUBLIC_FACEBOOK_APP_ID`. No Facebook secret is used or documented in the frontend.

## Editable profile

The authenticated `/dashboard/profile` page uses:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/profile` | Load the current profile |
| PATCH | `/api/profile` | Update `name` and `phone` |
| PATCH | `/api/profile/password` | Change the password using `currentPassword` and `newPassword` |

After a successful name/phone update, the page refreshes `AuthProvider` user data and refreshes the route. Email, role, and account status remain read-only in the UI.

## Technology

- Next.js 16 App Router, Server Components, Server Actions, and Proxy
- React 19 and TypeScript
- Tailwind CSS 4
- shadcn and Base UI primitives
- `next-themes` for light/dark mode
- Zod validation
- Sonner notifications
- Lucide React and Remix Icon
- Embla Carousel
- `jsonwebtoken` for JWT verification in the Next.js proxy

## API integration

Server-side API helpers use `BACKEND_URL`. Protected helpers read the HttpOnly `accessToken` cookie and forward the token as `Authorization: Bearer <token>`. The landlord forms may use `NEXT_PUBLIC_BACKEND_URL` for their browser-side public category fallback.

See [API_INTEGRATION.md](./API_INTEGRATION.md) for the verified frontend integration map.

## Environment variables

Create `.env.local` and provide only values appropriate to the frontend runtime:

```env
BACKEND_URL=
NEXT_PUBLIC_BACKEND_URL=
JWT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_FACEBOOK_APP_ID=
```

- `BACKEND_URL`: server-side backend base URL.
- `NEXT_PUBLIC_BACKEND_URL`: browser-accessible backend base URL used by landlord category fallback requests.
- `JWT_SECRET`: server-only value used by `src/proxy.ts` to verify the access-token role. Do not prefix it with `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: public Google OAuth client identifier.
- `NEXT_PUBLIC_FACEBOOK_APP_ID`: public Facebook application identifier.

Do not commit actual tokens or secrets.

## Local setup

This repository contains a pnpm lockfile and workspace file.

```bash
git clone https://github.com/miazi2003/rentnest-client.git
cd rentnest-client
pnpm install
```

Add `.env.local`, then run the development script defined in `package.json`:

```bash
pnpm dev:https
```

The script starts Next.js development mode with experimental HTTPS. Use the local URL printed by Next.js.

## Available scripts

| Command | Purpose |
|---|---|
| `pnpm dev:https` | Start the development server with experimental HTTPS |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Serve a completed production build |
| `pnpm lint` | Run ESLint |

TypeScript can also be checked without emitting files with `pnpm exec tsc --noEmit`.
