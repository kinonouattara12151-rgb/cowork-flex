import { useState, useEffect } from "react";
import {
  Shield, Plus, Trash2, Building2, Monitor, Users,
  DoorOpen, ArrowLeft, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import {
  fetchSpaces, fetchDesks, createSpace, deleteSpace,
  createDesk, deleteDesk, ApiSpace, ApiDesk,
} from "./api";

// ─── Constantes ───────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "KINon12151@";

const INPUT_CLS =
  "w-full bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2.5 text-sm text-[#E6EAF0] placeholder:text-[#6B7A96] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors";

const LABEL_CLS = "block text-xs font-mono text-[#6B7A96] uppercase tracking-widest mb-1.5";

// ─── Écran de connexion ───────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#090C14" }}>
      <div className="w-full max-w-sm bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0BE49A]/10 border border-[#0BE49A]/20 flex items-center justify-center">
            <Shield size={18} className="text-[#0BE49A]" />
          </div>
          <div>
            <p className="text-xs font-mono text-[#6B7A96] uppercase tracking-widest">CoWork-Flex</p>
            <h1 className="font-display font-bold text-lg text-[#E6EAF0]">Espace Admin</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={LABEL_CLS}>Mot de passe</label>
            <input
              type="password" value={pwd} onChange={e => setPwd(e.target.value)}
              placeholder="••••••••" autoFocus className={INPUT_CLS}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">
              <XCircle size={14} />Mot de passe incorrect.
            </div>
          )}
          <button type="submit"
            className="w-full bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg py-3 hover:bg-[#08cf8a] transition-colors mt-2">
            Se connecter
          </button>
        </form>
        <p className="text-center text-xs font-mono text-[#6B7A96] mt-4">Accès réservé aux administrateurs</p>
      </div>
    </div>
  );
}

// ─── Formulaire ajout espace ──────────────────────────────────────────────────
function AddSpaceForm({ onAdded }: { onAdded: () => void }) {
  const empty = { name: "", city: "", address: "", rating: "4.5", reviewCount: "0",
    capacity: "50", available: "20", amenities: "wifi,coffee", imageId: "photo-1497366216548-37526070297c",
    priceFrom: "10", description: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await createSpace({
        name: form.name, city: form.city, address: form.address,
        rating: parseFloat(form.rating), reviewCount: parseInt(form.reviewCount),
        capacity: parseInt(form.capacity), available: parseInt(form.available),
        amenities: form.amenities, imageId: form.imageId,
        priceFrom: parseInt(form.priceFrom), description: form.description,
      });
      setSuccess(true); setForm(empty);
      setTimeout(() => { setSuccess(false); onAdded(); }, 1200);
    } catch {
      setError("Impossible d'ajouter l'espace. Le backend est-il démarré ?");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 space-y-4">
      <h3 className="font-display font-bold text-[#E6EAF0] text-base flex items-center gap-2">
        <Building2 size={16} className="text-[#0BE49A]" />Ajouter un espace
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {([["name","Nom","Nexus Hub"],["city","Ville","Abidjan"],
           ["address","Adresse","42 Rue..."],["imageId","ID Photo Unsplash","photo-xxx"]] as const).map(([k,l,p]) => (
          <div key={k}>
            <label className={LABEL_CLS}>{l}</label>
            <input value={form[k]} onChange={set(k)} placeholder={p} required className={INPUT_CLS} />
          </div>
        ))}
        {([["rating","Note (0-5)","4.5"],["priceFrom","Prix dès (€)","10"],
           ["capacity","Capacité","50"],["available","Disponibles","20"]] as const).map(([k,l,p]) => (
          <div key={k}>
            <label className={LABEL_CLS}>{l}</label>
            <input type="number" value={form[k]} onChange={set(k)} placeholder={p} required className={INPUT_CLS} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className={LABEL_CLS}>Équipements (séparés par virgule)</label>
          <input value={form.amenities} onChange={set("amenities")} placeholder="wifi,coffee,printer,parking" className={INPUT_CLS} />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL_CLS}>Description</label>
          <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Description de l'espace..." required
            className={INPUT_CLS + " resize-none"} />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">
          <XCircle size={14} />{error}
        </div>
      )}
      <button type="submit" disabled={loading || success}
        className="flex items-center gap-2 bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg px-4 py-2.5 hover:bg-[#08cf8a] transition-colors disabled:opacity-60">
        {success ? <><CheckCircle2 size={15} />Ajouté !</> : loading ? <><Loader2 size={15} className="animate-spin" />En cours...</> : <><Plus size={15} />Ajouter l'espace</>}
      </button>
    </form>
  );
}

// ─── Formulaire ajout poste ───────────────────────────────────────────────────
function AddDeskForm({ spaces, onAdded }: { spaces: ApiSpace[]; onAdded: () => void }) {
  const [spaceId, setSpaceId] = useState("");
  const [form, setForm] = useState({ name: "", type: "OPEN", capacity: "1", pricePerHour: "5", floor: "1" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!spaceId) { setError("Sélectionnez un espace."); return; }
    setLoading(true); setError("");
    try {
      await createDesk(parseInt(spaceId), {
        name: form.name, type: form.type as "OPEN" | "MEETING" | "PRIVATE",
        capacity: parseInt(form.capacity), pricePerHour: parseInt(form.pricePerHour),
        floor: parseInt(form.floor), available: true,
      });
      setSuccess(true); setForm({ name: "", type: "OPEN", capacity: "1", pricePerHour: "5", floor: "1" });
      setTimeout(() => { setSuccess(false); onAdded(); }, 1200);
    } catch {
      setError("Impossible d'ajouter le poste. Le backend est-il démarré ?");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 space-y-4">
      <h3 className="font-display font-bold text-[#E6EAF0] text-base flex items-center gap-2">
        <Monitor size={16} className="text-[#0BE49A]" />Ajouter un poste
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={LABEL_CLS}>Espace</label>
          <select value={spaceId} onChange={e => setSpaceId(e.target.value)} required className={INPUT_CLS}>
            <option value="">Sélectionner un espace...</option>
            {spaces.map(s => <option key={s.id} value={s.id}>{s.name} — {s.city}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>Nom du poste</label>
          <input value={form.name} onChange={set("name")} placeholder="Open Desk A-01" required className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Type</label>
          <select value={form.type} onChange={set("type")} className={INPUT_CLS}>
            <option value="OPEN">Open Space</option>
            <option value="MEETING">Salle de Réunion</option>
            <option value="PRIVATE">Bureau Privé</option>
          </select>
        </div>
        {([["capacity","Capacité","1"],["pricePerHour","Prix/heure (€)","5"],["floor","Étage","1"]] as const).map(([k,l,p]) => (
          <div key={k}>
            <label className={LABEL_CLS}>{l}</label>
            <input type="number" value={form[k]} onChange={set(k)} placeholder={p} required className={INPUT_CLS} />
          </div>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">
          <XCircle size={14} />{error}
        </div>
      )}
      <button type="submit" disabled={loading || success}
        className="flex items-center gap-2 bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg px-4 py-2.5 hover:bg-[#08cf8a] transition-colors disabled:opacity-60">
        {success ? <><CheckCircle2 size={15} />Ajouté !</> : loading ? <><Loader2 size={15} className="animate-spin" />En cours...</> : <><Plus size={15} />Ajouter le poste</>}
      </button>
    </form>
  );
}

// ─── Liste des espaces avec suppression ───────────────────────────────────────
function SpaceList({ spaces, onDeleted }: { spaces: ApiSpace[]; onDeleted: () => void }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [desks, setDesks] = useState<Record<number, ApiDesk[]>>({});

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet espace et tous ses postes ?")) return;
    setDeletingId(id);
    try { await deleteSpace(id); onDeleted(); }
    catch { alert("Erreur lors de la suppression."); }
    finally { setDeletingId(null); }
  }

  async function toggleDesks(spaceId: number) {
    if (expandedId === spaceId) { setExpandedId(null); return; }
    setExpandedId(spaceId);
    if (!desks[spaceId]) {
      try {
        const d = await fetchDesks(spaceId);
        setDesks(prev => ({ ...prev, [spaceId]: d }));
      } catch { /* backend non dispo */ }
    }
  }

  async function handleDeleteDesk(deskId: number, spaceId: number) {
    if (!confirm("Supprimer ce poste ?")) return;
    try {
      await deleteDesk(deskId);
      setDesks(prev => ({ ...prev, [spaceId]: prev[spaceId].filter(d => d.id !== deskId) }));
    } catch { alert("Erreur suppression poste."); }
  }

  const DeskIcon = { OPEN: Monitor, MEETING: Users, PRIVATE: DoorOpen };

  return (
    <div className="space-y-2">
      {spaces.map(s => (
        <div key={s.id} className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E6EAF0] truncate">{s.name}</p>
              <p className="text-xs font-mono text-[#6B7A96]">{s.city} · {s.address}</p>
            </div>
            <span className="text-xs font-mono text-[#0BE49A] bg-[#0BE49A]/10 border border-[#0BE49A]/20 rounded px-2 py-0.5">
              {s.available}/{s.capacity} dispo
            </span>
            <button onClick={() => toggleDesks(s.id)}
              className="text-xs font-mono text-[#6B7A96] hover:text-[#E6EAF0] border border-[rgba(255,255,255,0.07)] rounded px-2 py-1 transition-colors">
              {expandedId === s.id ? "Masquer" : "Postes"}
            </button>
            <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}
              className="text-red-400 hover:text-red-300 border border-red-500/20 rounded p-1.5 hover:bg-red-500/10 transition-colors disabled:opacity-50">
              {deletingId === s.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
          {expandedId === s.id && desks[s.id] && (
            <div className="border-t border-[rgba(255,255,255,0.07)] px-4 py-3 space-y-1.5">
              {desks[s.id].length === 0 && <p className="text-xs text-[#6B7A96] font-mono">Aucun poste.</p>}
              {desks[s.id].map(d => {
                const Icon = DeskIcon[d.type];
                return (
                  <div key={d.id} className="flex items-center gap-2 bg-[#161C2A] rounded-lg px-3 py-2">
                    <Icon size={12} className="text-[#0BE49A]" />
                    <span className="text-xs text-[#E6EAF0] flex-1">{d.name}</span>
                    <span className="text-[10px] font-mono text-[#6B7A96]">{d.pricePerHour}€/h · Étage {d.floor}</span>
                    <button onClick={() => handleDeleteDesk(d.id, s.id)}
                      className="text-red-400 hover:text-red-300 ml-1 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Vue Admin principale ─────────────────────────────────────────────────────
export default function AdminView({ onBack }: { onBack: () => void }) {
  const [logged, setLogged] = useState(false);
  const [spaces, setSpaces] = useState<ApiSpace[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"spaces" | "desks">("spaces");

  async function loadSpaces() {
    setLoading(true);
    try {
      const data = await fetchSpaces();
      setSpaces(data);
      setBackendOk(true);
    } catch {
      setBackendOk(false);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (logged) loadSpaces(); }, [logged]);

  if (!logged) return <LoginScreen onLogin={() => setLogged(true)} />;

  return (
    <div className="min-h-screen" style={{ background: "#090C14" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.07)]"
        style={{ background: "rgba(9,12,20,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-[#6B7A96] hover:text-[#E6EAF0] transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div className="w-6 h-6 rounded-md bg-[#0BE49A] flex items-center justify-center">
              <Shield size={13} className="text-[#050C12]" />
            </div>
            <span className="font-display font-bold text-[#E6EAF0] text-sm">Admin · CoWork-Flex</span>
          </div>
          <button onClick={() => setLogged(false)}
            className="text-xs font-mono text-[#6B7A96] hover:text-red-400 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Statut backend */}
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border font-mono ${
          backendOk === null ? "bg-white/5 border-white/10 text-[#6B7A96]" :
          backendOk ? "bg-[#0BE49A]/8 border-[#0BE49A]/20 text-[#0BE49A]" :
          "bg-red-500/8 border-red-500/20 text-red-400"
        }`}>
          {backendOk === null ? <Loader2 size={14} className="animate-spin" /> :
           backendOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {backendOk === null ? "Connexion au backend..." :
           backendOk ? `Backend connecté · ${spaces.length} espaces en base` :
           "Backend non disponible · Lancez : cd backend && mvn spring-boot:run"}
        </div>

        {/* Onglets */}
        <div className="flex gap-2">
          {(["spaces","desks"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-all ${
                tab === t ? "bg-[#0BE49A]/10 text-[#0BE49A] border-[#0BE49A]/30"
                          : "text-[#6B7A96] border-[rgba(255,255,255,0.07)] hover:text-[#E6EAF0]"
              }`}>
              {t === "spaces" ? "Espaces" : "Postes"}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {tab === "spaces" && (
          <div className="space-y-6">
            <AddSpaceForm onAdded={loadSpaces} />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-mono text-[#6B7A96] uppercase tracking-widest">
                  Espaces ({spaces.length})
                </h2>
                <button onClick={loadSpaces} disabled={loading}
                  className="text-xs font-mono text-[#6B7A96] hover:text-[#0BE49A] transition-colors">
                  {loading ? "Chargement..." : "↻ Actualiser"}
                </button>
              </div>
              {spaces.length > 0
                ? <SpaceList spaces={spaces} onDeleted={loadSpaces} />
                : !loading && <p className="text-sm text-[#6B7A96] font-mono">Aucun espace en base.</p>
              }
            </div>
          </div>
        )}

        {tab === "desks" && (
          <AddDeskForm spaces={spaces} onAdded={loadSpaces} />
        )}
      </div>
    </div>
  );
}
