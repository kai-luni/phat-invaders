// LostMenu.js
import Events from '../Events.js';

export default class LostMenu {
  constructor(assets) {
    this.assets = assets;
    this.events = new Events();
    this.highScore = 0; 
    this.level = 0;     

    // Create the modal elements
    this.createModal();
  }

  createModal() {
    // Create the modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.style.position = 'fixed';
    this.modalOverlay.style.top = '0';
    this.modalOverlay.style.left = '0';
    this.modalOverlay.style.width = '100%';
    this.modalOverlay.style.height = '100%';
    this.modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.modalOverlay.style.display = 'none'; 
    this.modalOverlay.style.zIndex = '1000'; 

    // Create the modal content container
    this.modalContent = document.createElement('div');
    this.modalContent.style.position = 'absolute';
    this.modalContent.style.top = '50%';
    this.modalContent.style.left = '50%';
    this.modalContent.style.transform = 'translate(-50%, -50%)';
    this.modalContent.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.modalContent.style.padding = '20px';
    this.modalContent.style.borderRadius = '5px';
    this.modalContent.style.textAlign = 'center';
    this.modalContent.style.width = '400px';
    this.modalContent.style.fontFamily = 'Arial'; // Set font to Arial

    // Use the assets class for the Game Over image
    const gameOverImage = this.assets.gameOverTextTexture;
    gameOverImage.style.width = '100%';
    gameOverImage.style.marginBottom = '20px';

    // Instructions (in German)
    this.instructions = document.createElement('p');
    this.instructions.textContent =
      'Möchtest du deinen beeindruckenden Erfolg in der Rangliste sehen? Gib hier deinen Spielernamen und deine E-Mail-Adresse ein.';
    this.instructions.style.color = '#9AF11C';
    this.instructions.style.marginTop = '10px';
    this.instructions.style.fontSize = '14px';

    // Warning text (in German)
    this.warning = document.createElement('p');
    this.warning.textContent =
      'Wenn du diese Seite verlässt, ohne deinen Spielernamen und deine E-Mail-Adresse einzugeben, geht dein Punktestand verloren.';
    this.warning.style.color = '#9AF11C';
    this.warning.style.marginTop = '10px';
    this.warning.style.fontSize = '12px';

    // Name label (in German)
    this.nameLabel = document.createElement('label');
    this.nameLabel.textContent = 'Spielername';
    this.nameLabel.style.display = 'block';
    this.nameLabel.style.marginTop = '20px';
    this.nameLabel.style.color = '#9AF11C';

    // Name input
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Spielername eingeben';
    this.nameInput.style.width = '100%';
    this.nameInput.style.padding = '8px';
    this.nameInput.style.marginTop = '5px';
    this.nameInput.style.backgroundColor = '#000000';
    this.nameInput.style.color = '#9AF11C';
    this.nameInput.style.border = `1px solid #9AF11C`;
    this.nameInput.style.borderRadius = '5px';

    // Email label (in German)
    this.emailLabel = document.createElement('label');
    this.emailLabel.textContent = 'E-Mail-Adresse';
    this.emailLabel.style.display = 'block';
    this.emailLabel.style.marginTop = '10px';
    this.emailLabel.style.color = '#9AF11C';

    // Email input
    this.emailInput = document.createElement('input');
    this.emailInput.type = 'email';
    this.emailInput.placeholder = 'E-Mail-Adresse eingeben';
    this.emailInput.style.width = '100%';
    this.emailInput.style.padding = '8px';
    this.emailInput.style.marginTop = '5px';
    this.emailInput.style.backgroundColor = '#000000';
    this.emailInput.style.color = '#9AF11C';
    this.emailInput.style.border = `1px solid #9AF11C`;
    this.emailInput.style.borderRadius = '5px';

    // Submit button (in German)
    this.modalSubmitButton = document.createElement('button');
    this.modalSubmitButton.textContent = 'Punktestand eintragen';
    this.modalSubmitButton.style.width = '100%';
    this.modalSubmitButton.style.padding = '10px';
    this.modalSubmitButton.style.marginTop = '20px';
    this.modalSubmitButton.style.backgroundColor = '#9AF11C';
    this.modalSubmitButton.style.color = 'black';
    this.modalSubmitButton.style.border = 'none';
    this.modalSubmitButton.style.borderRadius = '5px';
    this.modalSubmitButton.style.fontSize = '16px';
    this.modalSubmitButton.style.cursor = 'pointer';

    // Try Again button (in German)
    this.tryAgainButton = document.createElement('button');
    this.tryAgainButton.textContent = 'Erneut versuchen';
    this.tryAgainButton.style.width = '100%';
    this.tryAgainButton.style.padding = '10px';
    this.tryAgainButton.style.marginTop = '10px';
    this.tryAgainButton.style.backgroundColor = '#9AF11C';
    this.tryAgainButton.style.color = 'black';
    this.tryAgainButton.style.border = 'none';
    this.tryAgainButton.style.borderRadius = '5px';
    this.tryAgainButton.style.fontSize = '16px';
    this.tryAgainButton.style.cursor = 'pointer';

    // Message display (in German)
    this.messageDisplay = document.createElement('p');
    this.messageDisplay.style.marginTop = '20px';
    this.messageDisplay.style.color = '#9AF11C';

    // German info text
    this.germanInfo = document.createElement('p');
    this.germanInfo.innerHTML = `Der/die GewinnerIn erhält eine kleine Überraschung. Die Gewinnbenachrichtigung erfolgt per Mail. Ihre personenbezogenen Daten verwenden wir aufgrund Art. 6 Abs. 1 lit. b) DS-GVO nur zur Durchführung des Gewinnspiels und geben sie nicht an Dritte weiter. <a href="https://www.phatconsulting.de/impressum-datenschutz/" target="_blank" style="color:#9AF11C;">Anbieterkennzeichnung und mehr Datenschutzinformationen</a>`;
    this.germanInfo.style.color = '#9AF11C';
    this.germanInfo.style.fontSize = '12px';
    this.germanInfo.style.marginTop = '10px';

    // Append elements to modal content
    this.modalContent.appendChild(gameOverImage);
    this.modalContent.appendChild(this.instructions);
    this.modalContent.appendChild(this.warning);
    this.modalContent.appendChild(this.nameLabel);
    this.modalContent.appendChild(this.nameInput);
    this.modalContent.appendChild(this.emailLabel);
    this.modalContent.appendChild(this.emailInput);
    this.modalContent.appendChild(this.modalSubmitButton);
    this.modalContent.appendChild(this.tryAgainButton);
    this.modalContent.appendChild(this.messageDisplay);
    this.modalContent.appendChild(this.germanInfo);

    // Append modal content to overlay
    this.modalOverlay.appendChild(this.modalContent);

    // Append modal overlay to body
    document.body.appendChild(this.modalOverlay);

    // Bind event listeners
    this.modalSubmitButton.addEventListener('click', this.onModalSubmit.bind(this));
    this.tryAgainButton.addEventListener('click', this.onTryAgainClick.bind(this));
  }

  async onModalSubmit() {
    const playerName = this.nameInput.value.trim() || 'Anonymous';
    let email = this.emailInput.value.trim();

    // Validate email if provided
    if (email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.messageDisplay.textContent = 'Ungültiges E-Mail-Format.';
        return;
      }
    }

    try {
      const data = {
        name: playerName,
        level: this.level,
        score: this.highScore,
        version: 2
      };

      if (email !== '') {
        data.email = email;
      }

      const response = await fetch(
        'https://si-game-highscores-func.azurewebsites.net/api/SaveHighScore',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        this.messageDisplay.textContent = 'Punktestand erfolgreich eingetragen!';
        // Deactivate all inputs and buttons after sending
        this.nameInput.disabled = true;
        this.emailInput.disabled = true;
        this.modalSubmitButton.disabled = true;
        this.tryAgainButton.disabled = true;

        // Change cursor style
        this.nameInput.style.cursor = 'not-allowed';
        this.emailInput.style.cursor = 'not-allowed';
        this.modalSubmitButton.style.cursor = 'not-allowed';
        this.tryAgainButton.style.cursor = 'not-allowed';

        // Adjust styles to indicate disabled state
        const disabledOpacity = '0.5';
        this.nameInput.style.opacity = disabledOpacity;
        this.emailInput.style.opacity = disabledOpacity;
        this.modalSubmitButton.style.opacity = disabledOpacity;
        this.tryAgainButton.style.opacity = disabledOpacity;

        // Emit 'highscore' event
        this.events.emit('highscore');
      } else {
        this.messageDisplay.textContent = 'Punktestand konnte nicht eingetragen werden. Bitte erneut versuchen!';
      }
    } catch (error) {
      console.error('Error submitting high score:', error);
      this.messageDisplay.textContent = 'Beim Eintragen des Punktestands ist ein Fehler aufgetreten.';
    }
  }

  onTryAgainClick() {
    this.events.emit('start');
  }

  showModal() {
    // Reset input fields and message
    this.nameInput.value = '';
    this.emailInput.value = '';
    this.messageDisplay.textContent = '';
    this.nameInput.disabled = false;
    this.emailInput.disabled = false;
    this.modalSubmitButton.disabled = false;
    this.tryAgainButton.disabled = false;

    // Reset cursor styles
    this.nameInput.style.cursor = 'text';
    this.emailInput.style.cursor = 'text';
    this.modalSubmitButton.style.cursor = 'pointer';
    this.tryAgainButton.style.cursor = 'pointer';

    // Reset opacity
    this.nameInput.style.opacity = '1';
    this.emailInput.style.opacity = '1';
    this.modalSubmitButton.style.opacity = '1';
    this.tryAgainButton.style.opacity = '1';

    if (this.canSubmitHighscore()) {
      // Score is higher than 5000, show all elements
      this.instructions.style.display = 'block';
      this.warning.style.display = 'block';
      this.nameLabel.style.display = 'block';
      this.nameInput.style.display = 'block';
      this.emailLabel.style.display = 'block';
      this.emailInput.style.display = 'block';
      this.modalSubmitButton.style.display = 'block';
      this.messageDisplay.style.display = 'block';
      this.germanInfo.style.display = 'block';
    } else {
      // Score is 5000 or less, only show the gameOverImage and tryAgainButton
      this.instructions.style.display = 'none';
      this.warning.style.display = 'none';
      this.nameLabel.style.display = 'none';
      this.nameInput.style.display = 'none';
      this.emailLabel.style.display = 'none';
      this.emailInput.style.display = 'none';
      this.modalSubmitButton.style.display = 'none';
      this.messageDisplay.style.display = 'none';
      this.germanInfo.style.display = 'none';
    }

    this.tryAgainButton.style.display = 'block';

    this.modalOverlay.style.display = 'block';
  }

  canSubmitHighscore() {
    return this.highScore > 5000;
  }

  hideModal() {
    this.modalOverlay.style.display = 'none';
  }

  bind() {
    this.showModal();
  }

  unbind() {
    this.hideModal();
  }

  setGameValues(score, level) {
    this.highScore = score;
    this.level = level;
  }

  render() {
    // No additional rendering needed
  }

  destroy() {
    this.modalOverlay.remove();
  }
}
