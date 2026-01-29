// Charte Graphique - Application JavaScript
// Gestion des interactions et export PDF

class CharteGraphique {
  constructor() {
    this.data = {
      brandName: 'Agence Immo',
      baseline: 'Un projet qui se construit',
      logo: null,
      colors: {
        primary: { name: 'Bleu nuit', code: '#274359' },
        secondary: { name: 'Bleu pétrole', code: '#c77a3d' },
        tertiary: { name: 'Blanc glacial', code: '#e3f2fd' },
        gradient: {
          name: 'Opalescent',
          color1: '#e3f2fd',
          color2: '#e3f2fd'
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
    this.setupMoodboardUpload();
    this.setupPDFExport();
    this.setupNavigation();
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

  // === BRAND INPUTS ===
  setupBrandInputs() {
    // Nom de la marque
    const brandNameInput = document.querySelector('.input-group2 .input-group-input');
    if (brandNameInput) {
      brandNameInput.addEventListener('input', (e) => {
        this.data.brandName = e.target.value;
        // Mise à jour du rendu si nécessaire
      });
    }

    // Baseline
    const baselineInput = document.querySelector('.input-group3 .input-group-input');
    if (baselineInput) {
      baselineInput.addEventListener('input', (e) => {
        this.data.baseline = e.target.value;
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
      }
    });
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

  // === NAVIGATION ===
  setupNavigation() {
    const navItems = document.querySelectorAll('.overlay-plus-border-shadow');
    const sections = document.querySelectorAll('.right-panel-col2 > .card1, .right-panel-overlay-plus');

    navItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        if (sections[index]) {
          sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
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
    // Vérifier si html2pdf est chargé
    if (typeof html2pdf === 'undefined') {
      alert('Chargement de la bibliothèque PDF...');
      await this.loadHTML2PDF();
    }

    const element = document.querySelector('.right-panel-col2');
    if (!element) {
      alert('Erreur : impossible de trouver le contenu à exporter');
      return;
    }

    // Configuration de l'export
    const opt = {
      margin: [10, 10],
      filename: `charte-graphique-${this.data.brandName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Afficher un message de chargement
    const loadingMsg = this.showLoadingMessage();

    try {
      await html2pdf().set(opt).from(element).save();
      this.hideLoadingMessage(loadingMsg);
    } catch (error) {
      this.hideLoadingMessage(loadingMsg);
      alert('Erreur lors de l\'export PDF : ' + error.message);
    }
  }

  loadHTML2PDF() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
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
