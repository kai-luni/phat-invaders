import { canvas } from '../Canvas.js'

export default class GameObject {
  /**
   * A GameObject is a position and a size
   * @param {Object} params - GameObject initialisation parameters
   * @param {Integer} params.x - GameObject horizontal position
   * @param {Integer} params.y - GameObject vertical position
   * @param {Integer} params.width - GameObject width
   * @param {Integer} params.height - GameObject height
   */
  constructor ({x = 0, y = 0, width = 50, height = 50}) {
    this.initialPosition = { x, y }

    this.canvas = canvas

    this.x = x - width / 2
    this.y = y - height / 2
    this.width = width
    this.height = height

    this.direction = {x: 0, y: 0}
    this.velocity = 1

    this.dead = false;
  }

  /**
   * Checks if the object is hit by a given missile (rocket).
   * @param {GameObject} rocket - The missile to check collision with.
   * @returns {boolean} - Returns true if the missile hits the enemy.
   */
  hit(rocket) {
    this.dead = (
      rocket.x < this.x + this.width &&
      rocket.x + rocket.width > this.x &&
      rocket.y < this.y + this.height &&
      rocket.y + rocket.height > this.y
    );
    return this.dead;
  }

  /**
   * make the GameObject change its position
   * @param {Object {x: Integer, y: Integer}} direction - positive or negative
   */
  move () {
    this.x += this.direction.x * this.velocity
    this.y += this.direction.y * this.velocity
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
  }

  render () {
    this.canvas.ctx.fillStyle = 'white'
    this.canvas.ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
