import GameObject from './GameObject.js'
import MissileSanta from './MissileSanta.js'

export default class Player extends GameObject {
  constructor (...args) {
    super(...args)

    this.velocity = 10;

    this.missiles = [];

    this.texture = args[0].texture;
    this.assets = args[0].assets
  }

fire() {
  this.missiles.push(new MissileSanta({
    x: this.x + this.width / 2, y: this.y,
    width: 10,
    height: 10,
  }));

  // Play the firing sound without interrupting background music
  // this.assets.playFireSound();
}


  render () {
    // draw the player
    this.canvas.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)


    // if a missile reaches the canvas border, it destroys itself
    this.missiles = this.missiles.filter(missile => missile.y > 0);

    // draw missiles
    this.missiles.forEach(missile => {
      missile.move()
      missile.render()
    })
  }

  reset () {
    this.x = this.initialPosition.x
    this.y = this.initialPosition.y
    this.missiles = []
  }
}
