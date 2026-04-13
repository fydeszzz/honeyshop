# 🍯 HoneyShop: A Food Journaling App with Gamification
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
│   ├── App.jsx               # Entire app — all components & data tables in one file
│   ├── lib/
│   │   └── supabase.js       # Supabase client (reads VITE_SUPABASE_* env vars)
│   └── hooks/
│       └── useAppData.js     # Fetches tag / store / gacha from Supabase on mount
│
├── public/
│   └── images/
│       ├── avatars/          # User avatar images (e.g. 01_rabbit.png)
│       ├── furniture/        # Shop decoration images  {name}_WxH.png
│       ├── currency/         # In-app currency icons (honeypot, bagel)
│       └── icon/             # UI icons (setting.png, spatula_click.png, plate.png …)
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
| 📓 Journal | `JournalTab` | Log home-cook or dining entries, earn Honeypot |
| 🧊 Fridge | `FridgeTab` | Track ingredient stock & expiry dates | **[Coming Soon]**
| 🏪 Shop | `ShopTab` | Decorate restaurant, manage NPCs, view stats |
| 🛒 Store | `StoreTab` → `ShopBuyView` / `GachaView` | Buy items or pull gacha with Bagel Tokens |
| 🏆 Collection | `CollectionTab` | Achievements with reward slots; Collection **[Coming Soon]**|

## Currency

| Currency | Earned by | Spent on |
|---|---|---|
| 🍯 Honeypot | Logging entries (+80 cook / +50 dine) | Buying items in Shop |
| 🥯 Bagel Token | Every 5 entries logged | Gacha pulls (1 token/pull) |

## Supabase Setup

1. Create a project on [supabase.com](https://supabase.com)
2. Copy **Project URL** and **anon key** into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. In Supabase **Settings > Data API**, add `core` to Exposed schemas
4. In **SQL Editor**, grant read access:
   ```sql
   GRANT USAGE ON SCHEMA core TO anon, authenticated;
   GRANT SELECT ON ALL TABLES IN SCHEMA core TO anon, authenticated;
   ```

## Changelog

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
April 12, 2026