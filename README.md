# RescuBite 🌿

**Less Waste. More Impact.**

RescuBite is an AI-powered platform helping Tunisian restaurants reduce food waste through demand prediction, dynamic discounting of surplus meals, and real-time redistribution to nearby consumers and partner charities.

---

## Quick Start

```bash
npm install
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

| Role       | Email                   | Password  |
|------------|-------------------------|-----------|
| Restaurant | demo@restaurant.com     | demo1234  |
| Consumer   | demo@user.com           | demo1234  |
| Charity    | demo@charity.com        | demo1234  |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite + Prisma ORM 5
- **Auth**: NextAuth.js v4 (credentials provider)
- **AI/Prediction**: Deterministic simulation in `lib/prediction.ts` — no external API required
- **Charts**: Recharts
- **Maps**: Leaflet + react-leaflet (no API key needed)
- **Icons**: lucide-react

---

## Feature Walkthrough for Judges

### 1. Landing Page (`/`)
- Animated gradient hero with bold headline
- Three role CTAs (Restaurant / Consumer / Charity)
- Animated impact counters (intersection observer)
- "How it works" 3-step explainer
- Live mock forecast card

### 2. Restaurant Dashboard (`/restaurant`)
- **AI Demand Forecast**: Per-item daily prediction with:
  - 14-day historical average
  - Day-of-week factor (Mon=0.85x to Sat=1.25x)
  - Weather factor (sunny=1.1x, rainy=0.75x)
  - 3-day trend vs 14-day baseline
  - Confidence score based on historical variance
  - "Why?" tooltip showing every factor

### 3. Menu Management (`/restaurant/menu`)
- Full CRUD for menu items
- Cost, price, margin display

### 4. Surplus Logging (`/restaurant/surplus`)
- Log prepared vs sold per item
- Auto-create Rescue Bags at 50% off
- Toggle to donate to charity instead

### 5. Consumer Browse (`/browse`)
- Grid of live Rescue Bags across Tunis
- Leaflet map with color-coded pins
- Filters: search, cuisine, donations-only

### 6. Bag Detail + Reservation (`/bag/[id]`)
- One-click reserve → pickup code
- Pay at pickup (no payment integration)

### 7. My Rescues (`/reservations`)
- Upcoming pickups with codes
- Personal impact stats

### 8. Charity Feed (`/charity`)
- Live donation feed
- One-tap claim flow

### 9. Impact Charts (`/restaurant/impact`)
- Food rescued per week (area chart)
- Revenue from surplus (bar chart)

### 10. Forecast History (`/restaurant/history`)
- Predicted vs Actual line chart
- Daily accuracy bar chart

---

## AI Prediction Details

The engine in `lib/prediction.ts` runs offline, no external API:

```
predicted = historicalAvg * dayOfWeekFactor * weatherFactor * trendFactor
confidence = 1 - (stdDev/mean) * 0.8   (clamped to 40-98%)
```

Weather is seeded deterministically from the date. All factors are shown in the UI.

---

## What's Next

1. **ML Model Upgrade** — Replace weighted average with Prophet/LSTM on real data
2. **Payment Integration** — Stripe Connect for real transactions
3. **Mobile App** — React Native for consumers
4. **Push Notifications** — Alert consumers when bags appear nearby
5. **Arabic/French Localization** — Strings centralized in `lib/i18n.ts`

---

## Project Structure

```
app/                  – Next.js App Router pages + API routes
components/           – React components by role
lib/                  – prediction.ts, auth.ts, db.ts, utils.ts
prisma/               – schema.prisma + seed.ts
```
