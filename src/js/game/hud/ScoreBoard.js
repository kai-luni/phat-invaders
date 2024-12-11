import { canvas } from '../Canvas.js';
import Text from './elements/Text.js';
import Events from '../Events.js';

/**
 * Represents the ScoreBoard in the game.
 * 
 * The ScoreBoard displays the player's current score, level, and a sound toggle icon.
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
    this.scoreText = new Text({ align: 'right' });
    this.levelText = new Text({ align: 'left' });

    // Sound icon dimensions and position
    this.soundIcon = {
      x: canvas.width - 50, // Position near the right edge
      y: 5, // Top position
      width: 40,
      height: 40,
    };

    this.events = new Events();

    this.update(); // Initialize the text with the current score and level
    this.initListeners(); // Add event listeners for sound icon interactions
  }

  /**
   * Adds event listeners for the sound icon.
   */
  initListeners() {
    canvas.el.addEventListener('click', (e) => {
      const { x, y } = this.getMousePosition(e);

      // Check if the click is within the sound icon bounds
      if (
        x > this.soundIcon.x &&
        x < this.soundIcon.x + this.soundIcon.width &&
        y > this.soundIcon.y &&
        y < this.soundIcon.y + this.soundIcon.height
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
   * Displays the headline image, the score & level in the middle, and the sound icon on the right.
   */
  render() {
    // Draw the overlay at the top of the canvas
    canvas.ctx.fillStyle = '#000000dd';
    const overlayHeight = this.fontSize * 3;
    canvas.ctx.fillRect(0, 0, canvas.width, overlayHeight);

    // Draw the headline image in the upper-left corner with specific dimensions
    const headlineWidth = 297; // Width of the headline texture
    const headlineHeight = 62; // Height of the headline texture
    canvas.ctx.drawImage(this.assets.headlineTexture, 10, 5, headlineWidth, headlineHeight);

    // Render score and level in the middle of the top edge
    const centerX = canvas.width / 2;
    const textY = this.fontSize * 1.8;

    this.scoreText.fontSize = 25;
    this.levelText.fontSize = this.fontSize;

    this.scoreText.x = centerX - 20;
    this.scoreText.y = textY;

    this.levelText.x = centerX + 20;
    this.levelText.y = textY;

    this.scoreText.render();
    this.levelText.render();

    // Render the sound icon
    this.renderSoundIcon();
  }

  /**
   * Renders the sound icon on the canvas.
   */
  renderSoundIcon() {
    const texture = this.soundOn
      ? this.assets.soundOffTexture
      : this.assets.soundOnTexture;

    canvas.ctx.drawImage(
      texture,
      this.soundIcon.x,
      this.soundIcon.y,
      this.soundIcon.width,
      this.soundIcon.height
    );
  }
}
