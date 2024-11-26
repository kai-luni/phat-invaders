import GameObject from './GameObject.js'

/**
 * Represents a Missile object in the game.
 * A missile has a position, size, direction, and velocity.
 * 
 * @extends GameObject
 */
export default class MissileSanta extends GameObject {
  /**
   * Constructs a Missile object.
   * @param {Object} params - Missile initialization parameters.
   * @param {Integer} params.x - Horizontal position of the missile.
   * @param {Integer} params.y - Vertical position of the missile.
   * @param {Integer} params.width - Width of the missile.
   * @param {Integer} params.height - Height of the missile.
   * @param {Integer} [params.directionY=-1] - Vertical direction of the missile (-1 for up, 1 for down).
   * @param {Integer} [params.velocity=5] - Speed of the missile.
   */
  constructor({ x, y, width, height, directionY = -1, velocity = 5 }) {
    super({ x, y, width, height });

    this.direction = { x: 0, y: directionY }; // Default to moving up
    this.velocity = velocity; // Default speed of the missile
  }

  /**
   * Updates the missile's position based on its direction and velocity.
   */
  move() {
    this.x += this.direction.x * this.velocity;
    this.y += this.direction.y * this.velocity;
  }
}

