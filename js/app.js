// Charte Graphique - Application JavaScript
// Gestion des interactions et export PDF

class CharteGraphique {
  constructor() {
    this.data = {
      brandName: 'Agence Immo',
      baseline: 'Un projet qui se construit',
      logo: null,
      presentationText: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
      colors: {
        primary: { name: 'Bleu nuit', code: '#274359' },
        secondary: { name: 'Bleu pétrole', code: '#c77a3d' },
        tertiary: { name: 'Blanc glacial', code: '#e3f2fd' },
        gradient: {
          name: 'Opalescent',
          color1: '#5796c6',
          color2: '#ace3ff'
        }
      },
      fonts: {
        primary: { name: 'Onest', style: 'Bold', googleFont: '' },
        secondary: { name: 'Hurricane', style: 'Regular', googleFont: '' }
      },
      moodboard: []
    };

    this.init();
  }

  init() {
    this.setupLogoUpload();
    this.setupBrandInputs();
    this.setupColorPickers();
    this.setupFontInputs();
    this.setupPresentationEditor();
    this.setupMoodboardUpload();
    this.setupMoodboardDragDrop();
    this.setupSectionsDragDrop();
    this.setupPDFExport();
    this.setupNavigation();
    this.setupAccordion();
    this.setupPanelToggle();
  }

  // === ACCORDION ===
  setupAccordion() {
    // Sélectionner toutes les cartes
    const cards = document.querySelectorAll('.card1');

    // Fermer toutes les cartes sauf la première (Logo)
    cards.forEach((card, index) => {
      const chevron = card.querySelector('.row-chevron');
      if (!chevron) return;

      // Fermer toutes les cartes sauf la première (index 0 = Logo)
      if (index !== 0) {
        card.classList.add('collapsed');
        chevron.style.transform = 'rotate(-90deg)';
      }
    });

    // Sélectionner toutes les lignes de titre qui contiennent un chevron
    const headers = document.querySelectorAll('.card1 > .row-a, .card1 > .heading');

    headers.forEach(header => {
      const chevron = header.querySelector('.row-chevron');
      if (!chevron) return;

      // Rendre toute la ligne cliquable
      header.style.cursor = 'pointer';

      header.addEventListener('click', (e) => {
        const card = header.closest('.card1');
        if (!card) return;

        const isCollapsed = card.classList.contains('collapsed');

        // Toggle état
        if (isCollapsed) {
          card.classList.remove('collapsed');
          chevron.style.transform = 'rotate(0deg)';
        } else {
          card.classList.add('collapsed');
          chevron.style.transform = 'rotate(-90deg)';
        }
      });
    });
  }

  // === PANEL TOGGLE ===
  setupPanelToggle() {
    const toggleArea = document.querySelector('.right-panel-row-top');
    const rightPanel = document.querySelector('.right-panel');

    if (!toggleArea || !rightPanel) return;

    // Rendre toute la barre supérieure cliquable
    toggleArea.style.cursor = 'pointer';
    toggleArea.style.userSelect = 'none';

    toggleArea.addEventListener('click', (e) => {
      e.stopPropagation();
      rightPanel.classList.toggle('left-panel-collapsed');
    });
  }

  // === LOGO UPLOAD ===
  setupLogoUpload() {
    const uploadBtn = document.querySelector('.btn2');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.svg';
        input.onchange = (e) => this.handleLogoUpload(e);
        input.click();
      });
    }
  }

  handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.data.logo = event.target.result;
      this.updateLogoPreview(event.target.result);

      // Extraction automatique des couleurs
      this.extractColorsFromLogo(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  updateLogoPreview(src) {
    // Mise à jour du logo dans le panneau de droite
    const logoContainers = document.querySelectorAll('.card-overlay-plus-border-shadow-input, .column-input3');
    logoContainers.forEach(container => {
      if (container.tagName === 'IMG') {
        container.src = src;
      }
    });
  }

  // === COLOR EXTRACTION ===
  extractColorsFromLogo(imageSrc) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      // Créer canvas temporaire
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Réduire taille pour performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Dessiner image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Lire pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = this.getDominantColors(imageData.data, 3);

      // Appliquer couleurs extraites
      if (colors.length >= 1) {
        this.data.colors.primary.code = colors[0];
        this.updateColorPreview('.col2 .column-input1', colors[0], 'primary');
      }
      if (colors.length >= 2) {
        this.data.colors.secondary.code = colors[1];
        this.updateColorPreview('.col3 .column-input1', colors[1], 'secondary');
      }
      if (colors.length >= 3) {
        this.data.colors.tertiary.code = colors[2];
        this.updateColorPreview('.col4 .column-input1', colors[2], 'tertiary');
      }

      // Notification
      this.showNotification('✓ Couleurs extraites du logo');
    };

    img.onerror = () => {
      console.error('Échec extraction couleurs');
    };

    img.src = imageSrc;
  }

  getDominantColors(pixels, numColors) {
    const colorCounts = {};
    const sampleStep = 10; // Échantillonner 1 pixel sur 10

    // Collecter couleurs
    for (let i = 0; i < pixels.length; i += sampleStep * 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      // Ignorer transparents et blancs
      if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;

      // Quantiser (réduire précision pour regrouper)
      const quantR = Math.round(r / 8) * 8;
      const quantG = Math.round(g / 8) * 8;
      const quantB = Math.round(b / 8) * 8;

      const key = `${quantR},${quantG},${quantB}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Trier par fréquence
    const sorted = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, numColors * 3);

    // Sélectionner couleurs distinctes
    const dominantColors = [];

    for (const [colorKey] of sorted) {
      if (dominantColors.length >= numColors) break;

      const [r, g, b] = colorKey.split(',').map(Number);

      // Vérifier distance avec couleurs existantes
      const tooSimilar = dominantColors.some(existing => {
        const [er, eg, eb] = this.hexToRgb(existing);
        const distance = Math.sqrt(
          Math.pow(r - er, 2) +
          Math.pow(g - eg, 2) +
          Math.pow(b - eb, 2)
        );
        return distance < 50; // Seuil de similarité
      });

      if (!tooSimilar) {
        dominantColors.push(this.rgbToHex(r, g, b));
      }
    }

    return dominantColors;
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: 'Inter', sans-serif;
      animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  // === BRAND INPUTS ===
  setupBrandInputs() {
    // Nom de la marque
    const brandNameInput = document.querySelector('.input-group2 .input-group-input');
    const bannerTitle = document.getElementById('banner-brand-name');

    if (brandNameInput) {
      // Initialiser le titre de la bannière avec la valeur par défaut
      if (bannerTitle) {
        bannerTitle.textContent = this.data.brandName;
      }

      brandNameInput.addEventListener('input', (e) => {
        this.data.brandName = e.target.value;

        // Mise à jour du titre de la bannière
        if (bannerTitle) {
          bannerTitle.textContent = e.target.value || 'Nom de la marque';
        }
      });
    }

    // Baseline
    const baselineInput = document.querySelector('.input-group3 .input-group-input');
    const bannerBaseline = document.getElementById('banner-baseline');

    if (baselineInput) {
      // Initialiser le sous-titre de la bannière avec la valeur par défaut
      if (bannerBaseline) {
        bannerBaseline.textContent = this.data.baseline;
      }

      baselineInput.addEventListener('input', (e) => {
        this.data.baseline = e.target.value;

        // Mise à jour du sous-titre de la bannière
        if (bannerBaseline) {
          bannerBaseline.textContent = e.target.value || 'Baseline';
        }
      });
    }
  }

  // === COLOR PICKERS ===
  setupColorPickers() {
    // Couleur primaire
    this.setupColorPicker('.col2 .column-input1', 'primary');

    // Couleur secondaire
    this.setupColorPicker('.col3 .column-input1', 'secondary');

    // Couleur tertiaire
    this.setupColorPicker('.col4 .column-input1', 'tertiary');

    // Dégradé
    this.setupGradientPickers();

    // Inputs de noms de couleurs
    this.setupColorNameInputs();
  }

  setupColorPicker(selector, colorType) {
    const container = document.querySelector(selector);
    if (!container) return;

    container.style.cursor = 'pointer';
    container.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = this.data.colors[colorType].code;
      input.onchange = (e) => {
        const newColor = e.target.value;
        this.data.colors[colorType].code = newColor;
        this.updateColorPreview(selector, newColor, colorType);
      };
      input.click();
    });
  }

  updateColorPreview(selector, color, colorType) {
    const container = document.querySelector(selector);
    if (!container) return;

    // Mise à jour de l'affichage dans le panneau gauche
    const colorBox = container.querySelector('.icon-color-a');
    const colorText = container.querySelector('.column-text-container2');

    if (colorBox) colorBox.style.backgroundColor = color;
    if (colorText) colorText.textContent = color.toUpperCase();

    // Mise à jour dans le panneau de droite
    const previewMap = {
      'primary': '.col7 .column-rect',
      'secondary': '.col8 .column-rect',
      'tertiary': '.col9 .column-rect'
    };

    const previewSelector = previewMap[colorType];
    if (previewSelector) {
      const previewRect = document.querySelector(previewSelector);
      if (previewRect) {
        previewRect.style.backgroundColor = color;
      }
    }

    // Mise à jour du code couleur dans le panneau de droite
    const rightPanelColorCode = document.querySelectorAll('.row-text4');
    const colorIndex = { 'primary': 0, 'secondary': 1, 'tertiary': 2 };
    if (rightPanelColorCode[colorIndex[colorType]]) {
      rightPanelColorCode[colorIndex[colorType]].textContent = color.toUpperCase();
    }
  }

  setupGradientPickers() {
    const gradientContainers = document.querySelectorAll('.col-left1 .btn-input, .col-right1 .btn-input');

    gradientContainers.forEach((container, index) => {
      container.style.cursor = 'pointer';
      container.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = index === 0 ? this.data.colors.gradient.color1 : this.data.colors.gradient.color2;
        input.onchange = (e) => {
          const newColor = e.target.value;
          if (index === 0) {
            this.data.colors.gradient.color1 = newColor;
          } else {
            this.data.colors.gradient.color2 = newColor;
          }
          this.updateGradientPreview();
        };
        input.click();
      });
    });

    // Initialiser le preview au chargement
    this.updateGradientPreview();
  }

  updateGradientPreview() {
    const gradient = `linear-gradient(90deg, ${this.data.colors.gradient.color1} 0%, ${this.data.colors.gradient.color2} 100%)`;

    // Mise à jour dans le panneau de droite
    const gradientRect = document.querySelector('.card-overlay-plus-border-shadow-rect2');
    if (gradientRect) {
      gradientRect.style.background = gradient;
    }

    // Mise à jour des inputs
    const leftInput = document.querySelector('.col-left1 .btn-input-icon-left');
    const rightInput = document.querySelector('.col-right1 .btn-input-icon-left');

    if (leftInput) leftInput.style.backgroundColor = this.data.colors.gradient.color1;
    if (rightInput) rightInput.style.backgroundColor = this.data.colors.gradient.color2;

    // Mise à jour du texte
    const leftLabel = document.querySelector('.col-left1 .btn-input-label');
    const rightLabel = document.querySelector('.col-right1 .btn-input-label');

    if (leftLabel) leftLabel.textContent = this.data.colors.gradient.color1.toUpperCase();
    if (rightLabel) rightLabel.textContent = this.data.colors.gradient.color2.toUpperCase();
  }

  setupColorNameInputs() {
    // Noms des couleurs
    const colorInputs = document.querySelectorAll('.column-b .input-group .input-group-input');

    if (colorInputs[0]) {
      colorInputs[0].addEventListener('input', (e) => {
        this.data.colors.primary.name = e.target.value;
        const preview = document.querySelector('.col7 .row-text3');
        if (preview) preview.textContent = e.target.value;
      });
    }

    if (colorInputs[1]) {
      colorInputs[1].addEventListener('input', (e) => {
        this.data.colors.secondary.name = e.target.value;
        const preview = document.querySelector('.col8 .row-text3');
        if (preview) preview.textContent = e.target.value;
      });
    }

    if (colorInputs[2]) {
      colorInputs[2].addEventListener('input', (e) => {
        this.data.colors.tertiary.name = e.target.value;
        const preview = document.querySelector('.col9 .row-text3');
        if (preview) preview.textContent = e.target.value;
      });
    }

    // Nom du dégradé
    const gradientNameInput = document.querySelector('.col-top3 .input-group-input');
    if (gradientNameInput) {
      gradientNameInput.addEventListener('input', (e) => {
        this.data.colors.gradient.name = e.target.value;
        const preview = document.querySelector('.card-overlay-plus-border-shadow-col-right .row-text3');
        if (preview) preview.textContent = e.target.value;
      });
    }
  }

  // === FONT INPUTS ===
  setupFontInputs() {
    // Font principale - nom
    const primaryFontNameInput = document.querySelector('.col5 .input-group:nth-child(1) .input-group-input');
    if (primaryFontNameInput) {
      primaryFontNameInput.addEventListener('input', (e) => {
        this.data.fonts.primary.name = e.target.value;
        this.updateFontPreview('primary', e.target.value);
      });
    }

    // Font secondaire - nom
    const secondaryFontNameInput = document.querySelector('.col6 .input-group:nth-child(1) .input-group-input');
    if (secondaryFontNameInput) {
      secondaryFontNameInput.addEventListener('input', (e) => {
        this.data.fonts.secondary.name = e.target.value;
        this.updateFontPreview('secondary', e.target.value);
      });
    }

    // Google Fonts - Principal
    const primaryGoogleFontInput = document.querySelector('.col5 .input-group:nth-child(3) .input-group-input');
    if (primaryGoogleFontInput) {
      primaryGoogleFontInput.addEventListener('input', (e) => {
        this.data.fonts.primary.googleFont = e.target.value;
        this.loadGoogleFont(e.target.value);
      });
    }

    // Google Fonts - Secondaire
    const secondaryGoogleFontInput = document.querySelector('.col6 .input-group:nth-child(3) .input-group-input');
    if (secondaryGoogleFontInput) {
      secondaryGoogleFontInput.addEventListener('input', (e) => {
        this.data.fonts.secondary.googleFont = e.target.value;
        this.loadGoogleFont(e.target.value);
      });
    }
  }

  updateFontPreview(fontType, fontName) {
    const selector = fontType === 'primary'
      ? '.card-overlay-plus-border-shadow-text-container3'
      : '.card-overlay-plus-border-shadow-text-container4';

    const preview = document.querySelector(selector);
    if (preview) {
      preview.textContent = fontName;
    }
  }

  loadGoogleFont(fontUrl) {
    // Extraction de l'URL Google Fonts si présente
    const urlMatch = fontUrl.match(/https:\/\/[^\s'"]+/);
    if (urlMatch) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = urlMatch[0];
      document.head.appendChild(link);
    }
  }

  // === PRESENTATION EDITOR ===
  setupPresentationEditor() {
    const presentationDiv = document.querySelector('.right-panel-input');
    if (!presentationDiv) return;

    // Rendre éditable
    presentationDiv.contentEditable = 'true';
    presentationDiv.style.cursor = 'text';

    // Focus
    presentationDiv.addEventListener('focus', (e) => {
      e.target.style.borderColor = 'var(--primary-primary-main)';
    });

    // Blur - sauvegarder
    presentationDiv.addEventListener('blur', (e) => {
      e.target.style.borderColor = 'transparent';
      this.data.presentationText = e.target.textContent.trim();
    });

    // Mise à jour temps réel
    presentationDiv.addEventListener('input', (e) => {
      this.data.presentationText = e.target.textContent.trim();
    });
  }

  // === MOODBOARD ===
  setupMoodboardUpload() {
    const uploadBtn = document.querySelector('.btn-overlay-plus-border12');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => this.handleMoodboardUpload(e);
        input.click();
      });
    }

    // Boutons supprimer
    this.setupMoodboardDelete();
  }

  handleMoodboardUpload(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.data.moodboard.push(event.target.result);
        this.updateMoodboardPreview();
      };
      reader.readAsDataURL(file);
    });
  }

  updateMoodboardPreview() {
    const moodboardItems = document.querySelectorAll('.input-a');

    this.data.moodboard.forEach((image, index) => {
      if (moodboardItems[index]) {
        moodboardItems[index].style.backgroundImage = `url(${image})`;
        moodboardItems[index].dataset.index = index; // Ajouter index pour drag-drop
      }
    });

    // Vider slots vides
    for (let i = this.data.moodboard.length; i < moodboardItems.length; i++) {
      if (moodboardItems[i]) {
        moodboardItems[i].style.backgroundImage = 'none';
      }
    }

    // Réattacher drag-drop listeners
    this.setupMoodboardDragDrop();
  }

  setupMoodboardDelete() {
    const deleteButtons = document.querySelectorAll('.btn-overlay-plus-border3');

    deleteButtons.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentInput = btn.closest('.input-a');
        if (parentInput) {
          parentInput.style.backgroundImage = 'none';
          if (this.data.moodboard[index]) {
            this.data.moodboard.splice(index, 1);
          }
        }
      });
    });
  }

  setupMoodboardDragDrop() {
    const items = document.querySelectorAll('.input-a');

    items.forEach((item, index) => {
      item.draggable = true;
      item.dataset.index = index;

      // Démarrage drag
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
        this.draggedItemIndex = parseInt(e.currentTarget.dataset.index);
      });

      // Survol
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      item.addEventListener('dragenter', (e) => {
        if (e.target.classList.contains('input-a')) {
          e.target.classList.add('drag-over');
        }
      });

      item.addEventListener('dragleave', (e) => {
        if (e.target.classList.contains('input-a')) {
          e.target.classList.remove('drag-over');
        }
      });

      // Drop
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dropIndex = parseInt(e.currentTarget.dataset.index);

        // Réorganiser tableau
        const draggedItem = this.data.moodboard[this.draggedItemIndex];
        this.data.moodboard.splice(this.draggedItemIndex, 1);
        this.data.moodboard.splice(dropIndex, 0, draggedItem);

        // Mettre à jour affichage
        this.updateMoodboardPreview();

        // Reset classes
        document.querySelectorAll('.input-a').forEach(el => {
          el.classList.remove('dragging', 'drag-over');
        });
      });

      // Fin drag
      item.addEventListener('dragend', (e) => {
        e.currentTarget.classList.remove('dragging');
        document.querySelectorAll('.input-a').forEach(el => {
          el.classList.remove('drag-over');
        });
      });
    });
  }

  // === SECTIONS DRAG AND DROP ===
  setupSectionsDragDrop() {
    const container = document.querySelector('.right-panel-col2');
    if (!container) return;

    // Sélectionner toutes les sections draggables dans le panneau de prévisualisation
    const sections = container.querySelectorAll('.card1');

    sections.forEach((section) => {
      const dragHandle = section.querySelector('.heading');
      if (!dragHandle) return;

      // Rendre tout le heading draggable (zone plus large)
      dragHandle.style.cursor = 'grab';
      dragHandle.classList.add('drag-handle');

      // Activer draggable sur mousedown du heading
      dragHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        section.setAttribute('draggable', 'true');
        dragHandle.style.cursor = 'grabbing';
      });

      // Désactiver draggable sur mouseup
      dragHandle.addEventListener('mouseup', () => {
        section.setAttribute('draggable', 'false');
        dragHandle.style.cursor = 'grab';
      });

      // Démarrage du drag
      section.addEventListener('dragstart', (e) => {
        // Vérifier que le drag commence bien depuis le heading-group
        if (!e.target.classList.contains('card1')) return;

        e.dataTransfer.effectAllowed = 'move';
        section.classList.add('section-dragging');
        this.draggedSection = section;
      });

      // Survol d'une autre section
      section.addEventListener('dragover', (e) => {
        e.preventDefault();

        if (!this.draggedSection) return;
        if (section === this.draggedSection) return;

        const afterElement = this.getDragAfterElement(container, e.clientY);

        if (afterElement == null) {
          container.appendChild(this.draggedSection);
        } else {
          container.insertBefore(this.draggedSection, afterElement);
        }
      });

      section.addEventListener('dragenter', (e) => {
        if (section !== this.draggedSection) {
          section.classList.add('section-drag-over');
        }
      });

      section.addEventListener('dragleave', (e) => {
        // Vérifier si on quitte vraiment la section
        const rect = section.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX >= rect.right ||
          e.clientY < rect.top ||
          e.clientY >= rect.bottom
        ) {
          section.classList.remove('section-drag-over');
        }
      });

      // Drop
      section.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      // Fin du drag
      section.addEventListener('dragend', (e) => {
        section.classList.remove('section-dragging');
        section.setAttribute('draggable', 'false');
        dragHandle.style.cursor = 'grab';

        // Nettoyer toutes les classes
        container.querySelectorAll('.card1').forEach(el => {
          el.classList.remove('section-drag-over', 'section-dragging');
        });

        this.draggedSection = null;

        // Mettre à jour l'ordre du sommaire
        this.updateTableOfContents();
      });
    });
  }

  updateTableOfContents() {
    const container = document.querySelector('.right-panel-col2');
    const tocContainer = document.querySelector('.right-panel-col3');

    if (!container || !tocContainer) return;

    // Obtenir l'ordre actuel des sections
    const sections = container.querySelectorAll('.card1');
    const sectionTitles = Array.from(sections).map(section => {
      const headingText = section.querySelector('.heading-text');
      return headingText ? headingText.textContent.trim() : null;
    }).filter(title => title !== null);

    // Obtenir tous les éléments du sommaire
    const tocItems = Array.from(tocContainer.querySelectorAll('.overlay-plus-border-shadow'));

    // Créer un mapping entre les titres et les éléments du sommaire
    const tocMap = new Map();
    tocItems.forEach(item => {
      const text = item.querySelector('.overlay-plus-border-shadow-text');
      if (text) {
        tocMap.set(text.textContent.trim(), item);
      }
    });

    // Réorganiser les éléments du sommaire selon l'ordre des sections
    sectionTitles.forEach(title => {
      const tocItem = tocMap.get(title);
      if (tocItem) {
        tocContainer.appendChild(tocItem);
      }
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card1:not(.section-dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // === NAVIGATION ===
  setupNavigation() {
    const tocContainer = document.querySelector('.right-panel-col3');
    if (!tocContainer) return;

    // Délégation d'événement pour gérer la navigation même après réorganisation
    tocContainer.addEventListener('click', (e) => {
      const navItem = e.target.closest('.overlay-plus-border-shadow');
      if (!navItem) return;

      const tocText = navItem.querySelector('.overlay-plus-border-shadow-text');
      if (!tocText) return;

      const targetTitle = tocText.textContent.trim();

      // Trouver la section correspondante
      const sections = document.querySelectorAll('.right-panel-col2 .card1');
      const targetSection = Array.from(sections).find(section => {
        const headingText = section.querySelector('.heading-text');
        return headingText && headingText.textContent.trim() === targetTitle;
      });

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Style curseur pour tous les items
    const navItems = tocContainer.querySelectorAll('.overlay-plus-border-shadow');
    navItems.forEach(item => {
      item.style.cursor = 'pointer';
    });
  }

  // === PDF EXPORT ===
  setupPDFExport() {
    const exportBtn = document.querySelector('.btn-overlay-plus-border13');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToPDF());
    }
  }

  async exportToPDF() {
    // Charger jsPDF et html2canvas si nécessaire
    await this.loadPDFLibraries();

    const element = document.querySelector('.right-panel-col2');
    if (!element) {
      alert('Erreur : impossible de trouver le contenu à exporter');
      return;
    }

    const loadingMsg = this.showLoadingMessage();

    try {
      // Cacher les SVG objects temporairement
      const svgObjects = element.querySelectorAll('object[type="image/svg+xml"]');
      const savedDisplayValues = [];
      svgObjects.forEach(obj => {
        savedDisplayValues.push({ element: obj, display: obj.style.display });
        obj.style.display = 'none';
      });

      // Optimiser les styles pour le PDF
      const originalStyles = this.savePDFStyles(element);
      this.applyPDFStyles(element);

      // Configuration PDF
      const margin = { top: 10, right: 15, bottom: 10, left: 15 }; // en mm
      const pageWidth = 210; // A4 width en mm
      const pageHeight = 297; // A4 height en mm
      const contentWidth = pageWidth - margin.left - margin.right;
      const contentHeight = pageHeight - margin.top - margin.bottom;

      // Créer le PDF
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Récupérer toutes les sections dans l'ordre du DOM (compatible drag & drop)
      const allSections = Array.from(element.querySelectorAll('.banner, .right-panel-overlay-plus, .card1'));

      // Filtrer pour ne garder que les sections de premier niveau (pas les enfants imbriqués)
      const sections = allSections.filter(section => {
        // Vérifier si un parent a aussi la classe card1, banner ou right-panel-overlay-plus
        const parent = section.parentElement.closest('.banner, .right-panel-overlay-plus, .card1');
        return !parent; // Garder seulement si pas de parent avec ces classes
      });

      let currentY = margin.top;
      let isFirstPage = true;

      // Capturer et ajouter chaque section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // Sauvegarder le transform original
        const originalTransform = section.style.transform;
        const originalTransformOrigin = section.style.transformOrigin;

        // Agrandir la section de 30% pour rendre le texte plus lisible
        section.style.transform = 'scale(1.3)';
        section.style.transformOrigin = 'top left';

        // Attendre que le navigateur recalcule
        await new Promise(resolve => setTimeout(resolve, 50));

        // Capturer la section avec html2canvas
        const canvas = await html2canvas(section, {
          scale: 2,
          logging: false,
          allowTaint: false,
          useCORS: false,
          backgroundColor: '#ffffff'
        });

        // Restaurer le transform
        section.style.transform = originalTransform;
        section.style.transformOrigin = originalTransformOrigin;

        // Calculer les dimensions de la section en mm
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Vérifier si la section rentre sur la page courante
        if (!isFirstPage && currentY + imgHeight > pageHeight - margin.bottom) {
          // La section ne rentre pas, créer une nouvelle page
          pdf.addPage();
          currentY = margin.top;
        }

        // Ajouter l'image au PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', margin.left, currentY, imgWidth, imgHeight);

        // Mettre à jour la position Y
        currentY += imgHeight + 5; // 5mm d'espace entre sections
        isFirstPage = false;
      }

      // Sauvegarder le PDF
      const filename = `charte-graphique-${this.data.brandName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(filename);

      // Restaurer les styles
      this.restorePDFStyles(element, originalStyles);
      savedDisplayValues.forEach(({ element, display }) => {
        element.style.display = display;
      });

      this.hideLoadingMessage(loadingMsg);
    } catch (error) {
      this.hideLoadingMessage(loadingMsg);
      console.error('Erreur PDF:', error);
      alert('Erreur lors de l\'export PDF : ' + error.message);
    }
  }

  savePDFStyles(element) {
    const bannerTitle = document.getElementById('banner-brand-name');
    const bannerSubtitle = document.getElementById('banner-baseline');
    const bannerGraphic = document.querySelector('.banner-graphic');

    return {
      element: {
        maxWidth: element.style.maxWidth,
        padding: element.style.padding,
        gap: element.style.gap,
        marginTop: element.style.marginTop
      },
      banner: {
        titleAlign: bannerTitle?.style.textAlign,
        subtitleAlign: bannerSubtitle?.style.textAlign,
        graphicMargin: bannerGraphic?.style.margin
      }
    };
  }

  applyPDFStyles(element) {
    element.style.maxWidth = '95%';
    element.style.padding = '0 12px';
    element.style.gap = '8px';
    element.style.marginTop = '8px';

    const bannerTitle = document.getElementById('banner-brand-name');
    const bannerSubtitle = document.getElementById('banner-baseline');
    const bannerGraphic = document.querySelector('.banner-graphic');

    if (bannerTitle) bannerTitle.style.textAlign = 'left';
    if (bannerSubtitle) bannerSubtitle.style.textAlign = 'left';
    if (bannerGraphic) bannerGraphic.style.margin = '-92px 0 -93px auto';
  }

  restorePDFStyles(element, originalStyles) {
    element.style.maxWidth = originalStyles.element.maxWidth;
    element.style.padding = originalStyles.element.padding;
    element.style.gap = originalStyles.element.gap;
    element.style.marginTop = originalStyles.element.marginTop;

    const bannerTitle = document.getElementById('banner-brand-name');
    const bannerSubtitle = document.getElementById('banner-baseline');
    const bannerGraphic = document.querySelector('.banner-graphic');

    if (bannerTitle) bannerTitle.style.textAlign = originalStyles.banner.titleAlign;
    if (bannerSubtitle) bannerSubtitle.style.textAlign = originalStyles.banner.subtitleAlign;
    if (bannerGraphic) bannerGraphic.style.margin = originalStyles.banner.graphicMargin;
  }

  loadPDFLibraries() {
    return new Promise((resolve, reject) => {
      // Vérifier si jsPDF est déjà chargé
      if (typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
        resolve();
        return;
      }

      // Charger jsPDF
      const jspdfScript = document.createElement('script');
      jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

      jspdfScript.onload = () => {
        // Charger html2canvas après jsPDF
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.onload = resolve;
        html2canvasScript.onerror = reject;
        document.head.appendChild(html2canvasScript);
      };

      jspdfScript.onerror = reject;
      document.head.appendChild(jspdfScript);
    });
  }

  showLoadingMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
      background: white;
      padding: 30px 50px;
      border-radius: 12px;
      text-align: center;
      font-family: 'Inter', sans-serif;
    `;
    message.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #212122;">Génération du PDF...</h3>
      <p style="margin: 0; color: #737373;">Veuillez patienter</p>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    return overlay;
  }

  hideLoadingMessage(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }
}

// Initialisation au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CharteGraphique();
  });
} else {
  new CharteGraphique();
}
