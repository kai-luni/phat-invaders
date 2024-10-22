import GameObject from './GameObject.js'

export default class Enemy extends GameObject {

  constructor (...args) {
    super(...args)

    this.direction = { x: 1, y: 1 }

    this.texture = args[0].texture
    this.assets = args[0].assets
  }

  die () {
    this.assets.playKillSound();
  }

  move (changeDirection) {
    // change direction
    if (changeDirection) this.direction.x *= -1
    this.x += this.direction.x * this.velocity
    //this.y += this.direction.y * this.velocity
  }

  render () {
    // draw the enemy
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)
  }
}
