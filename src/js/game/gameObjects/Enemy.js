import GameObject from './GameObject.js'
import MissileGrinch from './MissileGrinch.js'

export default class Enemy extends GameObject {

  constructor (...args) {
    super(...args)

    this.direction = { x: 1, y: 1 }

    this.texture = args[0].texture;
    this.assets = args[0].assets;

    this.missiles = [];
  }

  die () {
    this.assets.playKillSound();
  }

  move (changeDirection) {
    // change direction
    if (changeDirection) this.direction.x *= -1;
    this.x += this.direction.x * this.velocity;
    //this.y += this.direction.y * this.velocity

    // 1 in 200 chance to fire a missile
    if (Math.random() < 1 / 200) {
      this.fire();
    }
  }

  fire() {
    this.missiles.push(new MissileGrinch({
      x: this.x + this.width / 2, y: this.y,
      width: 10,
      height: 10,
    }));
  }

  render () {
    // draw the enemy
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);

    // if a missile reaches the canvas border, it destroys itself
    this.missiles = this.missiles.filter(missile => missile.y < 1000);

    // draw missiles
    this.missiles.forEach(missile => {
      missile.move()
      missile.render()
    })
  }
}
