# <img src="public/images/currency/honeypot.png" width="60"> HoneyShop: A Food Journaling App with Gamification
~ Log Meals · Earn Honeypots · Decorate Your Shop ~

## Features
- Log recipes and dining experiences to earn Honeypot currency
- Watch real-life food efforts turn into a thriving virtual restaurant
- Customize your shop with furniture, decorations, and wall & floor items
- Pull exclusive gacha items using Bagel Tokens earned from logging
- Unlock achievements and collect rewards as you progress
- Invite family, friends, and characters to walk around your restaurant

## Tech Stack
- **React 18** + **Vite** (single-page web app)
- State persisted via `localStorage`; live data from **Supabase** (PostgreSQL)
- Supabase schema: `core` — tables: `tag`, `item`, `store`, `gacha`, `gacha_item`, `ingredient`, `avatar`, `avatar_bgcolor`, `rarity`, `currency`, `level`, `achievement`
- Target device: **iPhone 17** — 402 × 874 CSS px (2622 × 1206 physical, 3× DPR)
- Local dev server runs on `http://localhost:3000`

## Running Locally

```bash
npm install      # first time only
npm run dev      # starts dev server at localhost:3000
```

## Project Structure

```
HoneyShop/
├── src/
│   ├── main.jsx              # React entry point (createRoot)
│   ├── App.jsx               # Main shell — state, routing, header, bottom nav
│   ├── constants.js          # Data tables (items, gacha, tags, achievements…) + design tokens
│   ├── state.js              # localStorage load/save + defaults
│   ├── lib/
│   │   └── supabase.js       # Supabase client (reads VITE_SUPABASE_* env vars)
│   ├── components/
│   │   └── Lightbox.jsx      # Full-screen photo viewer (click-to-expand)
│   ├── tabs/
│   │   ├── JournalTab.jsx    # Food journal + filter/sort bar + record cards
│   │   ├── FridgeTab.jsx     # Ingredient stock & expiry tracking
│   │   ├── ShopTab.jsx       # Restaurant view, furniture, NPCs, shop info
│   │   ├── StoreTab.jsx      # Honeypot shop + gacha pulls
│   │   └── CollectionTab.jsx # Achievements & rewards
│   └── modals/
│       ├── AddModal.jsx      # Multi-step entry form (type → photos → details → confirm)
│       ├── GachaModal.jsx    # Gacha pull animation & result
│       ├── ProfileModal.jsx  # Profile editor + avatar/background picker
│       └── RecordModal.jsx   # Journal entry detail view + save-to-photo
│
├── public/
│   └── images/
│       ├── avatars/          # User avatar images (e.g. 01_rabbit.png)
│       ├── furniture/        # Shop decoration images  {name}_WxH.png
│       ├── currency/         # In-app currency icons (honeypot, bagel)
│       └── icon/             # UI icons (setting.png, spatula_click.png, plate.png, pin.png …)
│
├── .env                      # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Data Tables 
![core](docs/core_schema.png)
- user_data_schema
- analytics_schema

## App Tabs

| Tab | Key Component | Description |
|---|---|---|
| <img src="public/images/icon/journal.png" width="32" style="vertical-align:center"> Journal | `JournalTab` | Log home-cook or dining entries, earn Honeypot |
| <img src="public/images/icon/fridge.png" width="32" style="vertical-align:center"> Fridge | `FridgeTab` | Track ingredient stock & expiry dates **[Coming Soon]** |
| <img src="public/images/icon/myshop.png" width="32" style="vertical-align:center"> My Shop | `ShopTab` | Decorate restaurant, manage NPCs, view stats |
| <img src="public/images/icon/store.png" width="32" style="vertical-align:center"> Store | `StoreTab` | Buy items or pull gacha with Bagel Tokens |
| <img src="public/images/icon/achievement.png" width="32" style="vertical-align:center"> Collection | `CollectionTab` | Achievements with reward slots **[Coming Soon]** |

## Currency

| Currency | Earned by | Spent on |
|---|---|---|
| <img src="public/images/currency/honeypot.png" width="32" style="vertical-align:center"> Honeypot | Logging entries (+80 cook / +50 dine) | Buying items in Shop |
| <img src="public/images/currency/bagel.png" width="32" style="vertical-align:center"> Bagel | Earning from achievement or mission | Gacha pulls |

## Changelog

### 2026-04-17
- Renamed entry types: "Home" → **Recipe** (orange), "Dining" → **Review** (green) across all cards and modals
- `RecordModal`: header now shows `{nickname}'s Recipe / Review`; Close button replaced with **Save** (captures card as PNG via html2canvas; Web Share API on mobile, download fallback on desktop)
- Removed star rating system from Review (dine) entries in add form, card, and detail view
- Location search replaced with **Photon (OpenStreetMap)** API — real address autocomplete, no API key; custom location fallback when no results found (type + confirm, like tags)
- Address format corrected to `{number} {street}` order; all `📍` emoji replaced with `pin.png` icon
- Journal page: added sticky **filter/sort bar** — All / Recipe / Review tabs + Sort dropdown (date newest/oldest + meal time: Breakfast, Brunch, Lunch, Dinner, Afternoon Tea)
- Meal time list updated: removed Late Night, added Brunch (after Breakfast)
- Record cards: category badge color-coded; watermark icon (spatula / plate) top-right at 60% opacity; clickable photo thumbnails open full-screen **Lightbox**
- Added `src/components/Lightbox.jsx` — shared full-screen photo viewer with Esc-to-close

### 2026-04-15
- Edit entry flow: clicking Edit pre-fills `AddModal` with existing data; `updateRecord` patches state by id
- `RecordModal`: cleaned up UI (no icon, left-aligned details, ingredients table above notes, Edit/Close buttons)
- `ProfileModal`: Favourite Tags replaced with chips + "+" search overlay, tags loaded from Supabase `core.tag`
- General UI polish: removed emoji and unnecessary badges from journal cards, header, and preview step

### 2026-04-14
- Refactored monolithic `App.jsx` (1388 lines) into a modular structure
- Extracted all data tables and design tokens into `src/constants.js`
- Extracted localStorage logic into `src/state.js`
- Split all tab pages into `src/tabs/` (JournalTab, FridgeTab, ShopTab, StoreTab, CollectionTab)
- Split all modals into `src/modals/` (AddModal, GachaModal, ProfileModal, RecordModal)
- Fixed missing `mealIcon` definition (now exported from `constants.js`)

### 2026-04-12
- Integrated Supabase `core` schema: `avatar` and `avatar_bgcolor` tables drive profile avatar selection
- Avatar picker refactored into a pop-up with two tabs (Avatar / Background Color)
- Profile avatar stored as `avatarUrl` + `avatarBgHex` in app state (replaces `avatarEmoji`)
- Header XP bar moved to full-width second row below avatar/name/currency
- Settings emoji replaced with `setting.png` icon throughout
- Added `src/lib/supabase.js` and `src/hooks/useAppData.js` for DB integration

### 2026-04-08
- Initial release with hardcoded fallback data
- Journal, Shop, Store (gacha), Fridge, Collection tabs
- AddModal: type selection, ingredient search, meal time multi-select, location lock for Home Cook

---
## 👤 Author
Ricy Hsu

---
## 📅 Last Updated
April 17, 2026
