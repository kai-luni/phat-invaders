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
   * Initializes the ScoreBoard with default values and positions for the score, level, and sound button.
   */
  constructor() {
    this.fontSize = 16; // Font size for the text
    this.score = 0; // Initial score
    this.level = 1; // Initial level
    this.soundOn = true; // Initial sound state

    // Text objects for displaying score and level
    this.scoreText = new Text({
      x: this.fontSize,
      y: this.fontSize,
      align: 'left',
    });

    this.levelText = new Text({
      x: this.fontSize,
      y: this.fontSize * 2.5,
      align: 'left',
    });

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
   * Emits an event with the given name.
   * @param {string} eventName - The name of the event to emit.
   */
  emit(eventName) {
    console.log(`Event emitted: ${eventName}`);
  }

  /**
   * Scales mouse coordinates from screen space to canvas logical space.
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
   */
  render() {
    // Draw the overlay at the top of the canvas
    canvas.ctx.fillStyle = '#000000dd';
    canvas.ctx.fillRect(0, 0, canvas.width, this.fontSize * 3);

    // Render the score text
    this.scoreText.render();

    // Render the level text
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
