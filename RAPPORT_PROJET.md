# Rapport du Projet - Kabo FichesGen

## 1. Informations Générales

### Nom du Projet
**Kabo FichesGen** (Kabo FichesGen ANG&ARABE)

### Description
Application web d'aide à la création de fiches pédagogiques assistée par Intelligence Artificielle pour les enseignants du Sénégal.

### Objectif
Concevoir et générer automatiquement des fiches de préparation conformes au Guide Pédagogique CEB (Cadre d'Enseignement de Base) du Sénégal pour les classes de l'élémentaire (CI, CP, CE1, CE2, CM1, CM2).

---

## 2. Stack Technique

### Technologies Frontend
| Technologie | Version |
|-------------|---------|
| React | 19.2.3 |
| React DOM | 19.2.3 |
| React Router DOM | 7.12.0 |
| TypeScript | 5.8.2 |
| Vite | 6.2.0 |

### Technologies Backend / IA
| Technologie | Version |
|-------------|---------|
| Express | 5.2.1 |
| Google Gemini API | 1.37.0 |
| Node.js | v18/v20 recommandé |

### Architecture
- **Single Page Application (SPA)** avec routage côté client
- **API REST** intégrée pour le service de génération IA
- **Stockage local** (localStorage) pour la persistance des données
- **Server Express** pour le déploiement en production

---

## 3. Structure du Projet

```
Kabo-FichesGen-AA/
├── App.tsx                    # Application principale
├── index.tsx                  # Point d'entrée React
├── package.json               # Dépendances et scripts
├── tsconfig.json              # Configuration TypeScript
├── vite.config.ts             # Configuration Vite
├── server.js                  # Serveur Express pour production
├── sw.js                      # Service Worker
├── types.ts                   # Définitions TypeScript
├── components/
│   ├── Dashboard.tsx          # Tableau de bord
│   ├── SheetEditor.tsx        # Éditeur de fiches
│   ├── SheetPreview.tsx       # Aperçu A4 officiel
│   └── GradientGenerator.tsx # Générateur de dégradés CSS
├── services/
│   └── geminiService.ts       # Service IA Gemini
└── (autres fichiers config...)
```

---

## 4. Modèle de Données

### Fiche Pédagogique (`PedagogicalSheet`)

```
typescript
{
  id: string;                    // Identifiant unique
  title: string;                 // Titre de la séance
  discipline?: string;           // Discipline générale
  subject: string;               // Activité spécifique
  domain: string;                // Domaine (LC, Math, ESVS, etc.)
  subDomain: string;             // Sous-domaine
  gradeLevel: string;            // Classe (CI, CP, CE1, CE2, CM1, CM2)
  competence: string;            // Compétence de Base (CB)
  level: string;                 // Palier
  oa: string;                    // Objectif d'Apprentissage
  contentSummary: string;        // Contenu / Résumé
  specificObjective: string;      // Objectif Spécifique (OS)
  type: SheetType;               // LESSON | EXERCISE | EVALUATION
  duration: string;              // Durée de la séance
  material: {                    // Matériel pédagogique
    collective: string;
    individual: string;
  };
  reference: string;             // Bibliographie
  steps: PedagogicalStep[];       // Étapes de la séquence
  createdAt: number;             // Date de création
}
```

### Étape Pédagogique (`PedagogicalStep`)

```
typescript
{
  name: string;           // Nom de l'étape
  objective: string;      // Objectif de l'étape
  teacherActivity: string; // Activités du maître
  studentActivity: string;// Activités des élèves
}
```

---

## 5. Fonctionnalités Principales

### 5.1 Dashboard (Tableau de Bord)
- **Affichage des fiches** : Grille responsive avec cartes détaillées
- **Recherche** : Filtrage par titre ou discipline
- **Statistiques** : Compteur total des fiches
- **Actions** : Création, modification, suppression de fiches

### 5.2 Éditeur de Fiches
- **Génération IA** : Création automatique via Gemini
- **Types de documents** :
  - Leçon (Leçon)
  - Exercices (TD/Exos)
  - Évaluation (Éval.)
- **Niveaux scolaires** : CI, CP, CE1, CE2, CM1, CM2
- **Langues** : Français, Arabe (العربية), Anglais
- **Modes** :
  - Édition : Modification du contenu généré
  - Aperçu : Format officiel A4

### 5.3 Génération IA
Le service Gemini utilise un prompt système spécialisé :
- Connaissance du Guide Pédagogique CEB Sénégal
- Structure APC (Approche Par les Compétences)
- 5 étapes conformes : Mise en train → Mise en situation → Construction → Évaluation → Synthèse
- Terminologie pédagogique : matérialisation, confrontation, validation, institutionnalisation
- Contextualisation locale (lieux, prénoms sénégalais)

### 5.4 Export et Impression
- **Impression** : Via fenêtre d'impression native
- **PDF** : Export via html2pdf.js
- **Word** : Export via blob HTML

### 5.5 Format A4 Officiel
En-tête institutionnel avec :
- République du Sénégal
- Ministère de l'Éducation Nationale
- Inspection de l'Éducation
- Cadrecurriculaire complet
- Tableau de déroulement
- Espace pour visas et observations

### 5.6 Support RTL
- Détection automatique pour l'arabe
- Inversion du layout pour les fiches arabes

### 5.7 Générateur de Dégradés
- Types : Linéaire, Radial, Conique
- Couleurs personnalisées
- Préréglages (sunset, ocean, forest, fire, purple)
- Export CSS et JSON

---

## 6. Services IA

### Gemini Service (`geminiService.ts`)

```
typescript
// Modèle utilisé : gemini-3-pro-preview
// Format de réponse : JSON structuré
// Schema strict défini pour la génération
```

#### Contenu du Prompt Système
1. **Contexte CEB** : Toutes disciplines et tous niveaux
2. **Disciplines couvertes** :
   - Langue et Communication (LC)
   - Mathématiques
   - ESVS (Histoire, Géographie, Sciences)
   - EDD (Éducation au Développement Durable)
   - Arts & Sports
   - Franco-Arabe (Tawhid, Fiqh, Coran, Arabe)
   - Anglais

---

## 7. Déploiement

### Développement
```
bash
npm install
npm run dev
```

### Production
```
bash
npm run build
npm run serve  # ou npm run package pour .exe
```

### Configuration Requise
- Fichier `.env.local` avec la clé API GEMINI :
  
```
  API_KEY=votre_google_genai_api_key
  
```

### Configuration de l'API GEMINI
Le projet utilise l'API Google Gemini pour la génération automatique de fiches pédagogiques :

- **Fichier de configuration** : `.env.local` (présent dans le projet)
- **Service utilisé** : `services/geminiService.ts`
- **Modèle** : `gemini-3-pro-preview`
- **Authentification** : Via `process.env.API_KEY`

La clé API est configurée et fonctionnelle pour permettre la génération IA des fiches pédagogiques.

---

## 8. Améliorations Implémentées

D'après le README.md :
- ✅ Gestion d'erreur pour le parsing JSON du localStorage
- ✅ Configuration pkg pour Windows
- ✅ Script serveur (`server.js`) pour fichiers statiques
- ✅ Améliorations UI et scripts

---

## 9. Résumé des Composants

| Composant | Fichier | Fonction |
|-----------|---------|----------|
| Application | App.tsx | Routage, gestion état global |
| Dashboard | Dashboard.tsx | Liste et gestion des fiches |
| Éditeur | SheetEditor.tsx | Création/modification/IA |
| Aperçu | SheetPreview.tsx | Format A4 officiel |
| Générateur | GradientGenerator.tsx | Outil CSS |
| Service IA | geminiService.ts | Intégration Gemini |
| Types | types.ts | Interfaces TypeScript |

---

## 10. Conclusion

**Kabo FichesGen** est une application complète qui :
- Permet aux enseignants sénégalais de générer rapidement des fiches pédagogiques conformes aux standards officiels
- Utilise l'IA pour automatiser la création de contenu pédagogique de qualité
- Supporte plusieurs langues et niveaux scolaires
- Offre des options d'export multiples (PDF, Word, impression)
- Est packagéeable en executable Windows autonome

Le projet représente une solution innovante pour l'éducation au Sénégal, combinant technologies modernes (React, Gemini AI) et spécificités pédagogiques locales.
