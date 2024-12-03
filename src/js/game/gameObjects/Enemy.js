import GameObject from './GameObject.js';
import MissileGrinch from './MissileGrinch.js';

/**
 * Class representing an enemy in the game.
 * @extends GameObject
 */
export default class Enemy extends GameObject {
  /**
   * Constructs an Enemy object.
   * @param {Object} params - Enemy initialization parameters.
   * @param {number} params.x - Horizontal position of the enemy.
   * @param {number} params.y - Vertical position of the enemy.
   * @param {number} params.width - Width of the enemy.
   * @param {number} params.height - Height of the enemy.
   * @param {HTMLImageElement} params.texture - Image texture for the enemy.
   * @param {Assets} params.assets - Assets containing game resources.
   * @param {number} params.column - Column of monster
   * @param {number} params.row - Row of monster
   * @param {number} [params.velocity=1] - Movement speed of the enemy.
   * @param {number} [params.type=0] - There are enemies and items and each has a certain id
   */
  constructor({ x, y, width, height, texture, assets, column, row, velocity = 1, type = 0 }) {
    super({ x, y, width, height });

    this.direction = { x: 1, y: 0 }; // Enemies move horizontally by default
    this.texture = texture;
    this.type = type;
    this.assets = assets;
    this.velocity = velocity;
    this.missiles = [];
    this.column = column;
    this.row = row;

    this.lastDirectionChange = Date.now();
  }

  /**
   * Handles the enemy's death.
   * Plays the kill sound effect.
   */
  die() {
    this.assets.playKillSound();
    // Additional logic for when the enemy dies can be added here
  }

  /**
   * Updates the enemy's position.
   * @param {boolean} changeDirection - Indicates whether the enemy should change direction.
   * @param {boolean} goDown - Go down in the direction of Santa.
   */
  move(goDown) {
    // Track time since the last direction change
    if (!this.lastDirectionChange) {
      this.lastDirectionChange = Date.now();
    }

    const currentTime = Date.now();
    const timeElapsed = currentTime - this.lastDirectionChange;

    // Change direction if more than 2 seconds have passed
    if (timeElapsed >= 4000) {
      this.direction.x *= -1; // Reverse horizontal direction
      this.lastDirectionChange = currentTime; // Reset the timer
    }

    if (goDown) {
      this.y += this.height;
    }

    // Update position based on direction and velocity
    this.x += this.direction.x * this.velocity;
  }


  /**
   * Fires a missile from the enemy's current position.
   * The missile moves downward towards the player.
   */
  fire(fireRate) {
    // type larger than 0 is not shooting (item)
    if (this.type > 0) {
      return;
    }
    if (Math.random() < 1 / fireRate) {
      const missile = new MissileGrinch({
        x: this.x + this.width / 2,
        y: this.y + this.height,
        width: 18,
        height: 18,
        directionY: 1,      // Enemy missiles move downward
        velocity: 8,
        assets: this.assets, // Pass assets if missile needs sounds or textures
      });
  
      this.missiles.push(missile);
    }
  }

  /**
   * Renders the enemy and its missiles on the canvas.
   * Updates missile positions and removes off-screen missiles.
   */
  render() {
    // Draw the enemy image
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);

    // Update and render each missile
    this.missiles = this.missiles.filter((missile) => {
      missile.move();
      missile.render();

      // Keep the missile if it's within the canvas bounds
      return missile.y <= this.canvas.height;
    });
  }
}
