import { useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff, CheckCircle2, XCircle, User, Mail, Lock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AppUser {
  name: string;
  email: string;
  password: string; // stocké en clair (pour démo — en production utiliser un hash)
  createdAt: string;
}

// ─── Helpers localStorage ─────────────────────────────────────────────────────
const STORAGE_KEY = "coworkflex_users";
const SESSION_KEY = "coworkflex_session";

export function getUsers(): AppUser[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}

export function saveUser(user: AppUser) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getSession(): AppUser | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); }
  catch { return null; }
}

export function setSession(user: AppUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Constantes de style ──────────────────────────────────────────────────────
const INPUT_CLS =
  "w-full bg-[#161C2A] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-3 text-sm text-[#E6EAF0] placeholder:text-[#6B7A96] focus:outline-none focus:ring-1 focus:ring-[#0BE49A]/40 focus:border-[#0BE49A]/40 transition-colors";
const LABEL_CLS = "block text-xs font-mono text-[#6B7A96] uppercase tracking-widest mb-1.5";

// ─── Composant principal ──────────────────────────────────────────────────────
export default function AuthView({ onAuth }: { onAuth: (user: AppUser) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function reset() {
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    setError(""); setSuccess("");
  }

  function switchMode(m: "login" | "register") {
    setMode(m); reset();
  }

  // ── Inscription ──────────────────────────────────────────────────────────────
  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Le nom est requis."); return; }
    if (!email.includes("@")) { setError("Email invalide."); return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("Un compte existe déjà avec cet email."); return;
    }

    const newUser: AppUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveUser(newUser);
    setSuccess("Compte créé ! Connexion en cours...");
    setTimeout(() => { setSession(newUser); onAuth(newUser); }, 1000);
  }

  // ── Connexion ────────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const users = getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) { setError("Email ou mot de passe incorrect."); return; }

    setSuccess(`Bienvenue ${user.name} !`);
    setTimeout(() => { setSession(user); onAuth(user); }, 800);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#090C14" }}>

      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #0BE49A, transparent)" }} />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0BE49A] flex items-center justify-center">
            <BriefcaseBusiness size={16} className="text-[#050C12]" />
          </div>
          <span className="font-display font-bold text-xl text-[#E6EAF0]">CoWork-Flex</span>
        </div>

        {/* Carte */}
        <div className="bg-[#111620] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden shadow-2xl">

          {/* Ligne décorative */}
          <div className="h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(11,228,154,.5),transparent)" }} />

          {/* Onglets */}
          <div className="flex border-b border-[rgba(255,255,255,0.07)]">
            {(["login", "register"] as const).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-xs font-mono font-medium uppercase tracking-widest transition-colors ${
                  mode === m
                    ? "text-[#0BE49A] border-b-2 border-[#0BE49A] bg-[#0BE49A]/5"
                    : "text-[#6B7A96] hover:text-[#E6EAF0]"
                }`}>
                {m === "login" ? "Se connecter" : "S'inscrire"}
              </button>
            ))}
          </div>

          <div className="px-6 py-6">

            {/* Message succès */}
            {success && (
              <div className="flex items-center gap-2 text-[#0BE49A] text-sm bg-[#0BE49A]/8 border border-[#0BE49A]/20 rounded-lg px-3 py-2.5 mb-4">
                <CheckCircle2 size={14} className="shrink-0" />{success}
              </div>
            )}

            {/* Message erreur */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2.5 mb-4">
                <XCircle size={14} className="shrink-0" />{error}
              </div>
            )}

            {/* ── Formulaire Inscription ── */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>Nom complet</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="Kinon Ouattara" required
                      className={INPUT_CLS + " pl-9"} />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@exemple.com" required
                      className={INPUT_CLS + " pl-9"} />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input type={showPwd ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 caractères" required
                      className={INPUT_CLS + " pl-9 pr-10"} />
                    <button type="button" onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A96] hover:text-[#E6EAF0]">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input type={showPwd ? "text" : "password"} value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Répéter le mot de passe" required
                      className={INPUT_CLS + " pl-9"} />
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg py-3 hover:bg-[#08cf8a] active:scale-[0.98] transition-all mt-2">
                  Créer mon compte
                </button>
              </form>
            )}

            {/* ── Formulaire Connexion ── */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@exemple.com" required autoFocus
                      className={INPUT_CLS + " pl-9"} />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Mot de passe</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A96]" />
                    <input type={showPwd ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className={INPUT_CLS + " pl-9 pr-10"} />
                    <button type="button" onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A96] hover:text-[#E6EAF0]">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-[#0BE49A] text-[#050C12] font-display font-bold text-sm rounded-lg py-3 hover:bg-[#08cf8a] active:scale-[0.98] transition-all mt-2">
                  Se connecter
                </button>
                <p className="text-center text-xs text-[#6B7A96] font-mono">
                  Pas encore de compte ?{" "}
                  <button type="button" onClick={() => switchMode("register")}
                    className="text-[#0BE49A] hover:underline">
                    S'inscrire
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#6B7A96] font-mono mt-4">
          Vos données sont stockées localement sur votre appareil.
        </p>
      </div>
    </div>
  );
}
