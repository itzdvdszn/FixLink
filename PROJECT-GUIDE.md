# FixLink PWA

This is the current FixLink frontend converted into an installable Progressive Web App (PWA).

## What was added
- PWA manifest and service worker
- Install App button when the browser supports installation
- FixLink logo + name home link
- Separate customer/professional demo sign-in choices
- Professional demo profiles can appear in Featured Professionals after signup
- Public professional fields are stored locally only for this demo
- Existing service search, job request, portfolio/verification form and responsive design retained

## Important
This is still a frontend demo. Do not enter real NIN/ID numbers, identity documents, bank details, passwords or other sensitive information. The demo does not provide secure authentication, real payments, real verification, messaging, or server-side booking.

## Free deployment
Deploy the folder to the existing Netlify site. Because it is a PWA, supported browsers can offer an Install App option after deployment over HTTPS.

## Production phase
Use a real backend/database such as Supabase or Firebase for authentication, professional profiles, secure verification storage, bookings, messaging, notifications and payments. Sensitive data must be handled server-side with proper access controls and encryption.
