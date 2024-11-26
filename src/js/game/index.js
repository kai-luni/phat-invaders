import { initCanvas } from './Canvas.js';
import Assets from './Assets.js';
import Block from './gameObjects/Block.js';
import Enemy from './gameObjects/Enemy.js';
import Player from './gameObjects/Player.js';
import PauseMenu from './hud/PauseMenu.js';
import LoadingMenu from './hud/LoadingMenu.js';
import WelcomeMenu from './hud/WelcomeMenu.js';
import LostMenu from './hud/LostMenu.js';
import WonMenu from './hud/WonMenu.js'; // Corrected import
import ScoreBoard from './hud/ScoreBoard.js';

const KEYBOARD = {
  LEFT: 37,
  RIGHT: 39,
  FIRE: 32, // space
  PAUSE: 27, // escape
  FULLSCREEN: 70, // "F"
};

const STATE = {
  LOADING: 0,
  WELCOME: 1,
  LOST: 2,
  WON: 3,
  PAUSED: 4,
  PLAYING: 5,
};

export default class Game {
  /**
   * Space invaders game constructor
   * @param {Object} params - initialisation parameters
   * @param {String} params.el - css selector for the canvas element
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor({ nbEnemies = 3 }) {
    const el = '#game';
    this.canvas = initCanvas({ el });
    this.nbEnemies = nbEnemies;
    this.initialNbEnemies = nbEnemies;

    // assets
    this.assets = new Assets();

    // game state
    this.gameState = STATE.LOADING;

    // blocks
    this.blocks = this.generateBlocks();

    // player
    this.player = this.generatePlayer();

    // enemies
    this.enemies = this.generateEnemies(this.nbEnemies);
    this.enemiesChangeDirection = false;

    // menus
    this.loadingMenu = new LoadingMenu();
    this.welcomeMenu = new WelcomeMenu();
    this.lostMenu = new LostMenu();
    this.wonMenu = new LostMenu();
    this.pauseMenu = new PauseMenu();

    // scoreBoard
    this.scoreBoard = new ScoreBoard();

    // game music
    this.music = this.assets.music;
    this.music.loop = true;

    this.looseSound = this.assets.looseSound;

    // Initialize event handlers
    this.onStart = this.onStart.bind(this);
    this.onResume = this.onResume.bind(this);

    this.init();
  }

  init() {
    this.assets
      .load()
      .then(() => {
        this.initListeners();
        this.changeGameState(STATE.WELCOME); // Use changeGameState to handle initial state
        this.update();
      })
      .catch((err) => {
        this.gameState = STATE.LOADING;
        console.error(err);
      });
  }

  initListeners() {
    // Keyboard event listeners for the game
    window.addEventListener('keydown', (e) => {
      // Do nothing if not playing
      if (this.gameState !== STATE.PLAYING) return;

      // Prevent page from moving on key press
      if (Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault();

      if (e.keyCode === KEYBOARD.RIGHT || e.keyCode === KEYBOARD.LEFT) {
        this.player.direction.x = 0;
        // Move right
        if (e.keyCode === KEYBOARD.RIGHT && this.player.x + this.player.width < this.canvas.width)
          this.player.direction.x = 1;
        // Move left
        if (e.keyCode === KEYBOARD.LEFT && this.player.x > 0) this.player.direction.x = -1;
      }
    });

    window.addEventListener('keyup', (e) => {
      // Do nothing if not paused or playing
      if (this.gameState !== STATE.PLAYING && this.gameState !== STATE.PAUSED) return;

      // Pause
      if (e.keyCode === KEYBOARD.PAUSE) {
        if (this.gameState !== STATE.PAUSED) this.pause();
        else this.resume();
      }

      // Do nothing if game is not playing
      if (this.gameState !== STATE.PLAYING) return;

      // Prevent page from moving on key press
      if (Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault();

      // Stop moving
      if ((e.keyCode === KEYBOARD.RIGHT || e.keyCode === KEYBOARD.LEFT) && this.player.direction.x)
        this.player.direction.x = 0;
      // Fire
      if (e.keyCode === KEYBOARD.FIRE) this.player.fire();
      // Fullscreen
      if (e.keyCode === KEYBOARD.FULLSCREEN) this.canvas.fullscreen();
    });

    // Menu event listeners
    this.welcomeMenu.events.on('start', this.onStart);
    this.lostMenu.events.on('start', this.onStart);
    this.wonMenu.events.on('start', this.onStart);
    this.pauseMenu.events.on('resume', this.onResume);
  }

  onStart() {
    if (this.gameState === STATE.WELCOME || this.gameState === STATE.LOST || this.gameState === STATE.WON) {
      this.resume();
    }
  }

  onResume() {
    if (this.gameState === STATE.PAUSED) {
      this.resume();
    }
  }

  changeGameState(newState) {
    // Unbind event listeners from the previous state
    switch (this.gameState) {
      case STATE.WELCOME:
        this.welcomeMenu.unbind();
        break;
      case STATE.LOST:
        this.lostMenu.unbind();
        break;
      case STATE.WON:
        this.wonMenu.unbind();
        break;
      case STATE.PAUSED:
        this.pauseMenu.unbind();
        break;
      // Add cases for other menus if needed
    }

    // Update the game state
    this.gameState = newState;

    // Bind event listeners for the new state
    switch (this.gameState) {
      case STATE.WELCOME:
        this.welcomeMenu.bind();
        break;
      case STATE.LOST:
        this.lostMenu.bind();
        break;
      case STATE.WON:
        this.wonMenu.bind();
        break;
      case STATE.PAUSED:
        this.pauseMenu.bind();
        break;
      // Add cases for other menus if needed
    }
  }

  generatePlayer() {
    return new Player({
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      width: 96,
      height: 96,
      texture: this.assets.playerTexture,
      assets: this.assets,
    });
  }

  /**
   * Generates a given number of enemies
   * @param {Integer} nb - the number of enemies to be created
   */
  generateEnemies(nb) {
    let enemies = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 6; j++) {
        enemies.push(
          new Enemy({
            x: (this.canvas.width / 8) + (i * 54),
            y: 64 + (j * 54),
            width: 50,
            height: 50,
            texture: this.assets.enemyTexture,
            assets: this.assets,
          })
        );
      }
    }
    return enemies;
  }

  generateBlocks() {
    const layout = [
      "0000011111001100110111110011111100000",
      "0000011111101100110111111011111100000",
      "0000011001101100110110011000110000000",
      "0000011111101111110111111000110000000",
      "0000011111001111110111111000110000000",
      "0000011000001100110110011000110000000",
      "0000011000001100110110011000110000000",
      "0000011000001100110110011000110000000",
    ];
    let blocks = [];
    const blockSize = 20; // Width and height of each block
  
    layout.forEach((row, rowIndex) => {
      row.split("").forEach((cell, colIndex) => {
        if (cell === "1") {
          blocks.push(
            new Block({
              x: (this.canvas.width / 8) + (colIndex * (blockSize + 1)), // Add 1 for spacing
              y: (this.canvas.width / 8) * 5 + (rowIndex * (blockSize + 1)),
              width: blockSize,
              height: blockSize,
              texture: this.assets.blockTexture,
              assets: this.assets,
            })
          );
        }
      });
    });
  
    return blocks;
  }  

  renderGame() {
    // First clear the canvas
    this.canvas.clear();

    // Then render something based on the game state
    switch (this.gameState) {
      case STATE.LOADING:
        this.loadingMenu.render();
        break;
      case STATE.WELCOME:
        this.welcomeMenu.render();
        break;
      case STATE.PAUSED:
        this.pauseMenu.render();
        break;
      case STATE.LOST:
        this.lostMenu.render();
        break;
      case STATE.WON:
        this.wonMenu.render();
        break;
      case STATE.PLAYING:
        this.scoreBoard.render();
        this.player.render();
        this.enemies.forEach((enemy) => {
          enemy.render();
        });
        this.blocks.forEach((block) => {
          block.render();
        });
        break;
    }
  }

  updateGame() {
    if (this.gameState === STATE.PLAYING) {
      this.player.move();
      this.updateEnemies();
      this.checkCollisions();
    }
  }

  updateEnemies() {
    let changeDirection = false;
    this.enemies.forEach((enemy) => {
      enemy.move(this.enemiesChangeDirection);
      // If any enemy reaches the edges of the game container, change enemies direction
      if (enemy.x < 0 || enemy.x + enemy.width > this.canvas.width) changeDirection = true;
    });

    // Next update loop, are they going to change direction?
    this.enemiesChangeDirection = changeDirection;
  }

  update() {
    this.updateGame();
    this.renderGame();
    requestAnimationFrame(this.update.bind(this));
  }

  checkCollisions() {
    let blocksHit = [];
    let enemiesHit = [];
    let missilesHit = [];

    this.enemies.forEach((enemy) => {
      // Check if player's missiles hit the enemy
      this.player.missiles.forEach((missile) => {
        if (
          missile.x > enemy.x &&
          missile.x < enemy.x + enemy.width &&
          missile.y > enemy.y &&
          missile.y < enemy.y + enemy.height
        ) {
          enemy.die(); // Remove the enemy
          this.scoreBoard.incrementScore(); // Increment the player's score
          enemiesHit.push(enemy); // Mark the enemy for removal
          missilesHit.push(missile); // Mark the missile for removal
        }
      });
    
      // Check if enemy missiles hit the player
      enemy.missiles.forEach((missile) => {
        if (
          missile.x > this.player.x &&
          missile.x < this.player.x + this.player.width &&
          missile.y > this.player.y &&
          missile.y < this.player.y + this.player.height
        ) {
          this.loose(); // Player loses the game
          missilesHit.push(missile); // Mark the missile for removal
        }
      });
    
      // If any enemy reaches the player's y position, the game is lost
      if (enemy.y + enemy.height > this.player.y) this.loose();
    });

    this.blocks.forEach((block) => {
      // Check if player's missiles hit the block
      this.player.missiles.forEach((missile) => {
        if (
          missile.x > block.x &&
          missile.x < block.x + block.width &&
          missile.y > block.y &&
          missile.y < block.y + block.height
        ) {
          block.die(); // Destroy the block
          blocksHit.push(block); // Mark the block for removal
          missilesHit.push(missile); // Mark the missile for removal
        }
      });
    
      // Check if enemy missiles hit the block
      this.enemies.forEach((enemy) => {
        enemy.missiles.forEach((missile) => {
          if (
            missile.x > block.x &&
            missile.x < block.x + block.width &&
            missile.y > block.y &&
            missile.y < block.y + block.height
          ) {
            missilesHit.push(missile); // Mark the missile for removal
            // The block remains intact
          }
        });
      });
    });

    // Remove hit entities
    this.blocks = this.blocks.filter((block) => !blocksHit.includes(block));
    this.enemies = this.enemies.filter((enemy) => !enemiesHit.includes(enemy));
    this.player.missiles = this.player.missiles.filter((missile) => !missilesHit.includes(missile));
    this.enemies.forEach((enemy) => {
      enemy.missiles = enemy.missiles.filter((missile) => !missilesHit.includes(missile));
    });

    // If no enemies left, the game is won
    if (!this.enemies.length) this.win();
  }

  pause() {
    this.changeGameState(STATE.PAUSED);
    this.music.pause();
  }

  resume() {
    this.changeGameState(STATE.PLAYING);
    this.assets.playBackgroundMusic();
  }

  reset() {
    this.player = this.generatePlayer();
    this.blocks = this.generateBlocks();
    this.enemies = this.generateEnemies(this.nbEnemies);
    this.music.pause();
    this.music.currentTime = 0;
  }

  loose() {
    this.changeGameState(STATE.LOST);
    this.looseSound.play();
    this.scoreBoard.reset();
    this.nbEnemies = this.initialNbEnemies;
    this.reset();
  }

  win() {
    this.changeGameState(STATE.WON);
    this.scoreBoard.levelup();
    this.nbEnemies += 1;
    this.reset();
  }
}
