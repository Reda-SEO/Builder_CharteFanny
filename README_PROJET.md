# 🎨 Créateur de Charte Graphique

## Description

Application web interactive permettant aux designers de créer facilement une charte graphique complète et professionnelle. L'outil offre une interface intuitive avec :
- **Panneau gauche** : Zone d'édition pour personnaliser tous les éléments
- **Panneau droit** : Aperçu en temps réel de la charte graphique
- **Export PDF** : Téléchargement de la charte complète au format PDF

---

## 🚀 Démarrage rapide

### Installation
Aucune installation nécessaire ! Il suffit d'ouvrir le fichier dans votre navigateur.

1. Téléchargez ou clonez le projet
2. Ouvrez **tunnel-creation.html** dans votre navigateur
3. Commencez à créer votre charte graphique

### Fichiers principaux
- **tunnel-creation.html** : Application principale
- **index.html** : Page d'accueil (liste des exports)
- **js/app.js** : Logique JavaScript
- **css/** : Feuilles de styles

---

## ✨ Fonctionnalités complètes

### 1. 🖼️ Logo
- Upload de logo (PNG, JPG, SVG)
- Nom de la marque
- Baseline/Slogan
- Mise à jour en temps réel

### 2. 🎨 Couleurs
- Couleur primaire (avec sélecteur)
- Couleur secondaire (avec sélecteur)
- Couleur tertiaire (avec sélecteur)
- Dégradé personnalisable (2 couleurs)
- Nommage personnalisé pour chaque couleur
- Aperçu instantané dans le panneau de droite

### 3. 🔤 Typographies
- Police principale avec style
- Police secondaire avec style
- Support Google Fonts (import automatique)
- Aperçu des alphabets et caractères spéciaux

### 4. 🖼️ Moodboard
- Upload d'images multiples
- Suppression d'images
- Organisation visuelle
- Références de matières, ambiances, compositions

### 5. 🧭 Navigation
- Menu de navigation intelligent
- Scroll automatique vers les sections
- Sections : Présentation, Logo, Couleurs, Typographies, Moodboard

### 6. 📄 Export PDF
- Génération automatique du PDF
- Format A4 optimisé
- Qualité haute résolution
- Nom de fichier personnalisé

---

## 📁 Structure du projet

```
Nouveau dossier (2)/
│
├── index.html                      # Page d'accueil
├── tunnel-creation.html            # Application principale
│
├── css/
│   ├── reset.css                   # Reset CSS
│   ├── global.css                  # Variables et styles globaux
│   └── tunnel-creation.css         # Styles spécifiques
│
├── js/
│   └── app.js                      # Logique applicative complète
│
├── assets/
│   ├── btn/                        # Icônes de boutons
│   ├── row/                        # Icônes de lignes
│   ├── column/                     # Images de colonnes
│   ├── input/                      # Images d'input
│   ├── heading/                    # Icônes d'en-têtes
│   ├── banner/                     # Images de bannière
│   └── [autres dossiers]/          # Autres ressources
│
├── README.md                       # Guide initial
├── README_PROJET.md               # Ce fichier
└── GUIDE_UTILISATION.md           # Guide détaillé
```

---

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS
  - Flexbox pour la mise en page
  - Container queries pour le responsive
  - Variables CSS personnalisables
- **JavaScript (Vanilla)** : Logique applicative
  - Orienté objet (classe ES6)
  - Gestion des événements
  - FileReader API pour l'upload
  - html2pdf.js pour l'export PDF

### Bibliothèques externes
- **html2pdf.js** : Chargé dynamiquement depuis CDN
  - Version : 0.10.1
  - Utilisé uniquement pour l'export PDF

---

## 💻 Code principal (app.js)

### Structure de la classe CharteGraphique

```javascript
class CharteGraphique {
  constructor()              // Initialisation des données
  init()                     // Configuration des écouteurs

  // === SECTIONS ===
  setupLogoUpload()          // Gestion upload logo
  setupBrandInputs()         // Nom marque & baseline
  setupColorPickers()        // Sélecteurs de couleur
  setupFontInputs()          // Gestion typographies
  setupMoodboardUpload()     // Upload images moodboard
  setupPDFExport()           // Export en PDF
  setupNavigation()          // Navigation sections

  // === MÉTHODES UTILITAIRES ===
  updateColorPreview()       // MAJ aperçu couleurs
  updateFontPreview()        // MAJ aperçu fonts
  updateMoodboardPreview()   // MAJ aperçu moodboard
  loadGoogleFont()           // Chargement fonts Google
  exportToPDF()              // Génération PDF
}
```

---

## 🎨 Personnalisation

### Modifier les couleurs par défaut

Éditez **css/global.css** :

```css
:root {
  --primary-primary-main: #bed000;      /* Couleur principale */
  --secondary-secondary-main: #525254;  /* Couleur secondaire */
  --text-text-primary: #404040;         /* Couleur du texte */
  /* ... autres variables */
}
```

### Ajouter des styles personnalisés

Créez un fichier **css/custom.css** et incluez-le dans tunnel-creation.html :

```html
<link rel="stylesheet" href="css/custom.css" />
```

---

## 🔧 Configuration avancée

### Modifier les paramètres d'export PDF

Dans **js/app.js**, ligne ~370 :

```javascript
const opt = {
  margin: [10, 10],                    // Marges (mm)
  filename: 'nom-du-fichier.pdf',      // Nom du fichier
  image: { type: 'jpeg', quality: 0.98 }, // Qualité image
  html2canvas: {
    scale: 2,                           // Résolution (2x par défaut)
    useCORS: true                       // Support images externes
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',                       // Format de page
    orientation: 'portrait'             // Orientation
  }
};
```

---

## 📱 Responsive Design

L'application est entièrement responsive grâce aux **container queries** et **media queries** :

- **Desktop** (> 1269px) : Panneau côte à côte
- **Tablet** (< 1269px) : Panneau en colonne
- **Mobile** (< 864px) : Colonnes adaptatives

---

## 🔄 Workflow d'utilisation

```
1. Upload du logo
   ↓
2. Saisie des informations (marque, baseline)
   ↓
3. Configuration des couleurs
   ↓
4. Sélection des typographies
   ↓
5. Ajout des images du moodboard
   ↓
6. Vérification du rendu
   ↓
7. Export en PDF
```

---

## 🐛 Débogage

### Console JavaScript
Ouvrez la console du navigateur (F12) pour voir les éventuelles erreurs.

### Logs utiles
L'application n'affiche pas de logs par défaut. Pour activer le débogage, ajoutez dans app.js :

```javascript
console.log('Données actuelles:', this.data);
```

---

## 🚀 Évolutions possibles

### Fonctionnalités à ajouter
- [ ] Sauvegarde locale (LocalStorage)
- [ ] Import/Export de chartes (JSON)
- [ ] Templates prédéfinis
- [ ] Ajout couleurs illimitées
- [ ] Gestion des déclinaisons de logo
- [ ] Prévisualisation sur différents supports
- [ ] Générateur de palette de couleurs
- [ ] Bibliothèque de typographies
- [ ] Mode collaboratif

### Améliorations techniques
- [ ] Optimisation des performances
- [ ] Progressive Web App (PWA)
- [ ] Mode hors ligne
- [ ] Tests unitaires
- [ ] Documentation API

---

## 🤝 Contribution

Si vous souhaitez contribuer au projet :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence libre. Vous pouvez l'utiliser, le modifier et le distribuer librement.

---

## 👨‍💻 Support

Pour toute question :
- Consultez le **GUIDE_UTILISATION.md** pour l'utilisation détaillée
- Vérifiez la console JavaScript pour les erreurs
- Testez avec Chrome/Firefox pour une meilleure compatibilité

---

## 📊 Statistiques du projet

- **Langages** : HTML, CSS, JavaScript
- **Lignes de code JS** : ~500
- **Lignes de code CSS** : ~1600
- **Nombre de fichiers** : 35+
- **Taille totale** : ~2 MB (avec assets)

---

**Version** : 1.0.0
**Date de création** : Janvier 2026
**Auteur** : Créé avec Claude Code

---

## 🎉 Merci d'utiliser le Créateur de Charte Graphique !

N'hésitez pas à personnaliser l'outil selon vos besoins et à partager vos retours.
