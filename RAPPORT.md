# Rapport de projet — CoWork-Flex

**Auteur :** Kinon Ouattara  
**Date :** 1er juillet 2026  
**Projet :** Application web de réservation d'espaces de coworking  

---

## 1. Présentation du projet

CoWork-Flex est une application web développée en React et TypeScript.  
Elle permet de rechercher des espaces de coworking, de consulter les postes disponibles et de faire des réservations en ligne.

**Fonctionnalités principales :**
- Recherche d'espaces par nom, ville et capacité
- Consultation des postes disponibles par espace (open space, salle de réunion, bureau privé)
- Réservation d'un poste avec choix de la date et des horaires
- Calcul automatique du prix total
- Gestion du profil et historique des réservations
- Annulation d'une réservation (possible uniquement 24h avant)

---

## 2. Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| React | 19.1.0 | Bibliothèque UI |
| TypeScript | 5.8.3 | Typage statique |
| Vite | 6.3.5 | Bundler / serveur de développement |
| Tailwind CSS | 3.4.17 | Styles CSS utilitaires |
| Lucide React | 0.469.0 | Icônes |
| PostCSS | 8.5.6 | Traitement CSS |
| Autoprefixer | 10.4.21 | Compatibilité navigateurs |

---

## 3. Structure du projet

```
CoWork-Flex/
├── App.tsx              # Composant principal (toute l'application)
├── index.html           # Point d'entrée HTML
├── package.json         # Dépendances et scripts
├── vite.config.ts       # Configuration Vite
├── tsconfig.json        # Configuration TypeScript (racine)
├── tsconfig.app.json    # Configuration TypeScript (application)
├── tsconfig.node.json   # Configuration TypeScript (Node/Vite)
├── tailwind.config.js   # Configuration Tailwind CSS
├── postcss.config.js    # Configuration PostCSS
├── .gitignore           # Fichiers ignorés par Git
└── src/
    ├── main.tsx         # Point d'entrée React
    └── index.css        # Styles globaux Tailwind
```

---

## 4. Mise en place du projet

### Problème de départ
Le projet ne contenait qu'un seul fichier `App.tsx` sans aucune infrastructure autour. Il était impossible de le lancer directement.

### Solution
Création manuelle de tous les fichiers nécessaires au fonctionnement d'un projet Vite + React + TypeScript.

### Fichiers créés manuellement
- `package.json` — définition des dépendances et scripts
- `vite.config.ts` — configuration du bundler Vite
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — configuration TypeScript
- `tailwind.config.js` — configuration Tailwind CSS
- `postcss.config.js` — configuration PostCSS
- `index.html` — page HTML principale
- `src/main.tsx` — point d'entrée React
- `src/index.css` — import des directives Tailwind

### Installation des dépendances
```bash
npm install
```
Résultat : 136 paquets installés en 27 secondes.

### Lancement du serveur de développement
```bash
npm run dev
```
Résultat : application disponible sur `http://localhost:5173`

---

## 5. Mise en ligne sur GitHub

### Problème 1 — Git non reconnu
**Erreur :**
```
git : Le terme «git» n'est pas reconnu comme nom d'applet de commande
```
**Cause :** Git était installé mais le PATH système n'était pas rechargé dans le terminal actif.  
**Solution :** Rechargement manuel du PATH dans PowerShell :
```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
```

### Problème 2 — Identité Git manquante
**Erreur :**
```
Author identity unknown
Please tell me who you are.
```
**Cause :** Git ne connaissait pas le nom et l'email de l'auteur.  
**Solution :**
```bash
git config --global user.name "kinon ouattara"
git config --global user.email "kinonouattara12151@gmail.com"
```

### Problème 3 — Mauvais nom d'utilisateur GitHub
**Erreur :**
```
fatal: repository 'https://github.com/kinonouattara/cowork-flex.git/' not found
```
**Cause :** Le nom d'utilisateur GitHub réel était `kinonouattara12151-rgb` et non `kinonouattara`.  
**Solution :** Correction de l'URL du dépôt distant :
```bash
git remote set-url origin https://github.com/kinonouattara12151-rgb/cowork-flex.git
```

### Commandes Git exécutées dans l'ordre
```bash
git init
git add .
git commit -m "Initial commit - CoWork-Flex"
git remote add origin https://github.com/kinonouattara12151-rgb/cowork-flex.git
git branch -M main
git push -u origin main
```

---

## 6. Déploiement sur Vercel

### Problème — Erreur de build TypeScript
**Erreur Vercel :**
```
Command "npm run build" exited with 2
```
**Erreur TypeScript précise :**
```
App.tsx:510:73 - error TS2322
Property 'title' does not exist on type LucideProps
```
**Cause :** La prop `title` était passée à un composant icône Lucide React qui ne l'accepte pas en TypeScript strict.  
**Solution :** Suppression de la prop `title` sur la ligne concernée :
```tsx
// Avant (erreur)
<Icon key={a} size={12} className="text-[#6B7A96]" title={AMENITY_LABELS[a]} />

// Après (corrigé)
<Icon key={a} size={12} className="text-[#6B7A96]" />
```
Le fichier `tsconfig.app.json` a également été assoupli en passant les options strictes à `false` pour éviter d'autres blocages au build.

### Résultat du build après correction
```
✓ 1579 modules transformed.
dist/index.html        0.47 kB
dist/assets/index.css  15.74 kB
dist/assets/index.js   232.85 kB
✓ built in 3.03s
```

### URL de production
```
https://cowork-flex-rho.vercel.app
```

---

## 7. Ajout de contenu — Espaces ivoiriens

### Ce qui a été ajouté
11 nouveaux espaces de coworking répartis dans 8 villes de Côte d'Ivoire, ainsi que 33 postes réservables associés.

### Villes ajoutées
| Ville | Espaces | Postes |
|---|---|---|
| Abidjan (Plateau) | Plateau Hub | 4 postes |
| Abidjan (Cocody) | Cocody Lab | 4 postes |
| Abidjan (Marcory) | Marcory Work | 3 postes |
| Abidjan (Yopougon) | Yopougon Space | 3 postes |
| Yamoussoukro | Yamoussoukro Connect | 3 postes |
| Man | Man Cowork | 2 postes |
| Daloa | Daloa Hub | 3 postes |
| Gagnoa | Gagnoa Work | 2 postes |
| Soubré | Soubré Digital | 2 postes |
| Bouaké | Bouaké Central | 4 postes |
| San-Pédro | San-Pédro Bay | 3 postes |

### Types de postes disponibles par espace
- **Open Desk** — poste individuel en open space
- **Salle de réunion** — salle partagée pour plusieurs personnes
- **Bureau privé** — bureau fermé pour 2 à 4 personnes

### Mise à jour du filtre villes
```js
// Avant
const CITIES = ["Toutes les villes", "Paris", "Lyon", "Marseille", "Bordeaux"];

// Après
const CITIES = ["Toutes les villes", "Abidjan", "Yamoussoukro", "Bouaké",
  "San-Pédro", "Daloa", "Man", "Gagnoa", "Soubré",
  "Paris", "Lyon", "Marseille", "Bordeaux"];
```

---

## 8. Commits Git réalisés

| Commit | Description |
|---|---|
| `10e53a9` | Initial commit - CoWork-Flex |
| `4f24c22` | trigger vercel deploy |
| `58ad72b` | fix: corrige erreur TypeScript build |
| `09cc835` | feat: ajout espaces Côte d'Ivoire |
| `6e37590` | feat: ajout postes réservables pour tous les espaces ivoiriens |

---

## 9. Récapitulatif des liens

| Ressource | Lien |
|---|---|
| Application en ligne | https://cowork-flex-rho.vercel.app |
| Dépôt GitHub | https://github.com/kinonouattara12151-rgb/cowork-flex |
| Tableau de bord Vercel | https://vercel.com/kinon-ouattara/cowork-flex |
