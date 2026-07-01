# Rapport de projet — CoWork-Flex

**Auteur :** Kinon Ouattara  
**Date :** 1er juillet 2026  
**Projet :** Application web de réservation d'espaces de coworking  
**URL en ligne :** https://cowork-flex-rho.vercel.app  
**Code source :** https://github.com/kinonouattara12151-rgb/cowork-flex  

---

## 1. Présentation du projet

CoWork-Flex est une application web qui permet à des professionnels de trouver et réserver des espaces de coworking dans plusieurs villes (Côte d'Ivoire et France).

### Ce que l'application permet de faire

- **Chercher un espace** : filtrer par nom, ville ou capacité minimale
- **Consulter les postes disponibles** : voir les open spaces, salles de réunion et bureaux privés
- **Réserver un poste** : choisir une date, une heure de début et de fin, voir le prix calculé automatiquement
- **Annuler une réservation** : possible uniquement si la réservation est à plus de 24 heures
- **Consulter son profil** : voir ses réservations à venir et l'historique
- **Page administrateur** : ajouter ou supprimer des espaces et des postes (accès protégé par mot de passe)

---

## 2. Architecture générale

L'application est divisée en deux parties qui communiquent entre elles :

```
┌─────────────────────────┐         HTTP (API REST)        ┌──────────────────────────┐
│     FRONTEND             │  ──────────────────────────►  │      BACKEND             │
│  React + TypeScript      │                               │   Spring Boot (Java)     │
│  Vite + Tailwind CSS     │  ◄──────────────────────────  │   Spring Data JPA        │
│  Hébergé sur Vercel      │         JSON                  │   Base H2 (en mémoire)   │
└─────────────────────────┘                               └──────────────────────────┘
```

**Frontend** = ce que l'utilisateur voit dans son navigateur  
**Backend** = le serveur qui gère les données et les sauvegardes  
**API REST** = la façon dont les deux parties se parlent (via des requêtes HTTP)  
**JSON** = le format des données échangées (texte structuré lisible par les machines)

---

## 3. Technologies utilisées

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| React | 19.1.0 | Bibliothèque pour construire l'interface utilisateur |
| TypeScript | 5.8.3 | JavaScript avec typage — détecte les erreurs avant l'exécution |
| Vite | 6.3.5 | Outil qui compile et sert le projet en développement |
| Tailwind CSS | 3.4.17 | Framework CSS utilitaire — permet de styliser directement dans le HTML |
| Lucide React | 0.469.0 | Bibliothèque d'icônes SVG |
| PostCSS | 8.5.6 | Transforme le CSS (utilisé par Tailwind) |
| Autoprefixer | 10.4.21 | Ajoute automatiquement les préfixes CSS pour la compatibilité navigateurs |

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| Java | 25 (OpenJDK) | Langage de programmation du backend |
| Spring Boot | 3.3.5 | Framework qui simplifie la création d'applications Java |
| Spring Data JPA | inclus | Gère la communication avec la base de données |
| Hibernate | inclus | Traduit les objets Java en tables SQL |
| H2 Database | inclus | Base de données en mémoire (parfaite pour les tests) |
| PostgreSQL | 42.7.4 | Base de données pour la production |
| Maven | 3.9.16 | Gestionnaire de dépendances Java (équivalent de npm pour Java) |

---

## 4. Structure des fichiers

```
CoWork-Flex/
│
├── App.tsx                  ← Composant principal React (toute l'appli frontend)
├── index.html               ← Page HTML de départ
├── package.json             ← Liste des dépendances npm et scripts
├── vite.config.ts           ← Configuration de Vite
├── tailwind.config.js       ← Configuration de Tailwind CSS
├── postcss.config.js        ← Configuration de PostCSS
├── tsconfig.json            ← Configuration TypeScript (racine)
├── tsconfig.app.json        ← Configuration TypeScript (application)
├── tsconfig.node.json       ← Configuration TypeScript (outils Node)
├── vercel.json              ← Configuration Vercel (routing SPA)
├── .gitignore               ← Fichiers ignorés par Git
├── RAPPORT.md               ← Ce document
│
├── src/
│   ├── main.tsx             ← Point d'entrée React (monte l'appli dans index.html)
│   ├── index.css            ← Import des styles Tailwind
│   ├── api.ts               ← Fonctions pour appeler le backend (fetch)
│   ├── AdminView.tsx        ← Page admin (ajout/suppression espaces et postes)
│   └── vite-env.d.ts        ← Types TypeScript pour les variables d'environnement Vite
│
└── backend/
    ├── pom.xml              ← Dépendances Maven (équivalent de package.json)
    └── src/main/
        ├── java/com/coworkflex/
        │   ├── CoworkFlexApplication.java      ← Point d'entrée Spring Boot
        │   ├── entity/
        │   │   ├── Space.java                  ← Entité : un espace de coworking
        │   │   ├── Desk.java                   ← Entité : un poste dans un espace
        │   │   ├── Reservation.java            ← Entité : une réservation
        │   │   ├── DeskType.java               ← Enum : OPEN, MEETING, PRIVATE
        │   │   └── ReservationStatus.java      ← Enum : CONFIRMED, PENDING, CANCELLED
        │   ├── repository/
        │   │   ├── SpaceRepository.java        ← Accès base de données pour les espaces
        │   │   ├── DeskRepository.java         ← Accès base de données pour les postes
        │   │   └── ReservationRepository.java  ← Accès base de données pour les réservations
        │   └── controller/
        │       ├── SpaceController.java        ← Endpoints REST pour les espaces
        │       ├── DeskController.java         ← Endpoints REST pour les postes
        │       ├── ReservationController.java  ← Endpoints REST pour les réservations
        │       └── ReservationRequest.java     ← Objet reçu lors d'une réservation
        └── resources/
            ├── application.properties          ← Configuration principale
            ├── application-dev.properties      ← Config développement (H2)
            ├── application-prod.properties     ← Config production (PostgreSQL)
            └── data.sql                        ← Données initiales insérées au démarrage
```

---

## 5. Explication du code frontend (App.tsx)

### 5.1 Les types TypeScript

TypeScript oblige à définir la forme des données. Cela évite les erreurs.

```typescript
type DeskType = "open" | "meeting" | "private";
// DeskType ne peut avoir QUE ces 3 valeurs — TypeScript bloquera toute autre valeur

interface Space {
  id: string;
  name: string;
  city: string;
  // ...etc
}
// Interface = contrat : tout objet Space DOIT avoir ces propriétés
```

### 5.2 Les composants React

Un composant React est une **fonction JavaScript qui retourne du HTML** (appelé JSX).

```tsx
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className="...styles...">{label}</span>
  );
}
// Badge est un composant réutilisable
// On l'utilise ainsi : <Badge label="CONFIRMÉ" color="teal" />
```

### 5.3 Le State (useState)

`useState` permet de stocker des données qui changent. Quand un state change, React re-affiche le composant.

```typescript
const [view, setView] = useState("dashboard");
// view = valeur actuelle ("dashboard", "space", "profile", "admin")
// setView = fonction pour changer la valeur
// Quand on appelle setView("profile"), React réaffiche l'appli avec la nouvelle vue
```

### 5.4 Les effets (useEffect)

`useEffect` exécute du code quand quelque chose se passe (chargement, changement d'état...).

```typescript
useEffect(() => {
  if (window.location.pathname === "/admin") {
    setView("admin");
  }
}, []); // [] = s'exécute une seule fois au chargement
// Ici : si l'URL contient "/admin", on bascule vers la vue admin
```

### 5.5 La navigation entre vues

L'appli utilise un système de "vues" — une seule page qui change d'aspect :

```
URL normale  →  view = "dashboard"  →  affiche la liste des espaces
/admin       →  view = "admin"      →  affiche la page admin
Clic espace  →  view = "space"      →  affiche les postes d'un espace
Clic profil  →  view = "profile"    →  affiche les réservations
```

C'est ce qu'on appelle une **SPA (Single Page Application)** — une seule page HTML qui simule la navigation.

### 5.6 Le calcul du prix

```typescript
function calcHours(start: string, end: string) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return (toMin(end) - toMin(start)) / 60;
}
// Exemple : calcHours("09:00", "12:00") → 3 heures
// Total = 3 heures × 35€/h = 105€
```

### 5.7 La règle d'annulation 24h

```typescript
function canCancel(date: string, startTime: string) {
  const diff = (new Date(`${date}T${startTime}:00`).getTime() - Date.now()) / 3_600_000;
  return diff > 24;
}
// Date.now() = maintenant en millisecondes
// On convertit la différence en heures (÷ 3 600 000 ms)
// Si > 24h avant le début → annulation possible
```

---

## 6. Explication du code backend (Spring Boot)

### 6.1 Qu'est-ce qu'une entité JPA ?

Une entité est une classe Java qui **représente une table dans la base de données**. JPA (Java Persistence API) fait le lien entre les objets Java et les tables SQL automatiquement.

```java
@Entity              // ← dit à JPA : "cette classe = une table"
@Table(name = "space")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // ← clé primaire auto-incrémentée

    private String name;
    private String city;
    // ...
}
// JPA crée automatiquement la table SQL :
// CREATE TABLE space (id BIGINT PRIMARY KEY, name VARCHAR, city VARCHAR, ...)
```

### 6.2 Les relations entre entités

```java
// Dans Desk.java :
@ManyToOne               // Plusieurs postes → un seul espace
@JoinColumn(name = "space_id")
private Space space;
// Cela crée une colonne "space_id" dans la table desk
// Un poste appartient à un seul espace, un espace a plusieurs postes

// Dans Space.java :
@OneToMany(mappedBy = "space")
private List<Desk> desks;
// Un espace peut avoir plusieurs postes
```

### 6.3 Les repositories Spring Data JPA

Un repository est une **interface qui donne accès à la base de données sans écrire de SQL**.

```java
public interface SpaceRepository extends JpaRepository<Space, Long> {
    List<Space> findByCity(String city);
    // Spring génère automatiquement :
    // SELECT * FROM space WHERE city = ?
    // Pas besoin d'écrire le SQL !
}
```

### 6.4 Les controllers REST

Un controller expose des **endpoints HTTP** — des URLs que le frontend peut appeler.

```java
@RestController
@RequestMapping("/api/spaces")
@CrossOrigin(origins = "*")  // ← autorise le frontend React à appeler ce backend
public class SpaceController {

    @GetMapping               // GET /api/spaces
    public List<Space> getAll() { ... }

    @GetMapping("/{id}")      // GET /api/spaces/5
    public Space getById(@PathVariable Long id) { ... }

    @PostMapping              // POST /api/spaces (créer)
    public Space create(@RequestBody Space space) { ... }

    @DeleteMapping("/{id}")   // DELETE /api/spaces/5 (supprimer)
    public void delete(@PathVariable Long id) { ... }
}
```

### 6.5 Les profils Spring (dev / prod)

Spring Boot permet d'avoir des configurations différentes selon l'environnement :

```properties
# application-dev.properties (développement)
spring.datasource.url=jdbc:h2:mem:coworkflexdb  ← base en mémoire, repart à zéro à chaque redémarrage
spring.h2.console.enabled=true                  ← console web pour voir la base

# application-prod.properties (production)
spring.datasource.url=jdbc:postgresql://...     ← base PostgreSQL permanente
```

---

## 7. Explication de la page Admin

### Comment y accéder

L'URL secrète : `https://cowork-flex-rho.vercel.app/admin`  
Le bouton Admin n'est pas visible dans la navigation — seul quelqu'un qui connaît l'URL peut y accéder.

### Comment ça fonctionne

```typescript
// Dans App.tsx
useEffect(() => {
  if (window.location.pathname === "/admin") {
    setView("admin"); // bascule vers la vue admin si l'URL contient /admin
  }
}, []);

// Dans vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
// Toutes les URLs (y compris /admin) chargent index.html
// React lit ensuite l'URL et affiche la bonne vue
```

### Ce que fait la page admin

1. **Écran de connexion** → vérifie le mot de passe saisi
2. **Onglet Espaces** → formulaire d'ajout + liste des espaces avec bouton supprimer
3. **Onglet Postes** → formulaire pour ajouter un poste à un espace existant
4. **Indicateur backend** → vert si le backend répond, rouge sinon

---

## 8. Explication du fichier api.ts

Ce fichier contient toutes les fonctions qui **appellent le backend** depuis le frontend.

```typescript
const API_BASE = "http://localhost:8080"; // adresse du backend

// Récupérer tous les espaces
async function fetchSpaces(): Promise<ApiSpace[]> {
  const res = await fetch(`${API_BASE}/api/spaces`);
  // fetch() = requête HTTP GET vers le backend
  // await = attend la réponse avant de continuer
  return res.json(); // convertit la réponse JSON en objet JavaScript
}

// Créer un espace
async function createSpace(data): Promise<ApiSpace> {
  const res = await fetch(`${API_BASE}/api/spaces`, {
    method: "POST",                              // type de requête
    headers: { "Content-Type": "application/json" }, // format envoyé
    body: JSON.stringify(data),                  // données converties en texte JSON
  });
  return res.json();
}
```

---

## 9. Déploiement et hébergement

### Frontend — Vercel

Vercel est une plateforme d'hébergement gratuite pour les applications web.

**Comment ça fonctionne :**
1. On pousse le code sur GitHub (`git push`)
2. Vercel détecte automatiquement le changement
3. Vercel exécute `npm run build` pour compiler l'appli
4. Vercel met en ligne les fichiers compilés (dossier `dist/`)

**Le fichier `vercel.json`** est nécessaire pour les SPA React :
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
Sans ce fichier, une URL comme `/admin` retourne une erreur 404 car Vercel cherche un fichier `/admin` qui n'existe pas. Ce fichier lui dit : "pour toute URL, sers toujours index.html et laisse React gérer."

### Backend — Local

Le backend tourne actuellement sur la machine locale. Pour le lancer :
```cmd
cd C:\Users\simplon\Desktop\CoWork-Flex\backend
mvn spring-boot:run
```
Il sera disponible sur `http://localhost:8080`.

---

## 10. Les erreurs rencontrées et leurs solutions

### Erreur 1 — Git non reconnu dans le terminal

**Cause :** Git était installé mais le PATH (liste des programmes accessibles en ligne de commande) n'avait pas été rechargé.  
**Solution :** Recharger le PATH manuellement dans PowerShell :
```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
```

### Erreur 2 — Identité Git manquante

**Cause :** Git ne connaissait pas le nom et l'email de l'auteur pour les commits.  
**Solution :**
```bash
git config --global user.name "kinon ouattara"
git config --global user.email "kinonouattara12151@gmail.com"
```

### Erreur 3 — Mauvais nom d'utilisateur GitHub

**Cause :** Le vrai username GitHub est `kinonouattara12151-rgb` et non `kinonouattara`.  
**Solution :** Corriger l'URL du dépôt distant :
```bash
git remote set-url origin https://github.com/kinonouattara12151-rgb/cowork-flex.git
```

### Erreur 4 — Build TypeScript échoue sur Vercel

**Erreur :**
```
Property 'title' does not exist on type LucideProps
```
**Cause :** La propriété `title` était passée à une icône Lucide React qui ne l'accepte pas.  
**Solution :** Supprimer la prop `title` de la ligne concernée dans `App.tsx`.

### Erreur 5 — Lombok ne fonctionne pas avec Java 25

**Cause :** Lombok est une bibliothèque qui génère automatiquement les getters/setters. Elle ne supporte pas encore Java 25.  
**Solution :** Écrire les getters et setters manuellement dans chaque entité Java, et remplacer `@RequiredArgsConstructor` par des constructeurs explicites.

### Erreur 6 — Table SQL introuvable au démarrage du backend

**Erreur :**
```
Table "SPACE" not found (this database is empty)
```
**Cause :** Le fichier `data.sql` s'exécutait avant que Hibernate ait créé les tables.  
**Solution :** Ajouter cette ligne dans `application-dev.properties` :
```properties
spring.jpa.defer-datasource-initialization=true
```
Cela force Spring à créer les tables Hibernate EN PREMIER, puis seulement après exécuter `data.sql`.

### Erreur 7 — Page /admin retourne 404 sur Vercel

**Cause :** Vercel cherchait un fichier physique `/admin` qui n'existe pas. Dans une SPA React, il n'y a qu'un seul fichier HTML — React gère la navigation côté navigateur.  
**Solution :** Créer un fichier `vercel.json` :
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## 11. Commandes importantes à retenir

### Frontend

```bash
npm install          # installe les dépendances
npm run dev          # lance le serveur de développement (http://localhost:5173)
npm run build        # compile l'appli pour la production (dossier dist/)
```

### Git

```bash
git add .                        # prépare tous les fichiers modifiés
git commit -m "description"      # crée un point de sauvegarde
git push origin main             # envoie le code sur GitHub
```

### Backend

```bash
cd backend
mvn spring-boot:run              # lance le serveur backend (http://localhost:8080)
mvn clean package -DskipTests    # compile le backend sans lancer les tests
```

---

## 12. Récapitulatif des liens

| Ressource | Lien |
|---|---|
| Application en ligne | https://cowork-flex-rho.vercel.app |
| Page admin (secrète) | https://cowork-flex-rho.vercel.app/admin |
| Code source GitHub | https://github.com/kinonouattara12151-rgb/cowork-flex |
| Console H2 (backend local) | http://localhost:8080/h2-console |
| API REST (backend local) | http://localhost:8080/api/spaces |

---

## 13. Glossaire

| Terme | Définition |
|---|---|
| **React** | Bibliothèque JavaScript pour créer des interfaces utilisateur |
| **TypeScript** | JavaScript avec des types — détecte les erreurs avant d'exécuter le code |
| **Vite** | Outil qui compile le code TypeScript/React en JavaScript standard pour le navigateur |
| **Tailwind CSS** | Framework CSS — on applique des styles directement dans le HTML avec des classes |
| **Component** | Fonction React qui retourne du HTML (JSX) — brique de base de l'interface |
| **State** | Donnée qui change dans le temps — React réaffiche le composant à chaque changement |
| **Hook** | Fonction spéciale React (useState, useEffect) qui donne accès aux fonctionnalités React |
| **SPA** | Single Page Application — une seule page HTML, la navigation est simulée par JavaScript |
| **API REST** | Interface de communication entre frontend et backend via HTTP |
| **JSON** | Format de données texte lisible par les machines (JavaScript Object Notation) |
| **JPA** | Java Persistence API — standard Java pour communiquer avec une base de données |
| **Entité** | Classe Java qui correspond à une table dans la base de données |
| **Repository** | Interface Java qui donne accès aux données sans écrire de SQL |
| **Controller** | Classe Java qui expose des URLs (endpoints) que le frontend peut appeler |
| **Endpoint** | Une URL du backend qui répond à une action précise (GET, POST, DELETE...) |
| **H2** | Base de données légère stockée en mémoire — s'efface à chaque redémarrage |
| **PostgreSQL** | Base de données robuste pour la production — données permanentes |
| **Maven** | Gestionnaire de dépendances Java — équivalent de npm pour le monde Java |
| **Vercel** | Plateforme d'hébergement gratuite pour les applis frontend |
| **Git** | Système de gestion de versions — historique de tous les changements du code |
| **GitHub** | Site qui héberge les dépôts Git en ligne |
