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
   * @param {number} [params.fireRate=500] - Minimum time between shots in milliseconds.
   */
  constructor({ x, y, width, height, texture, assets, velocity = 300, fireRate = 400 }) {
    super({ x, y, width, height });

    this.velocity = velocity;
    this.missiles = [];
    this.texture = texture;
    this.assets = assets;

    this.fireRate = fireRate;
    this.defaultFireRate = fireRate; // Store the default fire rate
    this.lastFireTime = 0;
  }

  /**
   * Moves the player based on its direction, velocity, and deltaTime.
   * @param {number} deltaTime - The time elapsed since the last frame in seconds.
   */
  move(deltaTime) {
    this.x += this.direction.x * this.velocity * deltaTime;
    this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.width));

    this.missiles = this.missiles.filter((missile) => {
      missile.move(deltaTime);
      missile.render();
      return missile.y + missile.height >= 0;
    });
  }

  /**
   * Fires a missile from the player's current position with rate limiting.
   */
  fire() {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime >= this.fireRate) {
      const missile = new MissileSanta({
        x: this.x + this.width / 2,
        y: this.y,
      });

      this.missiles.push(missile);
      this.assets.playFireSound();
      this.lastFireTime = currentTime; // Update the last fire time
    }
  }

  /**
   * Temporarily enables faster shooting by reducing the fire rate to 100ms for 3 seconds.
   */
  shootFast() {
    this.fireRate = 100; // Set fire rate to 100ms

    // Revert to default fire rate after 3 seconds
    setTimeout(() => {
      this.fireRate = this.defaultFireRate;
    }, 10000);
  }

  /**
   * Renders the player on the canvas.
   */
  render() {
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
    this.missiles.forEach((missile) => missile.render());
  }

  /**
   * Resets the player's position and clears missiles.
   */
  reset() {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    this.missiles = [];
    this.fireRate = this.defaultFireRate; // Reset fire rate to default
  }
}
