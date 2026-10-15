# RescuBite 🌿

**Less Waste. More Impact.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rescubite.onrender.com-16a34a?style=for-the-badge&logo=render&logoColor=white)](https://rescubite.onrender.com)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

RescuBite is an AI-powered platform helping Tunisian restaurants reduce food waste through demand prediction, dynamic discounting of surplus meals, and real-time redistribution to nearby consumers and partner charities.

---

## Quick Start

```bash
git clone https://github.com/chayma-saad/RescuBite.git
cd RescuBite
npm install
npm run db:push   # create the SQLite database
npm run db:seed   # load demo restaurants, bags and users
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

> 🌐 **Try it live:** https://rescubite.onrender.com — hosted on Render's free tier, so the first visit after a period of inactivity can take ~50 s while the server wakes up. Demo data resets on each restart.

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

## Features

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

---

## License

Released under the [MIT License](LICENSE).

👩‍💻 Made by [Chaima Saad](https://github.com/chayma-saad)
