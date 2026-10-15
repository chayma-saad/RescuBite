# RescuBite — 3-Minute Demo Script

## Setup (before you present)
1. Run: `npm run db:seed && npm run dev`
2. Open two browser windows side by side (or use two browser profiles)
3. Window 1: Log in as restaurant (`demo@restaurant.com` / `demo1234`)
4. Window 2: Open in incognito (for consumer/charity)

---

## Act 1: The Restaurant Intelligence (0:00 – 1:00)

**URL**: `http://localhost:3000/restaurant`

> "I'm Sami, I run Le Jasmin in Tunis. Every morning I used to guess how much food to prepare. Now I open RescuBite."

1. **Point to Today's Forecast panel** — show the AI predictions for each dish
2. **Click "Why?" on Couscous Royal** — show the factors tooltip:
   - _"See here — it knows it's a Friday, so demand is 15% higher. But it's cloudy today, so that brings it back down a bit."_
3. **Scroll to quick stats** — highlight "Weekly Meals Rescued" and "Revenue from Surplus"
4. **Click "Impact" in nav** — show the weekly charts
   - _"Over the past 8 weeks, we've rescued 48 kg of food and earned an extra 340 TND from bags we'd normally throw away."_

---

## Act 2: End of Service — Creating a Rescue Bag (1:00 – 1:45)

**URL**: `http://localhost:3000/restaurant/surplus`

> "It's 3pm. Service is wrapping up. I have leftover portions."

1. **Fill in the surplus form** — set Couscous Royal: prepared 42, sold 35 → shows "7 surplus" warning in orange
2. **Select "Sell at Discount"** — note the auto-price at 50% off
3. **Click "Submit & Generate Rescue Bags"** → success screen appears
   - _"One click. The bag is live. Nearby consumers will see it right now."_

---

## Act 3: Consumer Perspective — Discovering & Reserving (1:45 – 2:30)

**Switch to Window 2 (incognito)**

**URL**: `http://localhost:3000/browse`

> "I'm Yasmine, a student near the medina. I just got notified there's a rescue bag nearby."

1. **Show the map toggle** → click "Show Map" → Leaflet map appears with colored pins
   - _"Orange pins are discounted bags, green pins are free donations."_
2. **Click on Le Jasmin's bag** → open the bag detail
3. **Point to the countdown timer** — _"Pickup window is 2 hours. It's fresh."_
4. **Click "Reserve Now"** → enter `demo@user.com` / `demo1234` if prompted
5. **Pickup code appears** — _"RSCB-XXXX. I show this at the restaurant, pay on the spot. That's it."_

---

## Act 4: Charity Claim (2:30 – 3:00)

**Switch back to Window 1 (or open new tab)**

**URL**: `http://localhost:3000/charity` (log in as `demo@charity.com` / `demo1234`)

> "Now I'm Riadh from Resto du Cœur Tunis, a food bank. We just got a donation alert."

1. **Show the donation feed** → Couscous House donation bag is visible
2. **Click "Claim All X Portions"** → pickup code generated
   - _"One tap. We pick it up, redistribute it to 6 families. Nothing goes to waste."_

---

## Closing Line

> "RescuBite turns the question 'How much did we waste today?' into 'How much did we rescue?' — for every restaurant in Tunisia."

---

## Key Numbers to Mention
- **60 days** of realistic sales history seeded
- **8 Tunisian dishes** with real demand patterns
- **7 restaurants** across Tunis on the map
- **2 partner charities** integrated
- Prediction accuracy averages **~85%** on seeded data
