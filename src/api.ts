// ─── Configuration de l'API ───────────────────────────────────────────────────
// En dev, le backend tourne sur localhost:8080
// En prod, changer cette URL par l'URL de votre serveur
export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// ─── Types partagés avec le backend ──────────────────────────────────────────
export interface ApiSpace {
  id: number;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  capacity: number;
  available: number;
  amenities: string;   // "wifi,coffee,printer"
  imageId: string;
  priceFrom: number;
  description: string;
}

export interface ApiDesk {
  id: number;
  name: string;
  type: "OPEN" | "MEETING" | "PRIVATE";
  capacity: number;
  pricePerHour: number;
  available: boolean;
  floor: number;
  space?: { id: number };
}

export interface ApiReservation {
  id: number;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  desk: ApiDesk & { space: ApiSpace };
}

// ─── Fonctions API ────────────────────────────────────────────────────────────

export async function fetchSpaces(city?: string): Promise<ApiSpace[]> {
  const url = city ? `${API_BASE}/api/spaces?city=${encodeURIComponent(city)}` : `${API_BASE}/api/spaces`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur chargement espaces");
  return res.json();
}

export async function fetchDesks(spaceId: number): Promise<ApiDesk[]> {
  const res = await fetch(`${API_BASE}/api/spaces/${spaceId}/desks`);
  if (!res.ok) throw new Error("Erreur chargement postes");
  return res.json();
}

export async function createSpace(data: Omit<ApiSpace, "id">): Promise<ApiSpace> {
  const res = await fetch(`${API_BASE}/api/spaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur création espace");
  return res.json();
}

export async function deleteSpace(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/spaces/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur suppression espace");
}

export async function createDesk(spaceId: number, data: Omit<ApiDesk, "id" | "space">): Promise<ApiDesk> {
  const res = await fetch(`${API_BASE}/api/spaces/${spaceId}/desks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur création poste");
  return res.json();
}

export async function deleteDesk(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/desks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur suppression poste");
}

export async function createReservation(data: {
  deskId: number; userName: string; userEmail: string;
  date: string; startTime: string; endTime: string;
}): Promise<ApiReservation> {
  const res = await fetch(`${API_BASE}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur création réservation");
  return res.json();
}

export async function cancelReservation(id: number): Promise<ApiReservation> {
  const res = await fetch(`${API_BASE}/api/reservations/${id}/cancel`, { method: "PATCH" });
  if (!res.ok) throw new Error("Erreur annulation réservation");
  return res.json();
}

export async function fetchReservations(email: string): Promise<ApiReservation[]> {
  const res = await fetch(`${API_BASE}/api/reservations?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Erreur chargement réservations");
  return res.json();
}
