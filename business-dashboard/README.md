# Next Steps Media & Digital Services Executive Dashboard

This directory contains an isolated React/Vite prototype for the public executive business dashboard.

## Purpose

- Present the strategic business plan in a professional, responsive web format.
- Show the revised August 1–July 31 fiscal-year forecast.
- Explain the household-supporting owner-draw model.
- Provide a future presentation layer for approved summary data from Google Sheets.

## Current data source

The prototype currently uses approved static values from the revised FY financial model. No private client, household, SEAP, or contact data is exposed.

## Planned integration

A later phase will add a presentation-safe data layer that can read approved summary metrics from:

- Revised FY Financial Model
- Project Control Center
- CRM and Outreach Tracker
- Training and Education Log

The public dashboard should never connect directly to raw private worksheets without a filtered and authenticated server-side layer.

## Local development

```bash
cd business-dashboard
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Branch isolation

This prototype is located on `feature/business-dashboard`. It does not alter the current radio application on `main` unless deliberately reviewed and merged.
