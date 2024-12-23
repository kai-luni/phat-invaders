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
   * @param {number} params.column - Column of monster.
   * @param {number} params.row - Row of monster.
   * @param {number} [params.velocity=1] - Movement speed of the enemy.
   * @param {number} [params.type=0] - There are enemies and items, each with a certain ID.
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

    this.anchorX = x; // Store the original x coordinate as the anchor

    this.dead = false;
  }

  /**
   * Handles the enemy's death.
   * Plays the kill sound effect.
   */
  die() {
    this.dead = true;
    if (this.type > 0) {
      this.assets.playBoostSound();
    } else {
      this.assets.playKillSound();
    }
  }

  /**
   * Checks if the object is hit by a given missile (rocket).
   * @param {GameObject} rocket - The missile to check collision with.
   * @returns {boolean} - Returns true if the missile hits the enemy.
   */
  hit(rocket) {
    let hit = (
      rocket.x < this.x + this.width &&
      rocket.x + rocket.width > this.x &&
      rocket.y < this.y + this.height &&
      rocket.y + rocket.height > this.y
    );

    if (hit){
      this.die();
    }    

    return hit;
  }

  getDistanceFromAnchor() {
    return  this.x - this.anchorX;
  }

  move(goDown, direction) {
    this.direction.x = direction;

    if (goDown) {
      this.y += this.height;
    }

    // Update position based on direction and velocity
    this.x += this.direction.x * this.velocity;
  }


  /**
   * Fires a missile from the enemy's current position.
   * The missile moves downward towards the player.
   * @param {number} fireRate - Determines the frequency of firing.
   */
  fire(fireRate) {
    // Items (type > 0) do not shoot
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
