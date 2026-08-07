# Next Steps Radio Mobile Architecture

Date: August 6, 2026

## Product Goal

Build Next Steps Radio Podcast Network into a commercial media platform spanning web, iOS, Android, and future connected-device channels while keeping the current web app stable.

## Recommended Repository Structure

### Existing

`Peter-Vazquez/nextsteps-radio-app`

Purpose: public web application and PWA foundation.

### New

`Peter-Vazquez/nextsteps-radio-mobile`

Purpose: native iOS and Android application built with Expo and React Native.

### Optional Future

`Peter-Vazquez/nextsteps-radio-admin`

Purpose: protected browser-based administration for schedules, shows, episodes, videos, hosts, sponsors, campaigns, and push notifications.

## Recommended Mobile Stack

- Expo
- React Native
- Expo Router
- EAS Build
- EAS Submit
- Expo Audio for native playback
- Expo Notifications for push notifications
- TypeScript for new mobile code

The mobile application should be a true native application rather than a thin web wrapper. This is important for reliable background audio, lock-screen controls, push notifications, subscriptions, native video behavior, and future platform integrations.

## Recommended Backend

Use Supabase as the shared application backend.

Core services:

- PostgreSQL database
- Authentication
- Row Level Security
- Storage for images and documents
- Edge Functions for secure server-side workflows
- Realtime features where useful

Do not store large production video files directly in the application repository.

## Recommended Subscription Architecture

Use RevenueCat as the cross-platform entitlement layer.

Native purchases:

- Apple StoreKit on iOS
- Google Play Billing on Android

Web purchases:

- RevenueCat Web Billing with Stripe, or Stripe integrated into the same entitlement model

RevenueCat should determine whether a signed-in user has access to premium benefits regardless of where the qualifying purchase originated.

Initial membership model should remain simple:

### Free

- Live radio
- Public podcasts
- Public videos
- Schedule and host information
- Standard sponsor messages

### Supporter

- Supporter badge
- Selected bonus audio or video
- Member updates
- Reduced promotional interruptions where appropriate

### Premium

- Full premium archive
- Member-only video and audio
- Early access or exclusive programs
- Premium live events when offered
- Additional future benefits

Pricing should be decided only after the product benefits, content cadence, and store economics are modeled.

## Direct Sponsorship Architecture

Direct sponsorship should be separate from consumer membership billing.

Suggested sponsor data:

- sponsor name
- logo
- website URL
- contact information
- campaign start date
- campaign end date
- placement type
- show association
- creative assets
- disclosure copy
- status
- impression and click counts where appropriate

Suggested placements:

- Home screen featured sponsor
- Show sponsor
- Episode sponsor
- Watch sponsor
- Audio pre-roll or mid-roll where technically and contractually appropriate
- Video pre-roll or sponsor slate
- Sponsored push notification only with clear disclosure and conservative frequency limits

Direct sponsorship should be the first advertising priority. Programmatic advertising can be added later after privacy, consent, revenue potential, and user experience are evaluated.

## Video Architecture

Create a dedicated Watch area in the native app.

Version 1 video support should include:

- Live video destination when available
- Public video episodes
- Interviews and clips
- Program pages with video catalogs
- Full-screen playback
- Picture-in-picture where supported and appropriate

The content model should not depend on one video vendor. Store video metadata and provider references in the backend so public YouTube, Rumble, or another provider can be used initially while a protected streaming provider can be added later for premium video.

## Proposed Navigation

### Home

- Live status
- Start listening
- Featured program
- Latest episode
- Featured video
- Current sponsor
- Membership call to action

### Listen

- Live radio
- Now playing
- Recently played
- Podcast archive
- Shows
- Favorites in a later release

### Watch

- Live video
- Latest videos
- Shows
- Interviews
- Premium video where entitled

### Shows

- Program directory
- Host profiles
- Schedules
- Audio episodes
- Video episodes

### Account

- Sign in
- Membership status
- Manage subscription
- Notification preferences
- Autoplay preference
- Privacy choices
- Account deletion
- Support

## Core Data Model

Suggested tables and entities:

- profiles
- shows
- hosts
- show_hosts
- schedules
- episodes
- audio_sources
- video_items
- video_sources
- live_streams
- sponsors
- sponsor_campaigns
- sponsor_placements
- memberships
- entitlements
- notification_preferences
- device_push_tokens
- app_settings

Payment receipts and sensitive payment credentials should remain with the payment providers and should not be stored directly in application tables unless specifically required and appropriately secured.

## Administration

The long-term application should not require editing GitHub code to change routine content.

An admin interface should allow authorized staff to:

- Edit show schedules
- Add or update hosts
- Publish audio episodes
- Publish videos
- Turn live banners on or off
- Manage sponsor campaigns
- Choose featured content
- Send push notifications
- Update support links
- Update verse or inspirational content if retained

## Security Principles

- No secrets committed to GitHub
- Environment-specific configuration
- Row Level Security on user data
- Server-side verification for privileged operations
- Least-privilege administrative roles
- Subscription entitlement validation through RevenueCat
- Separate public content from member-only content
- Audit important admin actions

## Release Strategy

### Phase 1: Foundation Hardening

Harden the current web repository and establish shared backend infrastructure.

### Phase 2: Native Audio MVP

Create the Expo mobile repository with Home, Listen, Shows, and Account shells, plus background audio and lock-screen controls.

### Phase 3: Content Platform

Move shows, hosts, schedules, episodes, and video metadata into Supabase and add the admin workflow.

### Phase 4: Membership

Add authentication, RevenueCat entitlements, store subscriptions, web billing, account management, and account deletion.

### Phase 5: Video

Launch Watch, public video, and protected premium video architecture.

### Phase 6: Sponsorship and Advertising

Launch direct sponsor inventory and reporting. Evaluate programmatic advertising only after privacy and user experience reviews.

### Phase 7: Store Launch

Complete store assets, privacy disclosures, Data Safety, TestFlight and Google testing tracks, subscription product setup, review notes, and production rollout.

## First Development Milestone

Before creating store binaries, complete these items:

1. Commit a package lockfile for the web app.
2. Upgrade the web CI workflow to deterministic installs and basic quality checks.
3. Create the Supabase project and initial schema.
4. Create the `nextsteps-radio-mobile` Expo repository.
5. Implement native background live audio and lock-screen controls.
6. Create the initial mobile navigation shell.
7. Establish development, preview, and production build profiles with EAS.
8. Test on at least one physical iPhone and one physical Android device.

No production membership pricing or advertising SDK should be added before privacy, billing, and consent decisions are documented.