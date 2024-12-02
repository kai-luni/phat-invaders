import GameObject from './GameObject.js';
import MissileSanta from './MissileSanta.js';

/**
 * Class representing the player in the game.
 * @extends GameObject
 */
export default class Player extends GameObject {
  /**
   * Constructs a Player object.
   * @param {Object} params - Player initialization parameters.
   * @param {number} params.x - Horizontal position of the player.
   * @param {number} params.y - Vertical position of the player.
   * @param {number} params.width - Width of the player.
   * @param {number} params.height - Height of the player.
   * @param {HTMLImageElement} params.texture - Image texture for the player.
   * @param {Assets} params.assets - Game assets for sounds and resources.
   * @param {number} [params.velocity=300] - Movement speed of the player (units per second).
   */
  constructor({ x, y, width, height, texture, assets, velocity = 300 }) {
    super({ x, y, width, height });

    /**
     * Movement speed of the player (units per second).
     * @type {number}
     */
    this.velocity = velocity;

    /**
     * Array of missiles fired by the player.
     * @type {MissileSanta[]}
     */
    this.missiles = [];

    /**
     * Image texture of the player.
     * @type {HTMLImageElement}
     */
    this.texture = texture;

    /**
     * Game assets for sounds and resources.
     * @type {Assets}
     */
    this.assets = assets;
  }

  /**
   * Moves the player based on its direction, velocity, and deltaTime.
   * @param {number} deltaTime - The time elapsed since the last frame in seconds.
   */
  move(deltaTime) {
    // Update position based on direction, velocity, and deltaTime
    this.x += this.direction.x * this.velocity * deltaTime;

    // Keep the player within the canvas bounds
    this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.width));

    // Update and render missiles
    this.missiles = this.missiles.filter((missile) => {
      missile.move(deltaTime);
      missile.render();

      // Keep the missile if it's within the canvas bounds
      return missile.y + missile.height >= 0;
    });
  }

  /**
   * Fires a missile from the player's current position.
   */
  fire() {
    const missile = new MissileSanta({
      x: this.x + this.width / 2 , // Center the missile horizontally
      y: this.y,
      width: 16,
      height: 16,
    });

    this.missiles.push(missile);

    // Play the firing sound without interrupting background music
    this.assets.playFireSound();
  }

  /**
   * Renders the player on the canvas.
   */
  render() {
    // Draw the player
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);

    // Render missiles (they are moved in the move() method)
    this.missiles.forEach((missile) => {
      missile.render();
    });
  }

  /**
   * Resets the player's position and clears missiles.
   */
  reset() {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    this.missiles = [];
  }
}
