// LostMenu.js
import Events from '../Events.js';

export default class LostMenu {
  constructor() {
    this.events = new Events();
    this.highScore = 0; // Initialize with 0 as default

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
    this.modalOverlay.style.display = 'none'; // Hidden by default
    this.modalOverlay.style.zIndex = '1000'; // Ensure it appears above other elements

    // Create the modal content container
    this.modalContent = document.createElement('div');
    this.modalContent.style.position = 'absolute';
    this.modalContent.style.top = '50%';
    this.modalContent.style.left = '50%';
    this.modalContent.style.transform = 'translate(-50%, -50%)';
    this.modalContent.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Translucent background
    this.modalContent.style.padding = '20px';
    this.modalContent.style.borderRadius = '5px';
    this.modalContent.style.textAlign = 'center';
    this.modalContent.style.width = '400px';

    // Create the form elements
    const heading = document.createElement('h2');
    heading.textContent = 'Game Over';
    heading.style.color = '#9AF11C'; // Set font color

    // Instructions text
    const instructions = document.createElement('p');
    instructions.textContent =
      'Would you like to see your amazing success in the scoreboard? Then enter your gamer name and email address here.';
    instructions.style.color = '#9AF11C'; // Set font color
    instructions.style.marginTop = '10px';
    instructions.style.fontSize = '14px'; // Smaller text

    // Warning text
    const warning = document.createElement('p');
    warning.textContent =
      'If you leave this page without submitting your gamer name and email address, your score will be lost.';
    warning.style.color = '#9AF11C'; // Set font color
    warning.style.marginTop = '10px';
    warning.style.fontSize = '12px'; // Even smaller text

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Gamer Name';
    nameLabel.style.display = 'block';
    nameLabel.style.marginTop = '20px';
    nameLabel.style.color = '#9AF11C'; // Set font color

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Enter your gamer name';
    this.nameInput.style.width = '100%';
    this.nameInput.style.padding = '8px';
    this.nameInput.style.marginTop = '5px';
    this.nameInput.style.backgroundColor = '#000000'; // Black background
    this.nameInput.style.color = '#9AF11C'; // Font color
    this.nameInput.style.border = `1px solid #9AF11C`; // Outline color
    this.nameInput.style.borderRadius = '5px';

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email Address';
    emailLabel.style.display = 'block';
    emailLabel.style.marginTop = '10px';
    emailLabel.style.color = '#9AF11C'; // Set font color

    this.emailInput = document.createElement('input');
    this.emailInput.type = 'email';
    this.emailInput.placeholder = 'Enter your email address';
    this.emailInput.style.width = '100%';
    this.emailInput.style.padding = '8px';
    this.emailInput.style.marginTop = '5px';
    this.emailInput.style.backgroundColor = '#000000'; // Black background
    this.emailInput.style.color = '#9AF11C'; // Font color
    this.emailInput.style.border = `1px solid #9AF11C`; // Outline color
    this.emailInput.style.borderRadius = '5px';

    // Submit button
    this.modalSubmitButton = document.createElement('button');
    this.modalSubmitButton.textContent = 'Add my score to the board';
    this.modalSubmitButton.style.width = '100%';
    this.modalSubmitButton.style.padding = '10px';
    this.modalSubmitButton.style.marginTop = '20px';
    this.modalSubmitButton.style.backgroundColor = '#9AF11C'; // Green background
    this.modalSubmitButton.style.color = 'black'; // Text color black
    this.modalSubmitButton.style.border = 'none'; // Remove border
    this.modalSubmitButton.style.borderRadius = '5px';
    this.modalSubmitButton.style.fontSize = '16px';
    this.modalSubmitButton.style.cursor = 'pointer';

    this.tryAgainButton = document.createElement('button');
    this.tryAgainButton.textContent = 'Try again';
    this.tryAgainButton.style.width = '100%';
    this.tryAgainButton.style.padding = '10px';
    this.tryAgainButton.style.marginTop = '10px';
    this.tryAgainButton.style.backgroundColor = '#9AF11C'; // Green background
    this.tryAgainButton.style.color = 'black'; // Text color black
    this.tryAgainButton.style.border = 'none'; // Remove border
    this.tryAgainButton.style.borderRadius = '5px';
    this.tryAgainButton.style.fontSize = '16px';
    this.tryAgainButton.style.cursor = 'pointer';

    // Data usage note
    const dataUsageNote = document.createElement('p');
    dataUsageNote.textContent = '*Your data will be used exclusively for this game.';
    dataUsageNote.style.color = '#9AF11C';
    dataUsageNote.style.fontSize = '12px';
    dataUsageNote.style.marginTop = '10px';

    // Message display
    this.messageDisplay = document.createElement('p');
    this.messageDisplay.style.marginTop = '20px';
    this.messageDisplay.style.color = '#9AF11C'; // Set font color

    // Append elements to modal content
    this.modalContent.appendChild(heading);
    this.modalContent.appendChild(instructions);
    this.modalContent.appendChild(warning);
    this.modalContent.appendChild(nameLabel);
    this.modalContent.appendChild(this.nameInput);
    this.modalContent.appendChild(emailLabel);
    this.modalContent.appendChild(this.emailInput);
    this.modalContent.appendChild(this.modalSubmitButton);
    this.modalContent.appendChild(this.tryAgainButton);
    this.modalContent.appendChild(dataUsageNote);
    this.modalContent.appendChild(this.messageDisplay);

    // Append modal content to overlay
    this.modalOverlay.appendChild(this.modalContent);

    // Append modal overlay to body
    document.body.appendChild(this.modalOverlay);

    // Bind the submit button click event
    this.modalSubmitButton.addEventListener('click', this.onModalSubmit.bind(this));

    // Bind the try again button click event (emit 'start')
    this.tryAgainButton.addEventListener('click', this.onTryAgainClick.bind(this));
  }

  // Event handler for the modal submit button click
  async onModalSubmit() {
    const playerName = this.nameInput.value.trim() || 'Anonymous';
    let email = this.emailInput.value.trim();

    // Validate email if provided
    if (email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.messageDisplay.textContent = 'Invalid email address format.';
        // Keep font color consistent
        return;
      }
    }

    try {
      // Prepare the data to be sent
      const data = {
        name: playerName,
        level: this.level,
        score: this.highScore,
        version: 2
      };

      // Include the email if provided
      if (email !== '') {
        data.email = email;
      }

      // POST the high score to the API
      const response = await fetch(
        'https://si-game-highscores-func.azurewebsites.net/api/SaveHighScore',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        this.messageDisplay.textContent = 'High score submitted successfully!';
        // Deactivate all inputs and buttons after sending
        this.nameInput.disabled = true;
        this.emailInput.disabled = true;
        this.modalSubmitButton.disabled = true;
        this.tryAgainButton.disabled = true;

        // Change cursor style to not-allowed
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

        // Emit 'highscore' event after successful submission
        this.events.emit('highscore');
      } else {
        this.messageDisplay.textContent = 'Failed to submit high score. Try again!';
      }
    } catch (error) {
      console.error('Error submitting high score:', error);
      this.messageDisplay.textContent = 'An error occurred while submitting the high score.';
    }
  }

  // Event handler for the try again button click (emit 'start')
  onTryAgainClick() {
    console.log('Try Again button clicked');
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

    this.modalOverlay.style.display = 'block';
  }

  hideModal() {
    this.modalOverlay.style.display = 'none';
  }

  // Bind event listeners when the menu is active
  bind() {
    // Show the modal when the LostMenu is bound
    this.showModal();
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Hide the modal when the LostMenu is unbound
    this.hideModal();
  }

  setGameValues(score, level) {
    this.highScore = score;
    this.level = level;
  }

  render() {
    // No additional rendering needed; the canvas shows the space background
  }

  // Clean up the modal when no longer needed
  destroy() {
    this.modalOverlay.remove();
  }
}

