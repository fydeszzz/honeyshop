# 🍯 HoneyShop: A Food Journaling App with Gamification
~ Log Meals · Earn Honeypots · Decorate Your Shop ~

## Features
- Log your recipes and food reviews to earn opening funds
- Watch your real-life efforts magically turn into a thriving little shop
- Customize your shop with thousands of decorations and furniture pieces
- Invite family, lovers, and friends to help run the shop together
- Become an amazing chef, food critic, interior designer, and shop owner all at once!

## Tech Stack
- **React 18** + **Vite** (web app)
- Static assets served from `public/`

## Project Structure

```
HoneyShop/
├── src/                          # Source code
│   ├── main.jsx                  # Entry point
│   └── App.jsx                   # Main app component
│
├── public/                       # Static assets (deployed as-is)
│   └── images/
│       ├── avatars/              # User avatar images
│       │               
│       ├── furniture/            # Shop furniture images
│       │   └── {name}_WxH.png    # Named by grid size
│       └── currency/             # In-app currency icons (bagel, honeypot)
│
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```