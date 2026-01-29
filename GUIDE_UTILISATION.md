# Guide d'utilisation - Créateur de Charte Graphique

## 📋 Vue d'ensemble

Cet outil permet aux designers de créer facilement une charte graphique professionnelle en partant d'un logo et en personnalisant les couleurs, typographies et moodboard.

## 🚀 Démarrage rapide

1. Ouvrez le fichier **tunnel-creation.html** dans votre navigateur
2. Le panneau de gauche (sidebar) permet d'éditer tous les éléments
3. Le panneau de droite affiche le rendu en temps réel
4. Cliquez sur "Télécharger la charte" pour exporter en PDF

## ✨ Fonctionnalités

### 1. Logo & Identité

#### Upload du logo
- Cliquez sur le bouton **"Déposer un logo"**
- Sélectionnez votre logo (formats acceptés : PNG, JPG, SVG)
- Le logo s'affichera automatiquement dans le panneau de droite

#### Informations de marque
- **Nom de la marque** : Saisir le nom de votre marque
- **Baseline** : Ajouter votre slogan/baseline
- Les modifications sont appliquées en temps réel

---

### 2. Couleurs

#### Couleurs principales
- **Primaire** : Cliquez sur le bloc couleur pour ouvrir le sélecteur
- **Secondaire** : Cliquez sur le bloc couleur pour ouvrir le sélecteur
- **Tertiaire** : Cliquez sur le bloc couleur pour ouvrir le sélecteur

#### Noms des couleurs
- Modifiez le nom de chaque couleur dans les champs texte
- Le nom apparaît dans le panneau de droite

#### Dégradé
- Cliquez sur les deux blocs couleur pour définir le dégradé
- Nommez votre dégradé
- Le rendu du dégradé s'affiche à droite

#### Ajouter une couleur supplémentaire
- Bouton **"Ajouter une couleur"** (fonctionnalité extensible)

---

### 3. Typographies

#### Police principale
- **Nom de la font** : Saisir le nom (ex: "Onest", "Roboto")
- **Style** : Sélectionner le style (Bold, Regular, etc.)
- **Google Font** : Coller le lien `@import` ou `<link>` Google Fonts

#### Police secondaire
- Mêmes options que pour la police principale

#### Charger une font personnalisée
- Utilisez le bouton **"Charger une font"**
- Assurez-vous d'avoir les droits d'utilisation

---

### 4. Moodboard

#### Ajouter des images
- Cliquez sur **"Déposer une image"**
- Sélectionnez une ou plusieurs images (sélection multiple possible)
- Les images s'ajoutent au moodboard

#### Supprimer des images
- Survolez une image du moodboard
- Cliquez sur le bouton **"Supprimer"**

---

### 5. Navigation

Le panneau de droite contient un menu de navigation :
- **Présentation**
- **Logo & déclinaisons**
- **Couleurs**
- **Typographies**
- **Moodboard**

Cliquez sur n'importe quelle section pour y accéder directement (scroll automatique).

---

### 6. Export PDF

#### Générer la charte complète
1. Vérifiez que toutes vos informations sont correctes
2. Cliquez sur **"Télécharger la charte"** dans la section "Générer la charte"
3. Un message de chargement s'affiche
4. Le PDF se télécharge automatiquement

#### Nom du fichier
Le fichier PDF sera nommé : `charte-graphique-[nom-de-votre-marque].pdf`

---

## 🎨 Conseils d'utilisation

### Logo
- Privilégiez le format **SVG** pour une qualité optimale
- Assurez-vous que votre logo a un fond transparent si nécessaire

### Couleurs
- Testez différentes combinaisons pour la lisibilité
- Le code couleur hexadécimal est mis à jour automatiquement

### Typographies
- Pour Google Fonts :
  1. Allez sur [fonts.google.com](https://fonts.google.com)
  2. Sélectionnez votre police
  3. Copiez le lien `@import` ou `<link>`
  4. Collez-le dans le champ "Google Font"

### Moodboard
- Ajoutez 3 à 5 images représentatives de votre identité visuelle
- Les images peuvent être des textures, ambiances, compositions, etc.

---

## 🔧 Configuration technique

### Structure des fichiers
```
Nouveau dossier (2)/
├── index.html                  # Page d'accueil
├── tunnel-creation.html        # Application principale
├── css/
│   ├── reset.css              # Reset CSS
│   ├── global.css             # Styles globaux et variables
│   └── tunnel-creation.css    # Styles spécifiques
├── js/
│   └── app.js                 # Logique JavaScript
├── assets/                    # Images et icônes
└── README.md
```

### Variables CSS personnalisables

Le fichier `css/global.css` contient des variables CSS que vous pouvez modifier :

```css
:root {
  --primary-primary-main: #bed000;
  --secondary-secondary-main: #525254;
  --white: #fff;
  --black: #000;
  /* ... autres variables */
}
```

---

## 🐛 Résolution de problèmes

### Le logo ne s'affiche pas
- Vérifiez que le fichier est bien une image (PNG, JPG, SVG)
- Essayez avec un autre fichier

### Les couleurs ne changent pas
- Assurez-vous de cliquer directement sur le bloc de couleur
- Rafraîchissez la page si nécessaire

### L'export PDF ne fonctionne pas
- Vérifiez votre connexion internet (nécessaire pour charger la bibliothèque)
- Essayez avec un autre navigateur (Chrome/Firefox recommandés)

### Les fonts Google ne se chargent pas
- Vérifiez que le lien Google Fonts est correct
- Format attendu : `@import url('https://fonts.googleapis.com/...')`

---

## 📱 Compatibilité

- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- 📱 Responsive (fonctionne sur mobile/tablette)

---

## 🎯 Fonctionnalités avancées (à venir)

- [ ] Personnalisation des déclinaisons de logo
- [ ] Ajout de couleurs supplémentaires illimitées
- [ ] Gestion des typographies supplémentaires
- [ ] Templates de présentation prédéfinis
- [ ] Import/Export de chartes existantes

---

## 💡 Support

Pour toute question ou problème :
- Vérifiez ce guide d'utilisation
- Consultez les commentaires dans le code source
- Testez dans un navigateur récent

---

**Version** : 1.0
**Dernière mise à jour** : 2026-01-29
