# TurfPro — Turf Management System

A production-grade React sports turf booking platform with full booking flow, admin panel, authentication, and a premium dark UI.

---

## 🚀 Quick Start

```bash
cd turf-management-system
npm install
npm start
```

App runs at **http://localhost:3000**

---

## 🔑 Demo Accounts

| Role  | Email                  | Password      |
|-------|------------------------|---------------|
| User  | user@turfpro.com       | password123   |
| Admin | admin@turfpro.com      | admin123      |

---

## 📁 Project Structure

```
src/
├── assets/
│   └── styles.css          # Global CSS variables, utilities, components
├── components/
│   ├── Navbar.js            # Sticky nav with dropdown + mobile menu
│   ├── Footer.js            # Footer with links and contact info
│   ├── TurfCard.js          # Turf listing card
│   ├── BookingForm.js       # Multi-step booking wizard (3 steps)
│   ├── CalendarView.js      # Custom date picker calendar
│   └── Loader.js            # Spinner + skeleton card
├── context/
│   └── AuthContext.js       # Auth state, login, register, logout
├── pages/
│   ├── Home.js              # Landing page with hero, stats, CTA
│   ├── TurfList.js          # Browse/filter all turfs
│   ├── TurfDetails.js       # Single turf details + booking CTA
│   ├── BookingPage.js       # Full booking page with form
│   ├── Dashboard.js         # User booking history + profile
│   ├── AdminPanel.js        # Admin: overview, bookings, turfs mgmt
│   ├── Login.js             # Login with demo credentials
│   └── Register.js          # Registration with password strength
├── services/
│   ├── api.js               # Axios base instance with interceptors
│   ├── authService.js       # Login / register / profile (mock)
│   ├── turfService.js       # CRUD for turfs (mock data)
│   └── bookingService.js    # Booking creation/cancellation (mock)
├── utils/
│   ├── dateUtils.js         # Date/time formatting + slot helpers
│   └── validation.js        # Form validators
├── routes.js                # Centralized routes + ProtectedRoute guards
├── App.js                   # Router + layout composition
└── index.js                 # React root entry
```

---

## ✨ Features

### User
- Browse & search turfs by sport, location, price
- View turf details, amenities, ratings
- 3-step booking wizard: Date → Details → Confirm
- Custom calendar with booked slot overlay
- View / cancel upcoming bookings in dashboard

### Admin (admin@turfpro.com)
- Overview dashboard with revenue KPIs
- All bookings table with status management
- Turf management: activate / deactivate / delete
- Add new turf form

---

## 🔌 Connecting a Real Backend

All API calls are in `src/services/`. Each service has mock implementations — replace them with real `axios` calls pointing to your `REACT_APP_API_URL`.

```env
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Design System

- **Fonts:** Bebas Neue (headings) + DM Sans (body)
- **Theme:** Dark industrial-athletic
- **Accent:** `#00e676` (electric green)
- **CSS Variables:** All tokens in `src/assets/styles.css`

---

## 🖼️ Icons & Favicon

- **Favicon (served from public):** `/favicon.png` — add to `index.html` with:

```html
<link rel="icon" href="/favicon.png" />
```

- **Sprite / icons (served from public):** `/icons.png` — use in HTML/JSX as an image or CSS background:

```html
<img src="/icons.png" alt="icons" />
```

```css
background-image: url('/icons.png');
```

- **If you prefer SVG sprite usage:** keep `/public/icons.svg` and use `<svg><use href="/icons.svg#icon-id"></use></svg>`.

These PNG files are located in the `public` folder: `/public/favicon.png` and `/public/icons.png`.np
