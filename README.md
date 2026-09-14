# FixLink Production Backend

The frontend currently lives in the parent folder. The production backend should use Supabase for authentication, Postgres data, Realtime messaging, and Storage, with Paystack handled through server-side functions.

## Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL Editor.
3. Enable email authentication and configure the email redirect URL for the deployed FixLink site.
4. Create Storage buckets for profile photos, portfolios, and verification documents. Keep verification buckets private.
5. Copy `.env.example` into the deployment environment and fill in public values separately from server-only secrets.
6. Replace the frontend `localStorage` calls with Supabase Auth and database queries.

## Required server functions

- `create-job-payment`: validate the authenticated customer, calculate the 30% customer usage fee and the 10% standard or 0% Premium professional fee, then create a pending payment.
- `paystack-webhook`: verify the Paystack signature with `PAYSTACK_SECRET_KEY`, mark the payment paid only after verification, and record the professional payout.
- `create-premium-subscription`: create the ₦1,200 monthly Premium subscription for the authenticated professional.
- `premium-webhook`: verify recurring subscription events and update `professional_profiles.premium_active` and `premium_expires_at`.
- `send-message`: enforce conversation membership before inserting a message.

## Payment rules

- Customer service amount: 100% of the professional quote.
- Customer usage fee: 30% of the professional quote.
- Standard professional platform fee: 10% of the quote.
- Premium professional platform fee: 0% of the quote.
- Premium subscription: ₦1,200/month, billed separately from jobs.

Never trust amounts, Premium status, webhook callbacks, or payout values sent by the browser. Recalculate them in a server function using database state. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYSTACK_SECRET_KEY` in frontend files.
