import { useState, useEffect } from "react";
import {
  Search, MapPin, Users, Building2, Coffee, X, Calendar,
  Clock, ChevronRight, Star, Wifi, Car, Printer, CheckCircle2,
  XCircle, ArrowLeft, User, LayoutDashboard, BookOpen,
  Monitor, DoorOpen, BriefcaseBusiness, Filter, Zap,
} from "lucide-react";

// ─── Global Styles (polices + tokens CSS) ────────────────────────────────────

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --background: #090C14;
    --foreground: #E6EAF0;
    --card: #111620;
    --card-foreground: #E6EAF0;
    --popover: #131824;
    --popover-foreground: #E6EAF0;
    --primary: #0BE49A;
    --primary-foreground: #050C12;
    --secondary: #1A2032;
    --secondary-foreground: #E6EAF0;
    --muted: #161C2A;
    --muted-foreground: #6B7A96;
    --accent: #1A2032;
    --accent-foreground: #0BE49A;
    --destructive: #EF4444;
    --destructive-foreground: #ffffff;
    --border: rgba(255,255,255,0.07);
    --input: transparent;
    --input-background: #161C2A;
    --switch-background: #2A3348;
    --ring: #0BE49A;
    --radius: 0.5rem;
  }

  body { background: var(--background); color: var(--foreground); }

  .font-display { font-family: 'Barlow', 'Barlow Condensed', sans-serif; }

  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(0.4); cursor: pointer;
  }
  select option { background: #111620; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type DeskType = "open" | "meeting" | "private";
type ReservationStatus = "confirmed" | "pending" | "cancelled";
type View = "dashboard" | "space" | "profile";

interface Space {
  id: string; name: string; city: string; address: string;
  rating: number; reviewCount: number; capacity: number; available: number;
  amenities: string[]; imageId: string; priceFrom: number; description: string;
}

interface Desk {
  id: string; spaceId: string; name: string; type: DeskType;
  capacity: number; pricePerHour: number; available: boolean; floor: number;
}

interface Reservation {
  id: string; spaceId: string; spaceName: string; deskId: string;
  deskName: string; deskType: DeskType; date: string; startTime: string;
  endTime: string; status: ReservationStatus; totalPrice: number; createdAt: string;
}

// ─── Données Mock ─────────────────────────────────────────────────────────────

const SPACES: Space[] = [
  {
    id: "s1", name: "Nexus Hub", city: "Paris",
    address: "42 Rue du Faubourg Saint-Antoine, 75011",
    rating: 4.8, reviewCount: 312, capacity: 120, available: 34,
    amenities: ["wifi", "parking", "printer", "coffee"],
    imageId: "photo-1497366216548-37526070297c", priceFrom: 18,
    description: "Cœur de Bastille, loft industriel avec plafonds à 5m et terrasse panoramique.",
  },
  {
    id: "s2", name: "Atelier Nord", city: "Paris",
    address: "18 Rue de la Chapelle, 75018",
    rating: 4.6, reviewCount: 189, capacity: 80, available: 12,
    amenities: ["wifi", "coffee", "printer"],
    imageId: "photo-1497366811353-6870744d04b2", priceFrom: 14,
    description: "Ancienne imprimerie avec briques apparentes, cabines téléphoniques et un étage calme.",
  },
  {
    id: "s3", name: "Station Lyon", city: "Lyon",
    address: "7 Place Bellecour, 69002",
    rating: 4.9, reviewCount: 427, capacity: 200, available: 61,
    amenities: ["wifi", "parking", "printer", "coffee"],
    imageId: "photo-1521737604893-d14cc237f11d", priceFrom: 16,
    description: "Espace phare sur la Place Bellecour — vue panoramique, café et 3 auditoriums.",
  },
  {
    id: "s4", name: "Le Dock", city: "Marseille",
    address: "2 Place de la Joliette, 13002",
    rating: 4.7, reviewCount: 204, capacity: 150, available: 48,
    amenities: ["wifi", "coffee", "parking"],
    imageId: "photo-1497366754035-f200968a6e72", priceFrom: 12,
    description: "Ancien dock réinventé en campus créatif maritime avec vue sur mer.",
  },
  {
    id: "s5", name: "Confluence Lab", city: "Lyon",
    address: "112 Cours Charlemagne, 69002",
    rating: 4.5, reviewCount: 156, capacity: 90, available: 27,
    amenities: ["wifi", "printer", "coffee"],
    imageId: "photo-1497366412874-3415097a27e7", priceFrom: 15,
    description: "Plateaux lumineux dans le quartier Confluence, entourés d'agences de design.",
  },
  {
    id: "s6", name: "Quartier Libre", city: "Bordeaux",
    address: "28 Quai des Chartrons, 33000",
    rating: 4.7, reviewCount: 261, capacity: 110, available: 19,
    amenities: ["wifi", "parking", "coffee"],
    imageId: "photo-1556761175-4b46a572b786", priceFrom: 13,
    description: "Patrimoine et tech : bâtiment haussmannien en bord de Garonne.",
  },
];

const DESKS: Desk[] = [
  { id: "d1", spaceId: "s1", name: "Open Desk A-14", type: "open", capacity: 1, pricePerHour: 8, available: true, floor: 1 },
  { id: "d2", spaceId: "s1", name: "Open Desk B-07", type: "open", capacity: 1, pricePerHour: 8, available: true, floor: 1 },
  { id: "d3", spaceId: "s1", name: "Salle Atlas", type: "meeting", capacity: 8, pricePerHour: 35, available: true, floor: 2 },
  { id: "d4", spaceId: "s1", name: "Bureau Privé 101", type: "private", capacity: 2, pricePerHour: 22, available: false, floor: 1 },
  { id: "d5", spaceId: "s1", name: "Salle Horizon", type: "meeting", capacity: 14, pricePerHour: 55, available: true, floor: 3 },
  { id: "d6", spaceId: "s1", name: "Bureau Privé 204", type: "private", capacity: 4, pricePerHour: 40, available: true, floor: 2 },
  { id: "d7", spaceId: "s2", name: "Open Desk C-01", type: "open", capacity: 1, pricePerHour: 7, available: true, floor: 1 },
  { id: "d8", spaceId: "s2", name: "Salle Lumière", type: "meeting", capacity: 6, pricePerHour: 28, available: true, floor: 2 },
  { id: "d9", spaceId: "s3", name: "Open Desk D-22", type: "open", capacity: 1, pricePerHour: 9, available: true, floor: 1 },
  { id: "d10", spaceId: "s3", name: "Salle Summit", type: "meeting", capacity: 20, pricePerHour: 80, available: true, floor: 4 },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "r1", spaceId: "s1", spaceName: "Nexus Hub", deskId: "d3",
    deskName: "Salle Atlas", deskType: "meeting",
    date: "2026-07-08", startTime: "09:00", endTime: "12:00",
    status: "confirmed", totalPrice: 105, createdAt: "2026-06-28",
  },
  {
    id: "r2", spaceId: "s3", spaceName: "Station Lyon", deskId: "d9",
    deskName: "Open Desk D-22", deskType: "open",
    date: "2026-07-15", startTime: "08:00", endTime: "18:00",
    status: "confirmed", totalPrice: 90, createdAt: "2026-06-29",
  },
  {
    id: "r3", spaceId: "s2", spaceName: "Atelier Nord", deskId: "d7",
    deskName: "Open Desk C-01", deskType: "open",
    date: "2026-06-20", startTime: "10:00", endTime: "14:00",
    status: "confirmed", totalPrice: 28, createdAt: "2026-06-15",
  },
  {
    id: "r4", spaceId: "s1", spaceName: "Nexus Hub", deskId: "d6",
    deskName: "Bureau Privé 204", deskType: "private",
    date: "2026-06-10", startTime: "09:00", endTime: "17:00",
    status: "cancelled", totalPrice: 320, createdAt: "2026-06-05",
  },
];

// ─── Constantes ───────────────────────────────────────────────────────────────

const DESK_TYPE_LABELS: Record<DeskType, string> = {
  open: "Open Space", meeting: "Salle de Réunion", private: "Bureau Privé",
};
const DESK_TYPE_ICONS: Record<DeskType, typeof Monitor> = {
  open: Monitor, meeting: Users, private: DoorOpen,
};
const AMENITY_ICONS: Record<string, typeof Wifi> = {
  wifi: Wifi, parking: Car, printer: Printer, coffee: Coffee,
};
const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wifi", parking: "Parking", printer: "Imprimante", coffee: "Café",
};
const CITIES = ["Toutes les villes", "Paris", "Lyon", "Marseille", "Bordeaux"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `${n}€`;
const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

function canCancel(date: string, startTime: string) {
  const diff = (new Date(`${date}T${startTime}:00`).getTime() - Date.now()) / 3_600_000;
  return diff > 24;
}
function calcHours(start: string, end: string) {
  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  return (toMin(end) - toMin(start)) / 60;
}

// ─── Composants atomiques ─────────────────────────────────────────────────────

function Badge({ label, color = "teal" }: { label: string; color?: "teal" | "amber" | "red" | "gray" }) {
  const cls = {
    teal:  "bg-[#0BE49A]/10 text-[#0BE49A] border-[#0BE49A]/20",
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    red:   "bg-red-500/10 text-red-400 border-red-400/20",
    gray:  "bg-white/5 text-[#6B7A96] border-white/10",
  }[color];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${cls}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  if (status === "confirmed") return <Badge label="CONFIRMÉ" color="teal" />;
  if (status === "pending")   return <Badge label="EN ATTENTE" color="amber" />;
  return <Badge label="ANNULÉ" color="red" />;
}

function DeskTypeBadge({ type }: { type: DeskType }) {
  const Icon = DESK_TYPE_ICONS[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/5 text-[#6B7A96] border border-white/8">
      <Icon size={10} />{DESK_TYPE_LABELS[type]}
    </span>
  );
}

// ─── Modal de Réservation ─────────────────────────────────────────────────────

function BookingModal({ desk, space, onClose, onConfirm }: {
  desk: Desk; space: Space;
  onClose: () => void; onConfirm: (r: Reservation) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hours = calcHours(startTime, endTime);
  const total = hours > 0 ? Math.round(hours * desk.pricePerHour) : 0;

  function validate() {
    if (!date) return "Veuillez sélectionner une date.";
    if (date < today) return "La date doit être dans le futur.";
    if (hours <= 0) return "L'heure de fin doit être après l'heure de début.";
    if (hours > 12) return "La durée maximale est de 12 heures.";
    return "";
  }

  function handleConfirm() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    const r: Reservation = {
      id: `r${Date.now()}`, spaceId: space.id, spaceName: space.name,
      deskId: desk.id, deskName: desk.name, deskType: desk.type,
      date, startTime, endTime, status: "confirmed",
      totalPrice: total, createdAt: today,
    };
    setSuccess(true);
    setTimeout(() => { onConfirm(r); onClose(); }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,8,16,0.88)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-md bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(11,228,154,.5),transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <p className="text-[11px] font-mono text-[#6B7A96] uppercase tracking-widest mb-0.5">{space.name}</p>
            <h2 className="font-display text-lg font-bold text-[#E6EAF0]">{desk.name}</h2>
          </div>
          <button onClick={onClose} className="text-[#6B7A96] hover:text-[#E6EAF0] transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <DeskTypeBadge type={desk.type} />
            <Badge label={`${desk.capacity} pers.`} color="gray" />
            <Badge label={`${fmt(desk.pricePerHour)}/h`} color="gray" />
            <Badge label={`Étage ${desk.floor}`} color="gray" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#6B7A96] uppercase tracking-widest mb-1.5">Date</label>
              <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                className="w-full bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2.5 text-sm text-[#E6EAF0] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Début", startTime, setStartTime], ["Fin", endTime, setEndTime]].map(([label, val, setter]) => (
                <div key={label as string}>
                  <label className="block text-xs font-mono text-[#6B7A96] uppercase tracking-widest mb-1.5">{label as string}</label>
                  <input type="time" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)}
                    className="w-full bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2.5 text-sm text-[#E6EAF0] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2.5">
              <XCircle size={14} className="shrink-0" />{error}
            </div>
          )}

          <div className="bg-[#161C2A]/50 border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-[#6B7A96] uppercase tracking-widest">Total estimé</p>
              <p className="font-display text-2xl font-bold text-[#E6EAF0] mt-0.5">
                {hours > 0 ? fmt(total) : "—"}
                {hours > 0 && <span className="text-sm font-normal text-[#6B7A96] ml-1">({hours}h)</span>}
              </p>
            </div>
            {hours > 0 && <CheckCircle2 size={20} className="text-[#0BE49A]" />}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button onClick={handleConfirm} disabled={success}
            className="w-full flex items-center justify-center gap-2 bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg py-3 hover:bg-[#08cf8a] active:scale-[0.98] transition-all disabled:opacity-60">
            {success
              ? <><CheckCircle2 size={16} />Réservation confirmée !</>
              : <><Zap size={15} />Confirmer la réservation</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vue Espace (postes) ──────────────────────────────────────────────────────

function SpaceView({ space, onBack, onReserve }: {
  space: Space; onBack: () => void; onReserve: (r: Reservation) => void;
}) {
  const [filter, setFilter] = useState<DeskType | "all">("all");
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const allDesks = DESKS.filter(d => d.spaceId === space.id);
  const filtered = filter === "all" ? allDesks : allDesks.filter(d => d.type === filter);

  return (
    <div className="min-h-screen" style={{ background: "#090C14" }}>
      {/* Hero image */}
      <div className="relative h-64 overflow-hidden">
        <img src={img(space.imageId, 1200, 400)} alt={space.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(9,12,20,.3) 0%,rgba(9,12,20,.95) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
          <button onClick={onBack}
            className="absolute top-4 left-4 flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors bg-black/30 rounded-lg px-3 py-1.5">
            <ArrowLeft size={14} />Retour
          </button>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-mono text-[#0BE49A] uppercase tracking-widest mb-1">{space.city}</p>
              <h1 className="font-display text-3xl font-bold text-white">{space.name}</h1>
              <p className="text-sm text-white/60 mt-0.5">{space.address}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-0.5">
                <Star size={13} fill="#F59E0B" className="text-amber-400" />
                <span className="text-sm font-bold text-white">{space.rating}</span>
              </div>
              <p className="text-xs text-white/50">{space.reviewCount} avis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono text-[#6B7A96] mr-1">FILTRER :</span>
          {(["all", "open", "meeting", "private"] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
                filter === t
                  ? "bg-[#0BE49A]/10 text-[#0BE49A] border-[#0BE49A]/30"
                  : "text-[#6B7A96] border-[rgba(255,255,255,0.07)] hover:text-[#E6EAF0] hover:border-white/15"
              }`}>
              {t === "all" ? "TOUS" : DESK_TYPE_LABELS[t].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grille postes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map(desk => {
            const Icon = DESK_TYPE_ICONS[desk.type];
            return (
              <div key={desk.id} onClick={() => desk.available && setSelectedDesk(desk)}
                className={`group relative bg-[#111620] border rounded-xl p-4 transition-all ${
                  desk.available
                    ? "border-[rgba(255,255,255,0.07)] hover:border-[#0BE49A]/30 cursor-pointer"
                    : "border-[rgba(255,255,255,0.07)] opacity-50 cursor-not-allowed"
                }`}>
                <div className="absolute inset-x-0 top-0 h-px rounded-t-xl transition-all"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(11,228,154,0),transparent)" }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${desk.available ? "bg-[#0BE49A]/10" : "bg-white/5"}`}>
                      <Icon size={15} className={desk.available ? "text-[#0BE49A]" : "text-[#6B7A96]"} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#E6EAF0]">{desk.name}</p>
                      <p className="text-[11px] text-[#6B7A96] font-mono">Étage {desk.floor}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${desk.available ? "text-[#0BE49A]" : "text-[#6B7A96]"}`}>
                    {desk.available ? "DISPO" : "OCCUPÉ"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    <DeskTypeBadge type={desk.type} />
                    <Badge label={`${desk.capacity} pers.`} color="gray" />
                  </div>
                  <p className="text-sm font-bold text-[#E6EAF0]">
                    {fmt(desk.pricePerHour)}<span className="text-xs font-normal text-[#6B7A96]">/h</span>
                  </p>
                </div>

                {desk.available && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)]">
                    <div className="flex items-center gap-1.5 text-xs text-[#0BE49A] font-mono">
                      <ChevronRight size={12} />Cliquer pour réserver
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-[#6B7A96]">
              Aucun poste pour ce filtre.
            </div>
          )}
        </div>
      </div>

      {selectedDesk && (
        <BookingModal
          desk={selectedDesk} space={space}
          onClose={() => setSelectedDesk(null)}
          onConfirm={r => { onReserve(r); setSelectedDesk(null); }}
        />
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function SpaceCard({ space, onClick }: { space: Space; onClick: () => void }) {
  const ratio = space.available / space.capacity;
  const barColor = ratio > 0.3 ? "#0BE49A" : ratio > 0.1 ? "#F59E0B" : "#EF4444";
  return (
    <div onClick={onClick}
      className="group bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden cursor-pointer hover:border-[#0BE49A]/30 transition-all hover:-translate-y-0.5">
      <div className="relative h-44 overflow-hidden bg-[#161C2A]">
        <img src={img(space.imageId, 600, 300)} alt={space.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(9,12,20,.8) 0%,transparent 60%)" }} />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/50 text-white/80 border border-white/10">
            {space.city}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 rounded px-2 py-1 border border-white/10">
          <Star size={10} fill="#F59E0B" className="text-amber-400" />
          <span className="text-[11px] font-bold text-white">{space.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display font-bold text-base text-[#E6EAF0] group-hover:text-[#0BE49A] transition-colors">{space.name}</h3>
          <span className="text-xs font-mono text-[#6B7A96] ml-2 shrink-0">dès {fmt(space.priceFrom)}/h</span>
        </div>
        <p className="text-[12px] text-[#6B7A96] mb-3 line-clamp-2">{space.description}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs">
            <Users size={12} className="text-[#6B7A96]" />
            <span className="font-mono font-bold" style={{ color: barColor }}>{space.available}</span>
            <span className="text-[#6B7A96]">/ {space.capacity} dispo</span>
          </div>
          <div className="flex gap-1.5">
            {space.amenities.slice(0, 3).map(a => {
              const Icon = AMENITY_ICONS[a];
              return <Icon key={a} size={12} className="text-[#6B7A96]" />;
            })}
          </div>
        </div>

        <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(space.available / space.capacity) * 100}%`, background: barColor }} />
        </div>

        <div className="pt-3 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
          <span className="text-xs text-[#6B7A96]">{space.reviewCount} avis</span>
          <div className="flex items-center gap-1 text-xs font-mono text-[#0BE49A]">
            Voir les postes <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onSelectSpace }: { onSelectSpace: (s: Space) => void }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Toutes les villes");
  const [minCap, setMinCap] = useState("");

  const filtered = SPACES.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase())) &&
    (city === "Toutes les villes" || s.city === city) &&
    (!minCap || s.capacity >= parseInt(minCap))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-mono text-[#0BE49A] uppercase tracking-widest mb-2">CoWork-Flex / Espaces</p>
        <h1 className="font-display text-4xl font-bold text-[#E6EAF0] mb-2">Trouvez votre espace</h1>
        <p className="text-[#6B7A96]">
          {SPACES.length} espaces dans {[...new Set(SPACES.map(s => s.city))].join(", ")}
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-56 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, adresse..."
            className="w-full bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#E6EAF0] placeholder:text-[#6B7A96] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors" />
        </div>
        <div className="relative">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96] pointer-events-none" />
          <select value={city} onChange={e => setCity(e.target.value)}
            className="appearance-none bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg pl-8 pr-8 py-2.5 text-sm text-[#E6EAF0] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96] pointer-events-none" />
          <input type="number" value={minCap} onChange={e => setMinCap(e.target.value)} placeholder="Capacité min."
            className="w-36 bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg pl-8 pr-4 py-2.5 text-sm text-[#E6EAF0] placeholder:text-[#6B7A96] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors" />
        </div>
      </div>

      {/* Grille espaces */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(s => <SpaceCard key={s.id} space={s} onClick={() => onSelectSpace(s)} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-[#6B7A96]">
            <Building2 size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucun espace ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profil / Réservations ────────────────────────────────────────────────────

function ReservationRow({ r, onCancel }: { r: Reservation; onCancel: (() => void) | null }) {
  const cancellable = r.status === "confirmed" && canCancel(r.date, r.startTime);
  const Icon = DESK_TYPE_ICONS[r.deskType];
  return (
    <div className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3.5 flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-[#0BE49A]/8 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-[#0BE49A]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="text-sm font-medium text-[#E6EAF0] truncate">{r.deskName}</p>
          <DeskTypeBadge type={r.deskType} />
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#6B7A96] flex-wrap">
          <span className="flex items-center gap-1"><Building2 size={10} />{r.spaceName}</span>
          <span className="flex items-center gap-1"><Calendar size={10} />{r.date}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{r.startTime}–{r.endTime}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={r.status} />
        <span className="text-sm font-bold font-display text-[#E6EAF0]">{fmt(r.totalPrice)}</span>
        {onCancel && cancellable && (
          <button onClick={onCancel}
            className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-500/20 rounded px-2 py-1 hover:bg-red-500/8 transition-colors">
            Annuler
          </button>
        )}
        {onCancel && !cancellable && r.status === "confirmed" && (
          <span className="text-[10px] font-mono text-[#6B7A96] border border-[rgba(255,255,255,0.07)] rounded px-2 py-1">
            &lt;24h
          </span>
        )}
      </div>
    </div>
  );
}

function ProfileView({ reservations, onCancel }: {
  reservations: Reservation[]; onCancel: (id: string) => void;
}) {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const sorted = [...reservations].sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = sorted.filter(r => r.date >= today && r.status !== "cancelled");
  const past     = sorted.filter(r => r.date < today || r.status === "cancelled");
  const totalSpent = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.totalPrice, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* En-tête profil */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#0BE49A]/10 border border-[#0BE49A]/20 flex items-center justify-center">
          <User size={20} className="text-[#0BE49A]" />
        </div>
        <div>
          <p className="text-xs font-mono text-[#0BE49A] uppercase tracking-widest mb-0.5">Profil / Réservations</p>
          <h1 className="font-display text-2xl font-bold text-[#E6EAF0]">Kinon OUATTARA</h1>
          <p className="text-sm text-[#6B7A96]">kinonouattara12151@example.com</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          ["Total réservations", reservations.length],
          ["À venir", upcoming.length],
          ["Dépenses totales", `${totalSpent}€`],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3">
            <p className="text-[11px] font-mono text-[#6B7A96] uppercase tracking-widest mb-1">{label as string}</p>
            <p className="font-display text-2xl font-bold text-[#E6EAF0]">{value}</p>
          </div>
        ))}
      </div>

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-mono text-[#6B7A96] uppercase tracking-widest mb-3">À venir</h2>
          <div className="space-y-2">
            {upcoming.map(r => <ReservationRow key={r.id} r={r} onCancel={() => setCancelId(r.id)} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-mono text-[#6B7A96] uppercase tracking-widest mb-3">Historique</h2>
          <div className="space-y-2">
            {past.map(r => <ReservationRow key={r.id} r={r} onCancel={null} />)}
          </div>
        </section>
      )}

      {/* Modal confirmation annulation */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,8,16,0.88)", backdropFilter: "blur(6px)" }}>
          <div className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <XCircle size={18} className="text-red-400" />
            </div>
            <h3 className="font-display text-base font-bold text-[#E6EAF0] mb-1">Annuler la réservation ?</h3>
            <p className="text-sm text-[#6B7A96] mb-5">
              Cette action est irréversible. Le remboursement sera traité sous 3–5 jours ouvrés.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 text-sm font-medium border border-[rgba(255,255,255,0.07)] rounded-lg text-[#E6EAF0] hover:bg-white/5 transition-colors">
                Retour
              </button>
              <button onClick={() => { onCancel(cancelId!); setCancelId(null); }}
                className="flex-1 py-2.5 text-sm font-bold bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/25 transition-colors">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav({ view, setView, count }: { view: View; setView: (v: View) => void; count: number }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.07)]"
      style={{ background: "rgba(9,12,20,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0BE49A] flex items-center justify-center">
            <BriefcaseBusiness size={13} className="text-[#050C12]" />
          </div>
          <span className="font-display font-bold text-[#E6EAF0] text-sm tracking-tight">CoWork-Flex</span>
        </div>
        <div className="flex items-center gap-1">
          {([
            { id: "dashboard" as View, label: "Espaces", Icon: LayoutDashboard, badge: 0 },
            { id: "profile"   as View, label: "Mes Réservations", Icon: BookOpen, badge: count },
          ]).map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                view === id
                  ? "bg-[#0BE49A]/10 text-[#0BE49A] border border-[#0BE49A]/20"
                  : "text-[#6B7A96] hover:text-[#E6EAF0] border border-transparent hover:bg-white/4"
              }`}>
              <Icon size={13} />{label}
              {badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0BE49A] text-[#050C12] text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Composant racine App ─────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  // Injection des styles globaux une seule fois
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "cowork-flex-styles";
    el.textContent = GLOBAL_STYLE;
    if (!document.getElementById("cowork-flex-styles")) document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);

  function handleSelectSpace(s: Space) { setSelectedSpace(s); setView("space"); }
  function handleBack() { setView("dashboard"); setSelectedSpace(null); }
  function handleReserve(r: Reservation) { setReservations(prev => [r, ...prev]); }
  function handleCancel(id: string) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" as ReservationStatus } : r));
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingCount = reservations.filter(r => r.date >= today && r.status !== "cancelled").length;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#090C14" }}>
      {view !== "space" && <Nav view={view} setView={setView} count={upcomingCount} />}

      {view === "dashboard" && <Dashboard onSelectSpace={handleSelectSpace} />}
      {view === "space" && selectedSpace && (
        <SpaceView space={selectedSpace} onBack={handleBack} onReserve={handleReserve} />
      )}
      {view === "profile" && (
        <ProfileView reservations={reservations} onCancel={handleCancel} />
      )}
    </div>
  );
}
