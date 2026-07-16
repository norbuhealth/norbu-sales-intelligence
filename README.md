# NORBU Sales Intelligence

Vercel-ready Next.js MVP for turning Mailchimp click exports into sales follow-up and referral intelligence.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Upload this folder to a new GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the repository.
4. Keep the default Next.js settings and deploy.

## Current MVP

- Multi-file Mailchimp CSV import
- Automatic duplicate removal by email + clicked URL
- Service-interest classification
- Hot/Warm/Monitor lead scoring
- Sales-rep assignment
- Three-day referral check workflow
- Notes and referral confirmation
- CSV export
- Browser-local persistence

## Recommended Phase 2

Replace localStorage with Supabase/Postgres, add user login, referral-report upload and automatic matching, account ownership rules, campaign/date fields, audit history, and executive charts.
