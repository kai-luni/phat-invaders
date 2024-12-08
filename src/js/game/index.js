// index.js

import { initCanvas } from './Canvas.js';
import PhatHelper from './PhatHelper.js'
import Assets from './Assets.js';
import Block from './gameObjects/Block.js';
import Enemy from './gameObjects/Enemy.js';
import Player from './gameObjects/Player.js';
import WelcomeMenu from './hud/WelcomeMenu.js';
import LostMenu from './hud/LostMenu.js';
import HighScoreMenu from './hud/HighScoreMenu.js';
import ScoreBoard from './hud/ScoreBoard.js';
import BossEnemy from './gameObjects/BossEnemy.js';

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
  BOSS: 6,
  HIGHSCORE: 7
};

export default class Game {
  /**
   * Space Invaders game constructor
   * @param {Object} params - initialization parameters
   * @param {Integer} params.nbEnemies - number of enemies to generate
   */
  constructor() {
    const el = '#game';
    this.canvas = initCanvas({ el });

    this.phatHelper = new PhatHelper();
    
    // for (let i = 1; i <= 100; i++) {
    //   console.log(`Level ${i}: Reward ${phatHelper.getRewardForNextLevel(i)}`);
    // }

    this.defaultFireRate = 500;

    this.assets = new Assets();

    // Game state
    this.gameState = STATE.LOADING;
    // Initialize event handlers
    this.onStart = this.onStart.bind(this);
    this.onHighscore = this.onHighscore.bind(this);

    // Initialize last frame time for deltaTime calculation
    this.lastFrameTime = performance.now();

    // Show initial overlay
    this.showInitialOverlay();

    this.reset();
  }

  /**
   * this is called when the game starts or restarts
   */
  reset() {
    // reset values that change with level up
    this.enemyVelocity = 1.0;
    this.enemyFireRate = 900; // The lower the value, the faster the shooting of enemies
    this.msUntilEnemyGoDown = 7500;

    this.assets.setMusicSpeed(1.0);
    this.scoreBoard = new ScoreBoard(this.assets);
    this.reward = 100;
    this.playerFireRate = this.defaultFireRate;
  }

  showInitialOverlay() {
    // Create the overlay
    this.initialOverlay = document.createElement('div');
    this.initialOverlay.style.position = 'fixed';
    this.initialOverlay.style.top = '0';
    this.initialOverlay.style.left = '0';
    this.initialOverlay.style.width = '100%';
    this.initialOverlay.style.height = '100%';
    this.initialOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Black with opacity
    this.initialOverlay.style.display = 'flex';
    this.initialOverlay.style.justifyContent = 'center';
    this.initialOverlay.style.alignItems = 'center';
    this.initialOverlay.style.zIndex = '1000'; // Ensure it appears above other elements

    // Create the text
    this.overlayText = document.createElement('div');
    this.overlayText.textContent = 'Click Me';
    this.overlayText.style.fontSize = '24px';
    this.overlayText.style.color = '#ffffff';
    this.overlayText.style.cursor = 'pointer';

    this.initialOverlay.appendChild(this.overlayText);

    // Add click event listener
    this.initialOverlay.addEventListener('click', () => {
      // Change the text to 'Loading...'
      this.overlayText.textContent = 'Loading...';
      // Start initialization
      this.init();
    });

    // Add the overlay to the body
    document.body.appendChild(this.initialOverlay);
  }

  init() {
    this.assets
      .load()
      .then(() => {
        this.initListeners();
        this.changeGameState(STATE.WELCOME); // Use changeGameState to handle initial state
        this.update();
        // Remove the overlay
        if (this.initialOverlay) {
          this.initialOverlay.remove();
          this.initialOverlay = null;
        }
      })
      .catch((err) => {
        this.gameState = STATE.LOADING;
        console.error(err);
      });
  }

  initListeners() {
    // Initialize keysPressed object
    this.keysPressed = {};
    this.lastFireTime = 0; // Timestamp for the last fire

    window.addEventListener('keydown', (e) => {
      if (Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault();

      // Update key state
      this.keysPressed[e.keyCode] = true;

      if (this.gameState !== STATE.PLAYING && this.gameState !== STATE.BOSS) return;

      // Debug key to win the level
      if (e.key === 'd' || e.key === 'D') {
        this.win(); // Call the win method
      }
    });

    window.addEventListener('keyup', (e) => {
      if (Object.values(KEYBOARD).includes(e.keyCode)) e.preventDefault();

      // Update key state
      this.keysPressed[e.keyCode] = false;

      if (this.gameState !== STATE.PLAYING && this.gameState !== STATE.BOSS) return;

      // Handle fire key with rate limiting
      if (e.keyCode === KEYBOARD.FIRE) {
        this.player.fire();
      }
    });

    // Menu event listeners
    this.highScoreMenu = new HighScoreMenu(this.assets);
    this.highScoreMenu.events.on('start', this.onStart);
    this.lostMenu = new LostMenu(this.assets);
    this.lostMenu.events.on('start', this.onStart);
    this.lostMenu.events.on('highscore', this.onHighscore);
    this.scoreBoard.events.on('soundOn', () => {
      this.assets.soundOn();
    });
    this.scoreBoard.events.on('soundOff', () => {
      this.assets.soundOff();
    });    
    this.welcomeMenu = new WelcomeMenu(this.canvas.width, this.canvas.height);
    this.welcomeMenu.events.on('start', this.onStart);
  }

  onStart() {
    if (
      this.gameState === STATE.WELCOME ||
      this.gameState === STATE.LOST ||
      this.gameState === STATE.HIGHSCORE
    ) {
      this.startGame();
    }
  }

  onHighscore() {
    this.changeGameState(STATE.HIGHSCORE);
  }

  generateNextLevel() {
    if (this.scoreBoard.level % 3 == 0){
      this.changeGameState(STATE.BOSS);
      this.assets.playMusic('boss');
    } else {
      this.changeGameState(STATE.PLAYING);
      this.assets.playMusic('background');
    } 
    
    this.player = this.generatePlayer();
    this.blocks = this.generateBlocks();
    this.enemies = (this.gameState === STATE.BOSS) ? this.generateBoss() : this.generateEnemiesAndItems(); 
    this.lastSpecialActionTime = Date.now();
  }

  startGame() {
    this.reset();

    this.generateNextLevel();
    
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
      case STATE.HIGHSCORE:
        this.highScoreMenu.unbind();
    }

    console.log("New State: ", newState);
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
      case STATE.HIGHSCORE:
          this.highScoreMenu.bind();
    }
  }

  generatePlayer() {
    return new Player({
      x: this.canvas.width / 2,
      y: this.canvas.height - 48,
      width: 64,
      height: 64,
      texture: this.assets.playerTexture,
      assets: this.assets,
      fireRate: this.playerFireRate
    });
  }

  generateBoss() {
    let enemies = [];
    enemies.push(
      new BossEnemy({
        x: 100,
        y: 130,
        texture: this.assets.enemyTexture,
        textureShocked: this.assets.enemyShockedTexture,
        assets: this.assets,
        canvas: this.canvas
      })
    );
    return enemies;
  }

/**
 * Generates a given number of enemies, including three special items:
 * 1) Fire Boost (type: 1)
 * 2) Row Destroyer (type: 2)
 * 3) Spread Fire (type: 3)
 */
generateEnemiesAndItems() {
  let enemies = [];
  const totalEnemies = 12 * 6; // Total number of enemies

  // Randomly pick indices for the three special items
  const specialFireBoostIndex = Math.floor(Math.random() * totalEnemies);

  let specialRowDestroyerIndex;
  do {
    specialRowDestroyerIndex = Math.floor(Math.random() * totalEnemies);
  } while (specialRowDestroyerIndex === specialFireBoostIndex);

  let specialSpreadFireIndex;
  do {
    specialSpreadFireIndex = Math.floor(Math.random() * totalEnemies);
  } while (specialSpreadFireIndex === specialFireBoostIndex || specialSpreadFireIndex === specialRowDestroyerIndex);

  let currentIndex = 0; // Track the index of the current enemy being created

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 6; j++) {
      // Determine which special item this enemy might be
      const isFireBoostItem = currentIndex === specialFireBoostIndex;
      const isRowDestroyerItem = currentIndex === specialRowDestroyerIndex;
      const isSpreadFireItem = currentIndex === specialSpreadFireIndex;

      enemies.push(
        new Enemy({
          x: 280 + i * 44,
          y: 64 + j * 44,
          width: 40,
          height: 40,
          texture: isFireBoostItem
            ? this.assets.fireBoostTexture
            : isRowDestroyerItem
            ? this.assets.presentTexture    // texture for the rowDestroyer item
            : isSpreadFireItem
            ? this.assets.candleTexture // texture for the spreadFire item
            : this.assets.enemyTexture,
          assets: this.assets,
          column: i,
          row: j,
          velocity: this.enemyVelocity,
          type: isFireBoostItem
            ? 1
            : isRowDestroyerItem
            ? 2
            : isSpreadFireItem
            ? 3
            : 0, // Assign type 1 for fireBoost, 2 for rowDestroyer, 3 for spreadFire
        })
      );

      currentIndex++; // Move to the next enemy index
    }
  }

  return enemies;
}


  generateBlocks() {
    const layout = [
      '0000011111001100110111110011111100000',
      '0000011111101100110111111011111100000',
      '0000011001101100110110011000110000000',
      '0000011111101111110111111000110000000',
      '0000011111001111110111111000110000000',
      '0000011000001100110110011000110000000',
      '0000011000001100110110011000110000000',
      '0000011000001100110110011000110000000',
    ];
    let blocks = [];
    const blockSize = 22; // Width and height of each block

    layout.forEach((row, rowIndex) => {
      row.split('').forEach((cell, colIndex) => {
        if (cell === '1') {
          blocks.push(
            new Block({
              x: this.canvas.width / 8 + colIndex * (blockSize + 1), // Add 1 for spacing
              y: (this.canvas.width / 32) * 23 + rowIndex * (blockSize + 1),
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
        // Optionally render a loading screen
        break;
      case STATE.WELCOME:
        this.welcomeMenu.render();
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
      case STATE.BOSS:
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

  updateGame(deltaTime) {
    if (this.gameState === STATE.PLAYING || this.gameState === STATE.BOSS) {
      // Update player direction based on keys pressed
      this.updatePlayerDirection();

      // Move the player with deltaTime
      this.player.move(deltaTime);
      this.updateEnemies();
      this.checkCollisions();
    }
  }

  updatePlayerDirection() {
    if (this.keysPressed[KEYBOARD.LEFT]) {
      this.player.direction.x = -1;
    } else if (this.keysPressed[KEYBOARD.RIGHT]) {
      this.player.direction.x = 1;
    } else {
      this.player.direction.x = 0;
    }
  }

  /**
   * Updates the position and direction of enemies.
   */
  updateEnemies() {

    // Determine if 10 seconds have passed
    const currentTime = Date.now();
    const triggerSpecialAction = this.lastSpecialActionTime
      ? currentTime - this.lastSpecialActionTime >= this.msUntilEnemyGoDown
      : true;

    if (triggerSpecialAction) {
      this.lastSpecialActionTime = currentTime; // Reset the timer
    }

    this.enemies.forEach((enemy) => {
      // Pass the condition for every 10 seconds to the move method
      enemy.move(triggerSpecialAction);
    });

    let frontEnemies = this.getLowestEnemiesByColumn(this.enemies);
    frontEnemies.forEach((frontEnemy) => {
      frontEnemy.fire(this.enemyFireRate);
    });
  }

  getLowestEnemiesByColumn(enemies) {
    // Create a map to store the lowest enemy for each column
    const columnMap = new Map();
  
    // Iterate through all enemies
    enemies.forEach((enemy) => {
      const { column, row } = enemy;
  
      // If the column doesn't exist in the map, add it
      if (!columnMap.has(column)) {
        columnMap.set(column, enemy);
      } else {
        // Compare and update if the current enemy is lower (higher row value)
        if (row > columnMap.get(column).row) {
          columnMap.set(column, enemy);
        }
      }
    });
  
    // Return the front enemies as a list (values of the map)
    return Array.from(columnMap.values());
  }

  update() {
    // Calculate deltaTime
    const now = performance.now();
    const deltaTime = (now - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = now;

    this.updateGame(deltaTime);
    this.renderGame();

    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Checks for collisions between game objects.
  /**
   * Checks for collisions between game objects.
   * 
   * This method performs the following collision checks:
   * 
   * - **Player Missiles vs. Enemies**: Destroys both the missile and the enemy, increments the score.
   * - **Enemy Missiles vs. Player**: Ends the game by calling `this.loose()`.
   * - **Player Missiles vs. Blocks**: Destroys both the missile and the block.
   * - **Enemy Missiles vs. Blocks**: Destroys both the missile and the block.
   * - **Enemies vs. Blocks**: Ends the game by calling `this.loose()`.
   * - **Enemies Reaching Player**: Ends the game by calling `this.loose()`.
   * - **Player Missiles vs. Enemy Missiles**: Destroys both missiles.
   * 
   * After processing collisions, it removes destroyed objects from their respective arrays.
   * If all enemies are destroyed, the game is won by calling `this.win()`.
   */
  checkCollisions() {
    let blocksHit = [];
    let enemiesHit = [];
    let playerMissilesHit = [];
    let enemyMissilesHit = [];
    let rowsToKill = [];

    // Check collisions between player missiles and enemies
    this.enemies.forEach((enemy) => {
      this.player.missiles.forEach((missile) => {
        if (enemy.hit(missile)) {
          if (enemy.type == 1) {
            this.player.shootFast();
          }
          if (enemy.type == 2) {
            rowsToKill.push(enemy.row);            
          }
          if (enemy.type == 3) {
            this.player.shootTripple();
          }
          if (enemy.dead){
            enemy.die();
            this.scoreBoard.incrementScore(this.reward);
            enemiesHit.push(enemy);
          }
          playerMissilesHit.push(missile);
        }
      });
    });

    // destroy row from  special item
    rowsToKill.forEach((row) => {
      this.destroyRow(row);
    });

    // Check collisions between enemy missiles and player
    this.enemies.forEach((enemy) => {
      enemy.missiles.forEach((missile) => {
        if (this.player.hit(missile)){
          this.loose();
          enemyMissilesHit.push(missile);
        }
      });
    });

    // Check collisions between player's missiles and blocks
    this.blocks.forEach((block) => {
      this.player.missiles.forEach((missile) => {
        if (block.hit(missile)) {
          block.die();
          blocksHit.push(block);
          playerMissilesHit.push(missile);
        }
      });
    });

    // Check collisions between enemy missiles and blocks
    this.blocks.forEach((block) => {
      this.enemies.forEach((enemy) => {
        enemy.missiles.forEach((missile) => {
          if (block.hit(missile)) {
            enemyMissilesHit.push(missile);
            blocksHit.push(block);
          }
        });
      });
    });

    // Check collisions between enemies and blocks
    this.blocks.forEach((block) => {
      this.enemies.forEach((enemy) => {
        if (block.hit(enemy)) {
          this.loose();
        }
      });
    });

    // Check collisions between player missiles and enemy missiles
    this.player.missiles.forEach((playerMissile) => {
      this.enemies.forEach((enemy) => {
        enemy.missiles.forEach((enemyMissile) => {
          if (enemyMissile.hit(playerMissile)) {
            playerMissilesHit.push(playerMissile);
            enemyMissilesHit.push(enemyMissile);
          }
        });
      });
    });

    // Check if any enemy reaches the player's y position
    this.enemies.forEach((enemy) => {
      if (enemy.y + enemy.height > this.player.y) {
        this.loose();
      }
    });

    // Remove hit entities
    this.blocks = this.blocks.filter((block) => !blocksHit.includes(block));
    this.enemies = this.enemies.filter((enemy) => !enemiesHit.includes(enemy));
    this.player.missiles = this.player.missiles.filter((missile) => !playerMissilesHit.includes(missile));
    this.enemies.forEach((enemy) => {
      enemy.missiles = enemy.missiles.filter((missile) => !enemyMissilesHit.includes(missile));
    });

    // If no enemies left, the game is won
    if (!this.enemies.length) {
      this.win();
    }
  }

  /**
   * Destroys all enemies in the specified row.
   * 
   * This method iterates through all enemies in the game, checks if they belong to the given row,
   * and triggers their `die()` method. Optionally, it also removes the dead enemies from the game.
   * 
   * @param {number} row - The row number to target for destruction.
   */
  destroyRow(row) {
    // Iterate over all enemies
    this.enemies.forEach((enemy) => {
      // Check if the enemy is in the specified row
      if (enemy.row === row) {
        // Call the die method on the enemy
        this.scoreBoard.incrementScore(this.reward);
        
        if (enemy.type == 1) {
          this.player.shootFast();
        }
        if (enemy.type == 3) {
          this.player.shootTripple();
        }

        enemy.die();
      }
    });

    // Remove enemies from the array if they're marked as dead
    this.enemies = this.enemies.filter((enemy) => enemy.row !== row || !enemy.dead);
  }

  loose() {
    this.changeGameState(STATE.LOST);
    this.assets.playLaughingSound();
  
    // Stop the background music when the player loses
    this.assets.stopMusic();

    // Pass the current score to the LostMenu
    this.lostMenu.setGameValues(this.scoreBoard.score, this.scoreBoard.level);
  }

  win() {
    // Removed level-up and incrementing of enemies
    this.scoreBoard.levelup();

    this.assets.setMusicSpeed(1.0 + (this.scoreBoard.level*0.05));
    this.playerFireRate = this.playerFireRate - this.playerFireRate/20;
    this.player.setFireRate(this.playerFireRate)

    // Increase difficulty
    this.enemyVelocity += 0.25;
    this.enemyFireRate -= this.enemyFireRate / 6;
    this.msUntilEnemyGoDown -= this.msUntilEnemyGoDown / 14;
    this.reward += (this.scoreBoard.level < 8) ?  4 : this.phatHelper.getRewardForNextLevel(this.scoreBoard.level);
    console.log("Upgrade");
    console.log("Speed " + this.enemyVelocity);
    console.log("Firerate " + this.enemyFireRate);
    console.log("Go Down Speed" + this.msUntilEnemyGoDown);

    // Reset the game state
    this.generateNextLevel();
  }
}
