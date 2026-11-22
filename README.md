# WedPlan — Wedding Planning Platform (Client)

WedPlan is a wedding marketplace where couples find wedding vendors and send booking requests, vendors publish and manage their services, and admins keep the platform clean. This repo is the Next.js frontend.

- **Live site:** https://wedplan-client-theta.vercel.app
- **Client repo:** https://github.com/msshahriar18/wedplan-client
- **Server repo:** https://github.com/msshahriar18/wedplan-server

## Features

**Customers**
- Browse approved services with search, category, location and price range filters
- Sort services by price (low to high / high to low) or newest
- View service details with a photo gallery and vendor info
- Send booking requests with event date, location and a message
- Track requests (pending, accepted, rejected, cancelled) and cancel pending ones

**Vendors**
- Add, edit and delete services with multiple photos (uploaded to ImgBB)
- See approval status of each service and pause/resume availability
- Accept or reject booking requests for their own services
- Free plan (3 active services) or Premium plan through Stripe Checkout
- Premium is activated only after Stripe sends a verified webhook to the server

**Admins**
- Overview of users, vendors, customers, services and transactions
- Search and filter users, view details, block and unblock accounts
- Review submitted services — approve, reject, move back to pending or delete
- Read-only transaction list (payment records can't be edited)

**General**
- Email/password and Google sign in with Better Auth
- Role based dashboards with server side guards (changing the URL won't open another role's dashboard)
- Admin accounts can't be created from the sign up form
- Blocked users are signed out and can't sign in or call protected APIs
- Toast notifications, loading skeletons, empty states and error pages
- Fully responsive, wedding themed UI with Framer Motion animations on the home page

## Tech Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Better Auth · MongoDB · Motion (Framer Motion) · jose (JWT) · ImgBB · Lucide icons

## How auth works with the API

Better Auth runs inside Next.js and keeps the session in a cookie. When a page or server action needs the Express API, the Next.js server signs a short-lived JWT (1 hour, HS256) with the user id and sends it as `Authorization: Bearer <token>`. The Express server verifies the token, loads the user fresh from the database and checks the role and blocked status itself, so the frontend is never trusted for permissions.

## Run Locally

1. Clone and install

   ```bash
   git clone https://github.com/msshahriar18/wedplan-client.git
   cd wedplan-client
   npm install
   ```

2. Create `.env.local` from the example and fill in the values

   ```bash
   cp .env.example .env.local
   ```

   | Variable | What it is |
   | --- | --- |
   | `BETTER_AUTH_SECRET` | Any long random string (`openssl rand -hex 32`) |
   | `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` | URL of this app, `http://localhost:3000` locally |
   | `MONGODB_URI` / `DB_NAME` | Same MongoDB database the server uses |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
   | `JWT_SECRET` | Must be exactly the same as `JWT_SECRET` on the server |
   | `NEXT_PUBLIC_API_BASE_URL` | URL of the Express server, `http://localhost:5000` locally |
   | `IMGBB_API_KEY` | ImgBB API key (used only on the server side) |

3. Start the server repo first, then run

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

For Google login, add `http://localhost:3000/api/auth/callback/google` (and the same path on your live domain) as an authorized redirect URI in Google Cloud Console.

## Test Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | given in the submission | given in the submission |

Use Stripe test card `4242 4242 4242 4242` with any future date and any CVC to try the Premium upgrade.

## Project Structure

```
app/
  (auth)/            sign in, sign up
  (main)/            home, browse services, service details, payment pages
  dashboard/         customer, vendor and admin dashboards (role guarded layouts)
  api/auth           Better Auth handler
  api/upload         ImgBB upload (keeps the API key on the server)
components/          ui (shadcn), layout, home sections, dashboard and shared pieces
lib/
  core/server.ts     session, JWT signing and fetch helpers for the API
  api/               data fetching used by server components
  actions/           server actions for mutations
proxy.ts             redirects signed out users away from private routes
```
