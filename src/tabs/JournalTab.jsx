import { useState } from "react";
import { T } from "../constants";
import Lightbox from "../components/Lightbox";

/* ── Filter / Sort / Search bar ─────────────────────────────────────── */
function JournalBar({ typeFilter, setTypeFilter, sortOrder, setSortOrder, mealFilter, setMealFilter }) {
  const [sortOpen, setSortOpen] = useState(false);
  const TYPES = [
    { id: "all",  label: "All",    bg: T.aquaPale, border: T.aquaLight, color: T.aquaDark },
    { id: "cook", label: "Recipe", bg: "#FFF3E0",  border: "#FFB74D",   color: "#E65100"  },
    { id: "dine", label: "Review", bg: "#E8F5E9",  border: "#81C784",   color: "#2E7D32"  },
  ];
  const SORTS = [
    { id: "newest", label: "Date: Late to Early" },
    { id: "oldest", label: "Date: Early to Late" },
  ];
  const MEALS = ["Breakfast","Brunch","Lunch","Dinner","Afternoon Tea"];
  const hasFilter = mealFilter !== null;
  return (
    <div style={{ padding: "10px 14px 8px", background: T.white, borderBottom: `1px solid ${T.aquaLight}`, position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setTypeFilter(t.id)}
            style={{ flex: 3, padding: "5px 0", borderRadius: 20, border: `1.5px solid ${typeFilter === t.id ? t.border : T.aquaLight}`, background: typeFilter === t.id ? t.bg : T.snow, color: typeFilter === t.id ? t.color : T.textLight, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .15s" }}>
            {t.label}
          </button>
        ))}
        {/* Sort button */}
        <div style={{ flex: 2, position: "relative" }}>
          <button onClick={() => setSortOpen(o => !o)}
            style={{ width: "100%", padding: "5px 0", borderRadius: 20, border: `1.5px solid ${sortOpen || hasFilter ? T.aquaDark : T.aquaLight}`, background: sortOpen || hasFilter ? T.aquaPale : T.snow, color: T.aquaDark, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all .15s" }}>
            Sort ▾
          </button>
          {sortOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: T.white, border: `1.5px solid ${T.aquaLight}`, borderRadius: 14, boxShadow: `0 6px 20px rgba(61,216,232,.15)`, overflow: "hidden", zIndex: 50, minWidth: 168 }}>
              {/* Date sort */}
              {SORTS.map(s => (
                <div key={s.id} onClick={() => { setSortOrder(s.id); setSortOpen(false); }}
                  style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: sortOrder === s.id ? T.aquaDark : T.textMid, background: sortOrder === s.id ? T.aquaPale : T.white, cursor: "pointer", borderBottom: `1px solid ${T.aquaLight}44` }}>
                  {s.label}
                </div>
              ))}
              {/* Divider */}
              <div style={{ padding: "5px 14px 3px", fontSize: 10, fontWeight: 800, color: T.textLight, letterSpacing: ".04em", borderBottom: `1px solid ${T.aquaLight}44`, background: T.snow }}>MEAL</div>
              {/* All meals option */}
              <div onClick={() => { setMealFilter(null); setSortOpen(false); }}
                style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: mealFilter === null ? T.aquaDark : T.textMid, background: mealFilter === null ? T.aquaPale : T.white, cursor: "pointer", borderBottom: `1px solid ${T.aquaLight}44` }}>
                All Meals
              </div>
              {MEALS.map(m => (
                <div key={m} onClick={() => { setMealFilter(m); setSortOpen(false); }}
                  style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: mealFilter === m ? T.aquaDark : T.textMid, background: mealFilter === m ? T.aquaPale : T.white, cursor: "pointer", borderBottom: `1px solid ${T.aquaLight}44` }}>
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main tab ────────────────────────────────────────────────────────── */
export default function JournalTab({ S, onAdd, onSel, onDelete }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder]   = useState("newest");
  const [mealFilter, setMealFilter] = useState(null);

  const records = [...S.records]
    .filter(r => typeFilter === "all" || r.type === typeFilter)
    .filter(r => !mealFilter || (r.mealTime && r.mealTime.includes(mealFilter)))
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  return (
    <div style={{ animation: "fadeSlide .3s ease" }}>
      <JournalBar
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        sortOrder={sortOrder}   setSortOrder={setSortOrder}
        mealFilter={mealFilter} setMealFilter={setMealFilter}
      />
      {records.length === 0
        ? S.records.length === 0
          ? <EmptyJournal onAdd={onAdd} />
          : <NoResults typeFilter={typeFilter} />
        : <div style={{ padding: "10px 14px" }}>
            {records.map(r => <RecordCard key={r.id} record={r} onClick={() => onSel(r)} onDelete={onDelete} />)}
          </div>
      }
      <button onClick={onAdd} style={{ position: "absolute", bottom: 90, right: 16, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${T.aqua},${T.aquaDark})`, border: "none", boxShadow: `0 6px 22px ${T.aquaLight}`, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/images/icon/spatula.png" style={{ width: 30, height: 30, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
      </button>
    </div>
  );
}

/* ── Empty states ────────────────────────────────────────────────────── */
function EmptyJournal({ onAdd }) {
  return (
    <div style={{ padding: "28px 22px", textAlign: "center", animation: "fadeSlide .4s ease" }}>
      <img src="/images/icon/plate.png" style={{ width: 100, height: 100, objectFit: "contain", animation: "drift 3s ease-in-out infinite", display: "block", margin: "0 auto 10px" }} />
      <div style={{ fontWeight: 900, fontSize: 20, color: T.textDark, marginBottom: 8 }}>Your journal is empty!</div>
      <div style={{ color: T.textMid, fontSize: 14, fontWeight: 600, lineHeight: 1.65, marginBottom: 18 }}>Log your first dish or dining experience<br />and start your food adventure ✦</div>
      <button onClick={onAdd} style={{ background: `linear-gradient(135deg,${T.pink},${T.purple})`, border: "none", borderRadius: 25, padding: "5px 40px", color: T.white, fontSize: 16, fontWeight: 900, boxShadow: `0 6px 22px ${T.pinkLight}`, display: "inline-flex", alignItems: "center", gap: 10 }}>
        <img src="/images/icon/spatula_click.png" style={{ width: 48, height: 48, objectFit: "contain" }} />
        Add First Entry
      </button>
    </div>
  );
}

function NoResults({ typeFilter }) {
  return (
    <div style={{ padding: "40px 22px", textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: T.textDark, marginBottom: 6 }}>No entries yet</div>
      <div style={{ color: T.textMid, fontSize: 13, fontWeight: 600 }}>
        No {typeFilter === "cook" ? "Recipe" : "Review"} entries found
      </div>
    </div>
  );
}

/* ── Record card ─────────────────────────────────────────────────────── */
function RecordCard({ record, onClick, onDelete }) {
  const isCook = record.type === "cook";
  const [lightbox, setLightbox] = useState(null);
  const handleDelete = e => {
    e.stopPropagation();
    if (window.confirm(`Delete "${record.title}"? This cannot be undone.`)) onDelete(record.id);
  };
  return (
    <div style={{ position: "relative", background: T.white, border: `2px solid ${isCook ? "#FFB74D" : "#81C784"}`, borderRadius: 20, padding: "13px 15px", marginBottom: 10, boxShadow: `0 3px 14px ${isCook ? "rgba(255,183,77,.15)" : "rgba(129,199,132,.12)"}`, transition: "transform .12s", overflow: "hidden" }}>
      {/* watermark */}
      <img src={isCook ? "/images/icon/spatula_click.png" : "/images/icon/plate.png"} alt="" style={{ position: "absolute", top: 8, right: 10, width: 96, height: 96, objectFit: "contain", opacity: .6, pointerEvents: "none", userSelect: "none" }} />
      {/* card body */}
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
          <span style={{ background: isCook ? "#FFF3E0" : "#E8F5E9", border: `1px solid ${isCook ? "#FFB74D" : "#81C784"}`, borderRadius: 10, padding: "2px 8px", color: isCook ? "#E65100" : "#2E7D32", fontSize: 11, fontWeight: 700 }}>{isCook ? "Recipe" : "Review"}</span>
          <span style={{ color: T.textLight, fontSize: 11, fontWeight: 600 }}>{record.mealTime}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: T.textDark, marginBottom: 3 }}>{record.title}</div>
        {record.address && <div style={{ display: "flex", alignItems: "center", gap: 3, color: T.textMid, fontSize: 12, fontWeight: 600, marginBottom: 2 }}><img src="/images/icon/pin.png" style={{ width: 13, height: 13, objectFit: "contain", flexShrink: 0 }} />{record.address}</div>}
        {isCook && record.rating > 0 && <div style={{ color: T.gold, fontSize: 13 }}>{"★".repeat(record.rating)}{"☆".repeat(5 - record.rating)}</div>}
        {record.photos?.length > 0 && (
          <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {record.photos.slice(0, 3).map((p, i) => (
              <div key={i} onClick={() => setLightbox(p.preview)} style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${T.aquaPale},${T.pinkPale})`, border: `1px solid ${T.aquaLight}`, overflow: "hidden", cursor: "zoom-in" }}>
                {p.preview && <img src={p.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
              </div>
            ))}
            {record.photos.length > 3 && <div style={{ width: 44, height: 44, borderRadius: 10, background: T.aquaPale, border: `1px solid ${T.aquaLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.aquaDark }}>+{record.photos.length - 3}</div>}
          </div>
        )}
        {(record.tagLabels || record.tags)?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {(record.tagLabels || record.tags).slice(0, 4).map(t => <span key={t} style={{ background: T.snow, border: `1px solid ${T.aquaLight}`, borderRadius: 8, padding: "2px 6px", color: T.textMid, fontSize: 10, fontWeight: 600 }}>#{t}</span>)}
          </div>
        )}
      </div>
      {/* Edit / Delete */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.aquaLight}55` }}>
        <button onClick={onClick} style={{ flex: 1, background: "#E8F8F0", border: "1.5px solid #4CAF82", borderRadius: 10, padding: "6px 0", color: "#2E7D52", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Edit</button>
        <button onClick={handleDelete} style={{ flex: 1, background: "#FFF0F0", border: "1.5px solid #FF6B6B", borderRadius: 10, padding: "6px 0", color: "#D32F2F", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Delete</button>
      </div>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
