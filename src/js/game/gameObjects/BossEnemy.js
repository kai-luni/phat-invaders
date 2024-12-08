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
   * @param {HTMLImageElement} [params.textureShocked] - Alternative shocked texture for the boss.
   * @param {number} [params.velocity=2] - Movement speed of the boss enemy.
   * @param {number} [params.health=20] - Health points of the boss enemy.
   */
  constructor({ x, y, texture, textureShocked, assets, canvas, width = 200, height = 200, velocity = 2, health = 20 }) {
    super({ x, y, width, height });

    this.assets = assets;
    this.textureNormal = texture;        // Store the normal texture
    this.textureShocked = textureShocked; // Store the shocked texture
    this.texture = this.textureNormal;   // Current texture starts normal
    this.velocity = velocity;
    this.canvas = canvas;

    this.direction = { x: 1, y: 0 };
    this.missiles = [];

    this.health = health;
    this.dead = false;

    // Timing for shocked state
    this.shocked = false;
    this.shockedDuration = 300; // milliseconds the boss stays shocked after hit
    this.shockedUntil = 0;
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
    if (Math.random() < 12 / fireRate) {
      const missile = new MissileGrinch({
        x: this.x + this.width / 2,
        y: this.y + this.height,
        width: 40,
        height: 40,
        directionY: 1,      // Enemy missiles move downward
        velocity: 8,
        assets: this.assets,
      });

      this.missiles.push(missile);
    }
  }

  /**
   * Checks if the boss enemy is hit by a given missile (rocket).
   * Decreases health if hit and triggers shocked state.
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
      // Trigger shocked state
      this.shocked = true;
      this.shockedUntil = Date.now() + this.shockedDuration;
      this.texture = this.textureShocked;

      if (this.health <= 0) {
        this.die();
      } else {
        //this.assets.playHitSound();
      }
    }

    return isHit;
  }

  /**
   * Handles the boss enemy's death.
   */
  die() {
    this.dead = true;
    this.assets.playKillSound();
  }

  /**
   * Updates the enemy's position.
   * @param {boolean} goDown - Move down in the direction of Santa.
   */
  move(goDown) {
    // Change direction if boss reaches the left or right edge of the canvas
    if (this.x <= 0) {
      this.direction.x = 1;
    }
    if (this.x + this.width >= this.canvas.width) {
      this.direction.x = -1;
    }

    if (goDown) {
      this.y += this.height / 5;
    }

    this.x += this.direction.x * this.velocity;
  }

  /**
   * Renders the boss enemy and its missiles on the canvas.
   */
  render() {
    // Check if shocked state should end
    if (this.shocked && Date.now() > this.shockedUntil) {
      this.shocked = false;
      this.texture = this.textureNormal;
    }

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

    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
  }
}
