# Business Dashboard Security

## Public and private separation

The public dashboard contains approved planning summaries only. It must not contain client names, bank credentials, Social Security numbers, account numbers, card data, raw transactions, medical information, or confidential household records.

The owner portal retrieves its data from `/api/private-data` only after a server-side session is verified. Private management data is not compiled into the public browser bundle.

## Required Vercel configuration

Set the following environment variables in the dashboard's Vercel project for Preview and Production:

- `DASHBOARD_PASSWORD`: a long, unique password used only for this portal.
- `SESSION_SECRET`: at least 32 random characters. A password manager or cryptographic generator should be used.
- `PRIVATE_DASHBOARD_DATA_JSON`: optional reviewed management-summary JSON. Leave blank to use the safe default snapshot.

Do not place real secret values in GitHub, `.env.example`, screenshots, messages, or browser code.

## Implemented controls

- Server-side password verification.
- Timing-safe secret comparison.
- Signed, expiring session token.
- `HttpOnly`, `Secure`, and `SameSite=Strict` cookie.
- Eight-hour session limit.
- Basic failed-attempt throttling.
- `no-store` headers for owner and API responses.
- Content Security Policy.
- Clickjacking protection.
- MIME-sniffing protection.
- Restricted browser permissions.
- Search-engine exclusion for the owner portal and API.
- Safe locked state when required environment variables are absent.

## Important limitations

This is a strong small-business access layer, not a complete enterprise identity platform. Before storing materially sensitive records, obtain a cybersecurity review and consider managed identity with multi-factor authentication, centralized audit logs, persistent rate limiting, and role-based access.

The current portal is designed for approved management totals. Detailed accounting, bank, client, and household records should remain in their designated secure systems.
