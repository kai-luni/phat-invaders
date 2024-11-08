import { initCanvas } from './Canvas.js'
import Assets from './Assets.js'
import Enemy  from './gameObjects/Enemy.js'
import Player from './gameObjects/Player.js'
import PauseMenu from './hud/PauseMenu.js';
import LoadingMenu from './hud/LoadingMenu.js';
import WelcomeMenu from './hud/WelcomeMenu.js';
import LostMenu from './hud/LostMenu.js';
import WonMenu from './hud/WonMenu.js';
import ScoreBoard from './hud/ScoreBoard.js';


const KEYBOARD = {
  LEFT: 37,
  RIGHT: 39,
  FIRE: 32, // space
  PAUSE: 27, // escape
  FULLSCREEN: 70 // "F"
}

const STATE = {
  LOADING: 0,
  WELCOME: 1,
  LOST: 2,
  WON: 3,
  PAUSED: 4,
  PLAYING: 5
}

export default class Game {
  /**
   * Space invaders game constructor
   * @param {Object} params - initialisation parameters
   * @param {String} params.el - css selector for the canvas element
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor({ nbEnemies = 3 }) {
    var el = '#game'
    this.canvas = initCanvas({ el })
    this.nbEnemies = nbEnemies
    this.initialNbEnemies = nbEnemies

    // assets
    this.assets = new Assets()

    // game state
    this.gameState = STATE.LOADING

    // player
    this.player = this.generatePlayer()

    // enemies
    this.enemies = this.generateEnemies(this.nbEnemies)
    this.enemiesChangeDirection = false

    // menus
    this.loadingMenu = new LoadingMenu()
    this.welcomeMenu = new WelcomeMenu()
    this.lostMenu = new LostMenu()
    this.wonMenu = new WonMenu()
    this.pauseMenu = new PauseMenu()

    // scoreBoard
    this.scoreBoard = new ScoreBoard()

    // game music
    this.music = this.assets.music
    this.music.loop = true

    this.looseSound = this.assets.looseSound

    this.init()
  }

  init () {
    this.gameState = STATE.LOADING
    this.assets.load()
      .then(() => {
        this.gameState = STATE.WELCOME
        this.initListeners()
        this.update()
      })
      .catch(err => {
        this.gameState = STATE.LOADING
        console.error(err)
      })
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      // Do nothing if not playing
      if (this.gameState < STATE.PLAYING) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      if(e.keyCode === KEYBOARD.RIGHT || e.keyCode === KEYBOARD.LEFT) {
        this.player.direction.x = 0
        // move right
        console.log('Player right edge:', this.player.x + this.player.width, 'Canvas width:', this.canvas.width);
        if (e.keyCode === KEYBOARD.RIGHT && this.player.x + this.player.width < this.canvas.width) this.player.direction.x = 1
        // move left
        if (e.keyCode === KEYBOARD.LEFT && this.player.x > 0) this.player.direction.x = -1
      }
    })

    window.addEventListener('keyup', (e) => {
      // do nothing if not paused or playing
      if (this.gameState < STATE.PAUSED) return

      // pause
      if (e.keyCode === KEYBOARD.PAUSE) this.gameState != STATE.PAUSED ? this.pause() : this.resume()

      // Do nothing if game is not playing
      if (this.gameState < STATE.PLAYING) return

      // prevent page to move on key press
      if(Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault()

      // stop moving
      if ((e.keyCode === KEYBOARD.RIGHT  || e.keyCode === KEYBOARD.LEFT) && this.player.direction.x) this.player.direction.x = 0
      // fire
      if (e.keyCode === KEYBOARD.FIRE) this.player.fire()
      // fullscreen
      if (e.keyCode === KEYBOARD.FULLSCREEN) this.canvas.fullscreen()
    })

    this.welcomeMenu.events.on('start', () => {
      if (this.gameState === STATE.WELCOME) this.resume()
    })

    this.lostMenu.events.on('start', () => {
      if (this.gameState === STATE.LOST) this.resume()
    })

    this.wonMenu.events.on('start', () => {
      if (this.gameState === STATE.WON) this.resume()
    })

    this.pauseMenu.events.on('resume', () => {
      if (this.gameState === STATE.PAUSED) this.resume()
    })
  }

  generatePlayer () {
    return new Player({
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      width: 50,
      height: 50,
      texture: this.assets.playerTexture,
      assets: this.assets
    })
  }

  /**
   * generates a given number of enemies
   * @param {Integer} nb - the number of enemies to be created
   */
  generateEnemies(nb) {
    let enemies = []
    for (let i = 0; i < nb; i++) {
      for (let j = 0; j < 6; j++) {
        enemies.push(new Enemy({
          x: (this.canvas.width / 8) + (i * 54),
          y: 64 + (j * 54), // generates a random number beween 50 & 250
          width: 50,
          height: 50,
          texture: this.assets.enemyTexture,
          assets: this.assets
        }))
      }
    }
    return enemies
  }

  renderGame () {
    // first clear the canvas
    this.canvas.clear()

    // then render something
    switch (this.gameState) {
      case (STATE.LOADING):
        this.loadingOverlay.render()
        break
      case (STATE.WELCOME):
        this.welcomeMenu.render()
        break
      case (STATE.PAUSED):
        this.pauseMenu.render()
        break
      case (STATE.LOST):
        this.lostMenu.render()
        break
      case (STATE.WON):
        this.wonMenu.render()
        break
      case (STATE.PLAYING):
        this.scoreBoard.render()
        this.player.render()
        this.enemies.forEach(enemy => {
          enemy.render()
        })
        break
    }
  }

  updateGame () {
    if (this.gameState === STATE.PLAYING) {
      this.player.move()
      this.updateEnemies()
      this.checkCollisions()
    }
  }

  updateEnemies () {
    let changeDirection = false
    this.enemies.forEach(enemy => {
      enemy.move(this.enemiesChangeDirection)
      // if any enemy reaches the edges of the game container, change enemies direction
      if (enemy.x < 0 || enemy.x + enemy.width > this.canvas.width) changeDirection = true
    })

    // next update loop, are they gonna change direction ?
    this.enemiesChangeDirection = changeDirection
  }

  update() {
    this.updateGame()
    this.renderGame()
    requestAnimationFrame(this.update.bind(this))
  }

  checkCollisions () {
    let enemiesHit = []
    let missilesHit = []

    this.enemies.forEach(enemy => {
      this.player.missiles.forEach(missile => {
        // if a player missile reaches an enemy, they both disappear
        if (missile.x > enemy.x && missile.x < enemy.x + enemy.width && missile.y > enemy.y && missile.y < enemy.y + enemy.height) {
          enemy.die()
          this.scoreBoard.incrementScore()
          enemiesHit.push(enemy)
          missilesHit.push(missile)
        }
      })

      // if any enemy reaches the player y position, the game is lost
      if (enemy.y + enemy.height > this.player.y) this.loose()
    })

    this.enemies = this.enemies.filter(enemy => !enemiesHit.includes(enemy))
    this.player.missiles = this.player.missiles.filter(missile => !missilesHit.includes(missile))

    // if no enemies left, the game is won
    if (!this.enemies.length) this.win()
  }

  pause() {
    this.gameState = STATE.PAUSED
    //this.music.pause()
  }

  resume () {
    this.gameState = STATE.PLAYING;
    this.assets.playBackgroundMusic();
  }

  reset() {
    this.player = this.generatePlayer()
    this.enemies = this.generateEnemies(this.nbEnemies)
    this.music.pause()
    this.music.currentTime = 0
  }

  loose () {
    this.gameState = STATE.LOST
    this.looseSound.play()
    this.scoreBoard.reset()
    this.nbEnemies = this.initialNbEnemies
    this.reset()
  }

  win () {
    this.gameState = STATE.WON
    this.scoreBoard.levelup()
    this.nbEnemies += 1
    this.reset()
  }
}
