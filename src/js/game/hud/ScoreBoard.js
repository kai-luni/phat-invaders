import { canvas } from '../Canvas.js'
import Text from './elements/Text.js';

/**
 * Represents the ScoreBoard in the game.
 * 
 * The ScoreBoard displays the player's current score and level on the canvas.
 * It includes methods for resetting, incrementing the score, leveling up, and updating the display.
 */
export default class ScoreBoard {
  /**
   * Initializes the ScoreBoard with default values and positions for the score and level text.
   */
  constructor() {
    this.fontSize = 16; // Font size for the text
    this.score = 0; // Initial score
    this.level = 1; // Initial level

    // Text objects for displaying score and level
    this.scoreText = new Text({
      x: this.fontSize, 
      y: this.fontSize * 1.5, 
      align: 'left'
    });

    this.levelText = new Text({
      x: canvas.width - this.fontSize, 
      y: this.fontSize * 1.5, 
      align: 'right'
    });

    this.update(); // Initialize the text with the current score and level
  }

  /**
   * Resets the ScoreBoard to its initial state.
   * Resets the score and level to zero and updates the display.
   */
  reset() {
    this.score = 0;
    this.level = 0;
    this.update();
  }

  /**
   * Increments the player's score by 1 and updates the display.
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
   * Draws an overlay and displays the current score and level.
   */
  render() {
    // Draw the overlay at the top of the canvas
    canvas.ctx.fillStyle = '#000000dd';
    canvas.ctx.fillRect(0, 0, canvas.width, this.fontSize * 2);

    // Render the score text
    this.scoreText.render();

    // Render the level text
    this.levelText.render();
  }
}

