import Assets from '../Assets.js';
import GameObject from './GameObject.js';


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
   * @param {Integer} [params.width=20] - Width of the missile.
   * @param {Integer} [params.height=20] - Height of the missile.
   * @param {Integer} [params.directionX=0] - Horizontal direction of missile
   * @param {Integer} [params.directionY=-1] - Vertical direction of the missile (-1 for up, 1 for down).
   * @param {Integer} [params.velocity=5] - Speed of the missile.
   */
  constructor({ x, y, width = 18, height = 18, directionX = 0, directionY = -1, velocity = 5 }) {
    super({ x, y, width, height });

    this.direction = { x: directionX, y: directionY }; // Default to moving up
    this.velocity = velocity; // Default speed of the missile

    this.assets = new Assets();
    this.texture = this.assets.santaRocketTexture;
  }

  /**
   * Updates the missile's position based on its direction and velocity.
   */
  move() {
    this.x += this.direction.x * this.velocity;
    this.y += this.direction.y * this.velocity;
  }

    /**
   * Render the missile with a graphic.
   */
    render() {
      this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
    }
}
