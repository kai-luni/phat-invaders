import { canvas } from '../Canvas.js';
import Text from './elements/Text.js';
import Events from '../Events.js';

/**
 * Represents the ScoreBoard in the game.
 * 
 * The ScoreBoard displays the player's current score, level, and a sound toggle button.
 */
export default class ScoreBoard {
  /**
   * Initializes the ScoreBoard with references to assets and default values.
   * @param {Object} assets - The assets object containing textures and sounds.
   */
  constructor(assets) {
    this.assets = assets;
    this.fontSize = 16; // Font size for the text
    this.score = 0; // Initial score
    this.level = 1; // Initial level
    this.soundOn = true; // Initial sound state

    // Text objects for displaying score and level
    // We'll position them dynamically in the render() method.
    this.scoreText = new Text({ align: 'right' });
    this.levelText = new Text({ align: 'left' });

    // Position and size for the sound toggle button
    this.soundButton = {
      x: canvas.width - 120, // Align to the right
      y: 5,
      width: 100,
      height: this.fontSize * 2,
      color: '#9AF11C',
      textColor: '#000000',
    };

    this.events = new Events();

    this.update(); // Initialize the text with the current score and level
    this.initListeners(); // Add event listeners for button interactions
  }

  /**
   * Adds event listeners for the sound button.
   */
  initListeners() {
    canvas.el.addEventListener('click', (e) => {
      const { x, y } = this.getMousePosition(e);

      // Check if the click is within the sound button bounds
      if (
        x > this.soundButton.x &&
        x < this.soundButton.x + this.soundButton.width &&
        y > this.soundButton.y &&
        y < this.soundButton.y + this.soundButton.height
      ) {
        this.toggleSound(); // Toggle the sound state
      }
    });
  }

  /**
   * Toggles the sound state and emits an event.
   */
  toggleSound() {
    this.soundOn = !this.soundOn;
    const eventName = this.soundOn ? 'soundOn' : 'soundOff';
    this.events.emit(eventName); // Emit event for sound state change
  }

  /**
   * Returns mouse coordinates relative to the canvas.
   */
  getMousePosition(event) {
    const rect = canvas.el.getBoundingClientRect();
    const scaleX = canvas.el.width / rect.width;
    const scaleY = canvas.el.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  /**
   * Resets the ScoreBoard to its initial state.
   */
  reset() {
    this.score = 0;
    this.level = 1;
    this.update();
  }

  /**
   * Increments the player's score by the reward amount and updates the display.
   * @param {number} reward - The reward to add to the score.
   */
  incrementScore(reward) {
    this.score += reward;
    this.update();
  }

  /**
   * Increments the player's level by 1 and updates the display.
   */
  levelup() {
    this.level++;
    this.update();
  }

  /**
   * Updates the text for the score and level to reflect the current values.
   */
  update() {
    this.scoreText.updateText(`Score: ${this.score}`);
    this.levelText.updateText(`Level: ${this.level}`);
  }

  /**
   * Renders the ScoreBoard on the canvas.
   * Displays the headline image, the score & level in the middle, and the sound button on the right.
   */
  render() {
    // Draw the overlay at the top of the canvas
    canvas.ctx.fillStyle = '#000000dd';
    // Make the top overlay a bit taller to accommodate image and text
    const overlayHeight = this.fontSize * 3;
    canvas.ctx.fillRect(0, 0, canvas.width, overlayHeight);

    // Draw the headline image in the upper-left corner with specific dimensions
    const headlineWidth = 297; // Width of the headline texture
    const headlineHeight = 62; // Height of the headline texture
    canvas.ctx.drawImage(this.assets.headlineTexture, 10, 5, headlineWidth, headlineHeight);

    // Render score and level in the middle of the top edge
    // Let's place them in a line:
    // Score on the left side of center, Level on the right side of center
    const centerX = canvas.width / 2;
    const textY = this.fontSize * 1.8;

    // Score aligned right, placed slightly left of center
    this.scoreText.x = centerX - 20;
    this.scoreText.y = textY;
    // Level aligned left, placed slightly right of center
    this.levelText.x = centerX + 20;
    this.levelText.y = textY;

    // Render the score and level text
    this.scoreText.render();
    this.levelText.render();

    // Render the sound button
    this.renderSoundButton();
  }

  /**
   * Renders the sound toggle button on the canvas.
   */
  renderSoundButton() {
    // Draw the button rectangle
    canvas.ctx.fillStyle = this.soundButton.color;
    canvas.ctx.fillRect(
      this.soundButton.x,
      this.soundButton.y,
      this.soundButton.width,
      this.soundButton.height
    );

    // Draw the button text
    canvas.ctx.font = `bold ${this.fontSize}px Arial`;
    canvas.ctx.fillStyle = this.soundButton.textColor;
    canvas.ctx.textAlign = 'center';
    canvas.ctx.fillText(
      this.soundOn ? 'Sound On' : 'Sound Off',
      this.soundButton.x + this.soundButton.width / 2,
      this.soundButton.y + this.soundButton.height / 2 + this.fontSize / 3
    );
  }
}
