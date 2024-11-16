import GameObject from './GameObject.js'

export default class Block extends GameObject {

  constructor (...args) {
    super(...args)

    // block doesnt move
    this.velocity = 0

    this.texture = args[0].texture
    this.assets = args[0].assets
  }

  die () {
    this.assets.playKillSound();
  }

  move () {
    // do nothing :)
  }

  render () {
    // draw the enemy
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)
  }
}
