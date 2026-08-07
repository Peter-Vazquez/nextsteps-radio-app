# Next Steps Radio Commercial App Audit

Date: August 6, 2026

## Executive Summary

The existing Next Steps Radio web app is a solid Version 1 foundation. It is live, responsive, deployed through Vercel, and already includes a basic Progressive Web App foundation. It should be preserved as the public web experience while the project expands into a native iOS and Android product.

The current codebase is intentionally small and easy to understand, which is an advantage. It is not yet ready to support commercial memberships, native background audio, video, sponsor inventory, advertising, account management, push notifications, or store submission without additional architecture.

Recommended direction: keep the existing web repository focused on the public web product, create a separate native mobile repository using Expo and React Native, and introduce shared backend services for content, accounts, entitlements, sponsorships, notifications, and analytics.

## Current Strengths

- React and Vite foundation is simple and maintainable.
- Live Citrus3 audio stream is already connected.
- Responsive CSS supports desktop and mobile browser layouts.
- Main branch is treated as stable.
- GitHub Actions build workflow is present.
- Vercel deployment is connected and healthy.
- Basic PWA metadata, manifest, and icon foundation are present.
- No secrets or private API credentials were found in the current source review.
- Contact information, station schedule, host bio, and support placeholder are already represented in the interface.

## Current Gaps

### Engineering

- No package lockfile is committed, so dependency installation is not fully reproducible.
- CI performs build validation only. There is no linting, automated testing, accessibility test, or dependency audit step.
- Most content is hard-coded in App.jsx.
- No shared data layer exists.
- No error monitoring or application analytics exists.
- No release versioning or mobile release workflow exists.

### Audio

- Web audio playback is browser based only.
- There is no native background audio service.
- There are no lock-screen controls.
- There is no real now-playing metadata integration.
- There is no favorites, history, or saved episode system.

### Content

- Show schedules and host information require a code change.
- No podcast archive or episode catalog exists.
- No content management interface exists.
- No video catalog or live video system exists.

### Membership and Accounts

- No authentication system exists.
- No member profile or entitlement system exists.
- No subscription billing exists.
- No account deletion workflow exists.
- No member-only content controls exist.

### Sponsorship and Advertising

- The support button is still a placeholder.
- No sponsor database exists.
- No sponsor placement inventory exists.
- No campaign dates, impression tracking, or sponsor reporting exists.
- No consent architecture exists for future behavioral or programmatic advertising.

### Compliance and Store Readiness

- Privacy Policy and Terms of Use must be finalized before store launch.
- Apple App Privacy disclosures will be required.
- Google Play Data Safety disclosures will be required.
- Account deletion must be designed before account creation ships.
- Membership purchasing must follow Apple and Google digital-content billing requirements in each storefront or region.
- Store-ready app icons, splash assets, screenshots, descriptions, age ratings, support URLs, and review notes must be created.

## Web App Recommendation

Keep this repository as the web product. Do not replace it with the native application.

Near-term web work should focus on:

1. Add a package lockfile and deterministic CI installation.
2. Add linting and basic tests.
3. Move editable content out of App.jsx and into a shared backend.
4. Add Privacy Policy and Terms of Use pages.
5. Replace the support placeholder with the approved support experience.
6. Finish PWA production assets and install testing.
7. Add analytics only after the privacy and consent approach is finalized.

## Commercial Product Direction

The target product should support:

- Live audio radio
- Background playback and lock-screen controls
- Podcast and on-demand audio archive
- Live and on-demand video
- Show and host pages
- Push notifications
- Member accounts
- Paid recurring memberships
- Free and member-only content
- Direct sponsor placements
- Optional programmatic advertising later
- Admin-controlled schedules, shows, hosts, episodes, videos, sponsors, and notifications
- Shared entitlement state across web, iOS, and Android

## Readiness Assessment

Web foundation: Good

PWA foundation: Basic, incomplete

Native mobile readiness: Architecture stage

Membership readiness: Not started

Video readiness: Not started

Sponsor and advertising readiness: Not started

Store compliance readiness: Not started

Overall conclusion: preserve the current web application, harden the foundation, and build the commercial mobile platform as a separate but connected product.