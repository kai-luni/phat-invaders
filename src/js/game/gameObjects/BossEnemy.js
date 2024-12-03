// BossEnemy.js
import GameObject from './GameObject.js';
import MissileGrinch from './MissileGrinch.js';

/**
 * Class representing a boss enemy in the game.
 * @extends Enemy
 */
export default class BossEnemy extends GameObject {
  /**
   * Constructs a BossEnemy object.
   * @param {Object} params - BossEnemy initialization parameters.
   * @param {number} params.x - Horizontal position of the boss enemy.
   * @param {number} params.y - Vertical position of the boss enemy.
   * @param {HTMLImageElement} params.texture - Image texture for the boss enemy.
   * @param {Assets} params.assets - Assets containing game resources.
   * @param {number} [params.column=0] - Column of the boss enemy.
   * @param {number} [params.row=0] - Row of the boss enemy.
   * @param {number} [params.velocity=1] - Movement speed of the boss enemy.
   * @param {number} [params.health=20] - Health points of the boss enemy.
   */
  constructor({ x, y, texture, assets, canvas, width = 200, height = 200, velocity = 2, health = 20 }) {
    super({ x, y, width, height });

    this.assets = assets;
    this.texture = texture;
    this.velocity = velocity;
    this.canvas = canvas;

    this.direction = { x: 1, y: 0 }; // Enemies move horizontally by default
    this.missiles = [];

    /**
     * Health points of the boss enemy.
     * @type {number}
     */
    this.health = health; // Takes 20 hits to defeat

    /**
     * Indicates if the boss enemy is dead.
     * @type {boolean}
     */
    this.dead = false;
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
    if (Math.random() < 10 / fireRate) {
      const missile = new MissileGrinch({
        x: this.x + this.width / 2,
        y: this.y + this.height,
        width: 40,
        height: 40,
        directionY: 1,      // Enemy missiles move downward
        velocity: 8,
        assets: this.assets, // Pass assets if missile needs sounds or textures
      });
  
      this.missiles.push(missile);
    }
  }

  /**
   * Checks if the boss enemy is hit by a given missile (rocket).
   * Decreases health if hit.
   * @param {GameObject} rocket - The missile to check collision with.
   * @returns {boolean} - Returns true if the missile hits the boss enemy.
   */
  hit(rocket) {
    const isHit = (
      rocket.x < this.x + this.width &&
      rocket.x + rocket.width > this.x &&
      rocket.y < this.y + this.height &&
      rocket.y + rocket.height > this.y
    );

    if (isHit) {
      this.health -= 1; // Decrease health by 1
      if (this.health <= 0) {
        this.die();
      } else {
        //this.assets.playHitSound(); // Play a hit sound if you have one
      }
    }

    return isHit;
  }

  /**
   * Handles the boss enemy's death.
   * Plays the kill sound effect.
   */
  die() {
    this.dead = true; // Mark as dead
    this.assets.playKillSound(); // Play the kill sound
    // Additional logic for when the boss enemy dies can be added here
  }

  /**
   * Updates the enemy's position.
   * @param {boolean} changeDirection - Indicates whether the enemy should change direction.
   * @param {boolean} goDown - Go down in the direction of Santa.
   */
  move(goDown) {
    // Change direction if boss reaches the left or right edge of the canvas
    if (this.x <= 0) {
        this.direction.x = 1;
    }
    if (this.x + this.width >= this.canvas.width) {
        this.direction.x = -1;
    }
  
    // Move down if required
    if (goDown) {
      this.y += this.height / 5; // Adjust downward movement
    }
  
    // Update position based on direction and velocity
    this.x += this.direction.x * this.velocity;
  }
  

  /**
   * Renders the boss enemy and its missiles on the canvas.
   * Updates missile positions and removes off-screen missiles.
   */
  render() {
    // Optionally, you can display the boss's health bar above it
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);

    // Draw health bar
    this.drawHealthBar();

    // Update and render missiles
    this.missiles = this.missiles.filter((missile) => {
      missile.move();
      missile.render();
      return missile.y <= this.canvas.height;
    });
  }

  /**
   * Draws the health bar above the boss enemy.
   */
  drawHealthBar() {
    const ctx = this.canvas.ctx;
    const barWidth = this.width;
    const barHeight = 10;
    const x = this.x;
    const y = this.y - barHeight - 5; // Position above the boss

    // Background bar
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Health proportion
    const maxHealth = 20; // Assuming max health is 20
    const healthProportion = this.health / maxHealth;

    // Health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, barWidth * healthProportion, barHeight);

    // Optional: Draw border around health bar
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}
