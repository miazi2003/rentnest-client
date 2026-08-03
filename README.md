# RentNest Frontend

A modern rental property marketplace built with the Next.js App Router. RentNest provides public property discovery and role-specific workspaces for tenants, landlords, and administrators.

## Live Links

- Live Frontend: https://rentnest-client-so3z.vercel.app/
- Backend API: https://l2-a4-rentnest.vercel.app/

## Admin Credentials

- Email: `admin@rentnest.com`
- Password: `Admin@RentNest2027`

## Tenant Credentials

- Email: `tenant@rentnest.com`
- Password: `Tenant@RentNest2026`

## Landlord Credentials

- Email: `landlord@rentnest.com`
- Password: `Landlord@RentNest2028`

## Project Overview

RentNest connects people looking for rental properties with landlords who manage listings and rental applications. The application supports three account roles:

- **Tenant** — explores properties, submits rental requests, tracks request status, pays approved rentals, and reviews properties.
- **Landlord** — creates and manages property listings and accepts or rejects incoming rental requests.
- **Admin** — monitors platform users, properties, rentals, and manages property categories.

## Core Features

### Public

- Responsive landing, about, property listing, and property detail pages
- Property search and filtering by search text, category, availability, and price range
- Property details with image gallery and reviews
- Responsive navigation, layouts, skeleton loading states, and dark-theme support

### Tenant

- Registration and login
- Rental request submission with validated rental dates
- Rental request status tracking
- Stripe Hosted Checkout for approved requests
- Payment verification, retry feedback, and payment history
- Property review submission and existing-review checks

### Landlord

- Dashboard overview of properties and rental requests
- Property creation, editing, and deletion
- Property availability selection
- Incoming rental request approval and rejection
- Property and request summary metrics

### Admin

- Platform dashboard with user, property, rental, and category summaries
- User directory with filtering, sorting, and pagination
- Property inspection and monitoring
- Rental request monitoring
- Category creation, editing, and deletion

## Role-Based User Flow

### Tenant

Register/Login → Browse properties → View details → Submit rental request → Wait for landlord approval → Pay through Stripe Checkout → Review the property

### Landlord

Register/Login → Open landlord dashboard → Create, edit, or delete properties → View incoming requests → Approve or reject requests

### Admin

Login → Open admin dashboard → Review users → Inspect properties → Monitor rentals → Manage categories

## Tech Stack

- **Next.js 16** with the App Router, Server Components, Server Actions, and Proxy
- **React 19** and the React Context API
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn** and **Base UI** primitives
- **Zod** for server-side payload and form validation
- **Sonner** for toast notifications
- **Lucide React** and **Remix Icon** for icons
- **Embla Carousel** for property carousels
- **jsonwebtoken** for role extraction in the Next.js proxy
- **next-themes** for theme support
- **Stripe Hosted Checkout**, initiated and verified through the backend API

React Hook Form and the Stripe browser SDK are not installed; authentication forms use React Server Action state, and checkout redirects to a URL returned by the backend.

## Project Architecture

```text
src/
├── app/
│   ├── (auth)/                 # Login and registration routes
│   ├── dashboard/              # Admin, landlord, tenant, and profile pages
│   ├── landlord/               # Landlord create/edit routes
│   ├── properties/             # Public listing and property details
│   ├── payment/                # General payment result routes
│   └── features/
│       ├── api/                # Backend API service functions
│       ├── admin/              # Admin actions, types, and validation
│       ├── auth/               # Auth actions, forms, hooks, types, validation
│       ├── category/           # Category actions, types, and validation
│       ├── landlord/           # Landlord actions and validation
│       ├── payment/            # Checkout/verification actions and validation
│       ├── property/           # Public property actions
│       ├── rental/             # Rental request actions and validation
│       └── review/             # Review actions and validation
├── components/
│   ├── home/                   # Landing-page sections
│   ├── shared/                 # Shared navigation and footer
│   └── ui/                     # Reusable UI primitives
├── hooks/                      # Shared React hooks
├── lib/                        # Shared utilities
├── providers/                  # Authentication context provider
└── proxy.ts                    # Authentication and role route protection
```

## API Integration

Backend calls are made through server-side API helpers and Server Actions, with the access token forwarded as a Bearer token for protected endpoints.

[View full API integration documentation](./API_INTEGRATION.md)

## Authentication and Authorization

Login and registration forms submit to Server Actions and are validated with Zod. A successful login stores the backend-issued access token in an `accessToken` cookie configured as HttpOnly, path-wide, and valid for seven days. In production it is also marked `secure` and uses `SameSite=None`.

`AuthProvider` calls the current-user Server Action and exposes the authenticated user, loading state, and refresh function through React Context. Role-aware UI controls limit actions such as rental submission to tenants. `src/proxy.ts` protects non-public routes and redirects unauthenticated users to `/login`; it also protects admin, tenant, and landlord route prefixes according to the JWT role.

## Payment Integration

For an approved rental request, the tenant opens the payment page and submits only the rental request ID. The backend creates a Stripe Hosted Checkout session and returns its redirect URL. The browser navigates to Stripe, then returns to a success or cancel route.

The tenant success page reads the Stripe session ID, calls the backend verification endpoint, and polls up to five times while the payment is pending or processing. After successful verification, the payment action also requests the latest rental detail. The UI prevents initiating checkout for requests already marked `ACTIVE` or `COMPLETED`; authoritative payment and duplicate-payment enforcement remains a backend responsibility. The frontend contains no webhook endpoint—the success UI waits for the backend's Stripe webhook processing through repeated verification.

## Validation and Error Handling

- Zod schemas validate authentication, rental, review, payment, landlord property, request-status, category, and entity-ID inputs.
- Authentication forms display Server Action validation/API messages and use Sonner notifications.
- Property, request, category, payment, review, and logout interactions provide success and failure toasts.
- API helpers return structured `ok`, `status`, `data`, and optional `message` values and safely handle network or response parsing failures.
- Pages and tables normalize missing collections to empty arrays and render empty states rather than crashing.
- Root and dashboard `loading.tsx` files provide loading feedback; payment verification supplies its own loading, retry, and error UI.
- The project does not currently define a custom App Router `error.tsx` boundary.

## Environment Variables

Create a `.env.local` file in the project root:

```env
BACKEND_URL=<ADD_BACKEND_API_URL>
NEXT_PUBLIC_BACKEND_URL=<ADD_BROWSER_ACCESSIBLE_BACKEND_API_URL>
JWT_SECRET=<ADD_BACKEND_JWT_SECRET>
```

`BACKEND_URL` is used by server-side API helpers. `NEXT_PUBLIC_BACKEND_URL` is used by the landlord property forms when they make a browser-side category fallback request. `JWT_SECRET` is used by the Next.js proxy when verifying the access token. Do not commit real secrets.

## Local Setup

Prerequisites: Node.js and pnpm.

```bash
git clone <ADD_GITHUB_REPOSITORY_URL>
cd rentnest-client
pnpm install
```

Add the environment variables described above, then start development:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev      # Start the development server
pnpm build    # Create an optimized production build
pnpm start    # Serve the production build
pnpm lint     # Run ESLint
```

## Production Deployment

Configure `BACKEND_URL`, `NEXT_PUBLIC_BACKEND_URL`, and `JWT_SECRET` in the hosting environment, then deploy the Next.js application. The authenticated dashboard tree and cookie-dependent routes are configured for dynamic server rendering.
