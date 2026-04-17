/* ── CURRENCY ───────────────────────────────────────────── */
export const CURRENCY={
  honeypot:{icon:"/images/currency/honeypot.png",name:"Honeypot"},
  bagel:   {icon:"/images/currency/bagel.png",   name:"Bagel"},
};

/* ── TOKENS ─────────────────────────────────────────────── */
export const T={
  aqua:"#3DD8E8",aquaDark:"#1BB8CC",aquaLight:"#B8F3F9",aquaPale:"#D6F6FA",
  pink:"#FF6BAD",pinkDark:"#E0508F",pinkLight:"#FFB3D6",pinkPale:"#FFF0F7",
  purple:"#C084FC",purplePale:"#F5EEFF",
  white:"#FFFFFF",snow:"#F4FBFD",
  textDark:"#2D3B55",textMid:"#7A90AD",textLight:"#B0C4D8",
  gold:"#FFB830",goldLight:"#FFE5A0",
  honey:"#E8935A",
};

/* ── RARITY TABLE ── (border = DB hex darkened ~15%; bg = very light tint)
   DB source: rarity_color_hex  Normal #FFFFFF · Rare #1EFF00 · Epic #0070FF
                                 Legendary #A335EE · Unique #FF8000          */
export const RARITY={
  Common:   {border:"#CCCCCC",bg:"#FAFAFA",      col:"#999999",anim:null},
  Rare:     {border:"#15D400",bg:"#F0FFF0",      col:"#13BB00",anim:null},
  Epic:     {border:"#005CD8",bg:"#EEF5FF",      col:"#0055CC",anim:"epicShimmer"},
  Legendary:{border:"#8822D4",bg:"#F7EEFF",      col:"#8020CC",anim:"legendTrail"},
  Unique:   {border:"#D86A00",bg:"#FFF5E5",      col:"#CC6400",anim:"uniqueSparkle"},
};

/* ── TAG TABLE ──────────────────────────────────────────── */
export const CUISINE_TAGS=[
  {id:"taiwanese",label:"Taiwanese",dineoutonly:0},{id:"japanese",label:"Japanese",dineoutonly:0},
  {id:"korean",label:"Korean",dineoutonly:0},{id:"italian",label:"Italian",dineoutonly:0},
  {id:"american",label:"American",dineoutonly:0},{id:"chinese",label:"Chinese",dineoutonly:0},
  {id:"thai",label:"Thai",dineoutonly:0},{id:"french",label:"French",dineoutonly:0},
  {id:"vegetarian",label:"Vegetarian",dineoutonly:0},{id:"dessert",label:"Dessert",dineoutonly:0},
  {id:"noodles",label:"Noodles",dineoutonly:0},{id:"seafood",label:"Seafood",dineoutonly:0},
  {id:"bbq",label:"BBQ",dineoutonly:0},{id:"hotpot",label:"Hot Pot",dineoutonly:0},
  {id:"healthy",label:"Healthy",dineoutonly:0},{id:"spicy",label:"Spicy",dineoutonly:0},
  {id:"brunch",label:"Brunch",dineoutonly:0},
  {id:"ambiance",label:"Ambiance",dineoutonly:1},{id:"date_spot",label:"Date Spot",dineoutonly:1},
  {id:"insta",label:"Instagrammable",dineoutonly:1},{id:"hidden_gem",label:"Hidden Gem",dineoutonly:1},
  {id:"fast_casual",label:"Fast Casual",dineoutonly:1},{id:"fine_dining",label:"Fine Dining",dineoutonly:1},
  {id:"takeout",label:"Takeout",dineoutonly:1},{id:"rooftop",label:"Rooftop",dineoutonly:1},
];

/* ── STORE TABLE (03_Store) ─────────────────────────────── */
/* list_category values: Furniture | Decoration | Wall & Floor  */
export const STORE_ITEMS=[
  {id:"sign_wood", list_category:"Decoration",  name:"Wooden Sign",   price:80,  item_qty:99,rarity:"Common",   emoji:"🪵",item_col:"#C4895A",gacha_only:false},
  {id:"table_b",   list_category:"Furniture",   name:"Wooden Table",  price:120, item_qty:99,rarity:"Common",   emoji:"🪑",item_col:"#C4895A",gacha_only:false},
  {id:"plant_s",   list_category:"Decoration",  name:"Mini Plant",    price:60,  item_qty:99,rarity:"Common",   emoji:"🌱",item_col:"#4DC87A",gacha_only:false},
  {id:"lamp_b",    list_category:"Decoration",  name:"Pendant Lamp",  price:100, item_qty:99,rarity:"Common",   emoji:"🔆",item_col:"#FFB830",gacha_only:false},
  {id:"art_ramen", list_category:"Wall & Floor",name:"Ramen Mural",   price:200, item_qty:99,rarity:"Common",   emoji:"🖼️",item_col:"#FF8C5A",gacha_only:false},
  {id:"lucky_cat", list_category:"Decoration",  name:"Lucky Cat",     price:180, item_qty:99,rarity:"Common",   emoji:"🐱",item_col:"#FFB830",gacha_only:false},
  {id:"plant_b",   list_category:"Decoration",  name:"Banyan Tree",   price:350, item_qty:99,rarity:"Rare",     emoji:"🌳",item_col:"#2DA856",gacha_only:false},
  {id:"lamp_f",    list_category:"Decoration",  name:"Crystal Lamp",  price:500, item_qty:99,rarity:"Rare",     emoji:"🔮",item_col:"#C084FC",gacha_only:false},
  {id:"art_sushi", list_category:"Wall & Floor",name:"Sushi Mural",   price:300, item_qty:99,rarity:"Rare",     emoji:"🎨",item_col:"#3DD8E8",gacha_only:false},
  // gacha-only
  {id:"sign_neon", list_category:"Decoration",  name:"Neon Sign",     bagels:3,  item_qty:1, rarity:"Rare",     emoji:"💡",item_col:"#FF6BAD",gacha_only:true},
  {id:"fairy_lgt", list_category:"Decoration",  name:"Fairy Lights",  bagels:5,  item_qty:1, rarity:"Rare",     emoji:"🌟",item_col:"#FFC0CB",gacha_only:true},
  {id:"trophy",    list_category:"Decoration",  name:"Chef Trophy",   bagels:6,  item_qty:1, rarity:"Epic",     emoji:"🏆",item_col:"#FFD700",gacha_only:true},
  {id:"fountain",  list_category:"Decoration",  name:"Mini Fountain", bagels:10, item_qty:1, rarity:"Epic",     emoji:"⛲", item_col:"#3DD8E8",gacha_only:true},
  {id:"sakura",    list_category:"Decoration",  name:"Sakura Tree",   bagels:12, item_qty:1, rarity:"Legendary",emoji:"🌸",item_col:"#FFB7C5",gacha_only:true},
  {id:"gold_tbl",  list_category:"Furniture",   name:"Gold Table",    bagels:15, item_qty:1, rarity:"Legendary",emoji:"✨",item_col:"#FFD700",gacha_only:true},
  {id:"rainbow",   list_category:"Wall & Floor",name:"Rainbow Arch",  bagels:20, item_qty:1, rarity:"Unique",   emoji:"🌈",item_col:"#FF6B6B",gacha_only:true},
  {id:"noren",     list_category:"Wall & Floor",name:"Noren Curtain", bagels:8,  item_qty:1, rarity:"Rare",     emoji:"🎏",item_col:"#E8935A",gacha_only:true},
  {id:"lantern",   list_category:"Decoration",  name:"Paper Lantern", bagels:4,  item_qty:1, rarity:"Common",   emoji:"🏮",item_col:"#FF6B6B",gacha_only:true},
];

/* ── GACHA TABLE (08_Gacha) — determines pools & count ─── */
export const GACHA_TABLE=[
  {
    pool_id:"cozy",
    pool_name:"Cozy Corner Gacha",
    pool_emoji:"🎲",
    item_ids:["sign_neon","fairy_lgt","trophy","fountain","sakura","gold_tbl","rainbow"],
  },
  {
    pool_id:"spring",
    pool_name:"Spring Blossom Special",
    pool_emoji:"🌸",
    item_ids:["sakura","rainbow","fairy_lgt","noren","lantern","fountain"],
  },
];

/* ── GACHA PRICE ────────────────────────────────────────── */
export const GACHA_BAGEL_PRICE=1;

/* ── INGREDIENT TABLE ───────────────────────────────────── */
export const INGREDIENTS=[
  {id:"chicken",name:"Chicken Breast",emoji:"🍗",unit:"piece",food_type:"protein"},
  {id:"egg",    name:"Egg",           emoji:"🥚",unit:"piece",food_type:"protein"},
  {id:"beef",   name:"Beef",          emoji:"🥩",unit:"g",    food_type:"protein"},
  {id:"salmon", name:"Salmon",        emoji:"🐟",unit:"g",    food_type:"seafood"},
  {id:"rice",   name:"Rice",          emoji:"🍚",unit:"g",    food_type:"staple"},
  {id:"pasta",  name:"Pasta",         emoji:"🍝",unit:"g",    food_type:"staple"},
  {id:"garlic", name:"Garlic",        emoji:"🧄",unit:"clove",food_type:"veggie"},
  {id:"onion",  name:"Onion",         emoji:"🧅",unit:"piece",food_type:"veggie"},
  {id:"tomato", name:"Tomato",        emoji:"🍅",unit:"piece",food_type:"veggie"},
  {id:"spinach",name:"Spinach",       emoji:"🥬",unit:"g",    food_type:"veggie"},
  {id:"butter", name:"Butter",        emoji:"🧈",unit:"g",    food_type:"dairy"},
  {id:"milk",   name:"Milk",          emoji:"🥛",unit:"ml",   food_type:"dairy"},
  {id:"cheese", name:"Cheese",        emoji:"🧀",unit:"g",    food_type:"dairy"},
  {id:"flour",  name:"Flour",         emoji:"🌾",unit:"g",    food_type:"staple"},
];

/* ── ACHIEVEMENTS TABLE (with reward slots) ─────────────── */
export const ACHIEVEMENTS=[
  {id:"first_cook", icon:"🍳",name:"First Dish",      desc:"Log your first home-cooked meal",   reward:{icon:"🥄",name:"Wooden Spoon",   rarity:"Common"},   cond:s=>s.records.filter(r=>r.type==="cook").length>=1},
  {id:"first_dine", icon:"🍽️",name:"First Outing",   desc:"Log your first dining experience",   reward:{icon:"🍽️",name:"Table Setting",  rarity:"Common"},   cond:s=>s.records.filter(r=>r.type==="dine").length>=1},
  {id:"cook_5",     icon:"👨‍🍳",name:"Home Chef",     desc:"Cook 5 homemade dishes",             reward:{icon:"👨‍🍳",name:"Chef Hat Pin",  rarity:"Rare"},     cond:s=>s.records.filter(r=>r.type==="cook").length>=5},
  {id:"cook_10",    icon:"🌟",name:"Kitchen Star",    desc:"Cook 10 homemade dishes",            reward:{icon:"⭐",name:"Gold Star Frame", rarity:"Epic"},     cond:s=>s.records.filter(r=>r.type==="cook").length>=10},
  {id:"dine_5",     icon:"🗺️",name:"Food Explorer",  desc:"Log 5 dining experiences",           reward:{icon:"🗺️",name:"Explorer Badge", rarity:"Rare"},     cond:s=>s.records.filter(r=>r.type==="dine").length>=5},
  {id:"earn_500",   icon:"💰",name:"Honey Hoarder",   desc:"Accumulate 500 Honeypot",            reward:{icon:CURRENCY.honeypot.icon,name:"Golden Pot",rarity:"Epic"},     cond:s=>s.totalEarned>=500},
  {id:"shop_1",     icon:"🛋️",name:"First Decor",    desc:"Own your first decoration",          reward:{icon:"🛋️",name:"Mini Sofa Tag", rarity:"Common"},   cond:s=>s.owned.length>=1},
  {id:"shop_5",     icon:"🏠",name:"Cozy Shop",       desc:"Own 5 decorations",                  reward:{icon:"🏠",name:"House Banner",   rarity:"Rare"},     cond:s=>s.owned.length>=5},
  {id:"streak_3",   icon:"🔥",name:"On a Roll",       desc:"Log food 3 days in a row",           reward:{icon:"🔥",name:"Flame Charm",    rarity:"Common"},   cond:s=>s.streak>=3},
  {id:"streak_7",   icon:"🗓️",name:"Week Warrior",   desc:"Log food 7 days in a row",           reward:{icon:"🗓️",name:"Calendar Pin",  rarity:"Rare"},     cond:s=>s.streak>=7},
  {id:"log_10",     icon:"📔",name:"Getting Serious", desc:"Log 10 entries total",               reward:{icon:"📔",name:"Journal Cover",  rarity:"Rare"},     cond:s=>s.records.length>=10},
  {id:"rare_1",     icon:"💎",name:"Rare Collector",  desc:"Pull a Rare or higher item",         reward:{icon:"💎",name:"Diamond Frame",  rarity:"Epic"},     cond:s=>s.owned.some(id=>{const r=STORE_ITEMS.find(i=>i.id===id)?.rarity;return["Rare","Epic","Legendary","Unique"].includes(r);})},
  {id:"fridge_5",   icon:"🧊",name:"Stocked Up",      desc:"Add 5 ingredients to fridge",        reward:{icon:"🧊",name:"Ice Crystal",    rarity:"Common"},   cond:s=>s.fridge.length>=5},
  {id:"first_bagel",icon:"🥯",name:"Bagel Baker",     desc:"Earn your first Bagel token",        reward:{icon:CURRENCY.bagel.icon,name:"Bagel Token",rarity:"Common"},   cond:s=>s.totalBagels>=1},
  {id:"npc_1",      icon:"👥",name:"Not Alone",       desc:"Add your first NPC character",       reward:{icon:"👥",name:"NPC Card",       rarity:"Rare"},     cond:s=>s.npcs.length>=1},
];

export const MEAL_FILTERS=[
  {id:"all",label:"All"},{id:"cook",label:"🍳 Home"},{id:"dine",label:"🍽️ Dining"},
  {id:"Breakfast",label:"☀️ Breakfast"},{id:"Brunch",label:"🌅 Brunch"},
  {id:"Lunch",label:"🌤️ Lunch"},{id:"Dinner",label:"🌙 Dinner"},
  {id:"Afternoon Tea",label:"☕ Tea"},
];
export const MEAL_TIMES=["Breakfast","Brunch","Lunch","Dinner","Afternoon Tea"];
export const mealIcon={Breakfast:"☀️",Brunch:"🌅",Lunch:"🌤️",Dinner:"🌙","Afternoon Tea":"☕"};
export const NPC_AVATARS=["👦","👧","🧑","👱","🧔","🧓","👴","👵","🧙","🧚","🧜","🦸","🧑‍🍳","🧑‍🎨","🤖","👻","🐱","🐶","🐰","🦊","🐻","🐼","🦁","🐸"];
export const NPC_LINES=["This smells amazing!","Table for two?","I'll have the usual!","Best spot in town!","Is the special ready?","Cozy place!","Can I see the menu?","The food here is 💯","When does kitchen open?","Love this restaurant!"];
export const MOCK_ADDR=["123 Main St, San Francisco, CA","456 Melrose Ave, Los Angeles, CA","789 5th Ave, New York, NY","321 Michigan Ave, Chicago, IL"];
