// index.js

import { initCanvas } from './Canvas.js';
import Assets from './Assets.js';
import Block from './gameObjects/Block.js';
import Enemy from './gameObjects/Enemy.js';
import Player from './gameObjects/Player.js';
import PauseMenu from './hud/PauseMenu.js';
import LoadingMenu from './hud/LoadingMenu.js';
import WelcomeMenu from './hud/WelcomeMenu.js';
import LostMenu from './hud/LostMenu.js';
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

    // Assets
    this.assets = new Assets();

    // Game state
    this.gameState = STATE.LOADING;
    // Initialize event handlers
    this.onStart = this.onStart.bind(this);
    this.onResume = this.onResume.bind(this);

    // Initialize last frame time for deltaTime calculation
    this.lastFrameTime = performance.now();

    // Values that change with level up
    this.enemyVelocity = 1.2;
    this.enemyFireRate = 460; // The lower the value, the faster the shooting of enemies
    this.msUntilEnemyGoDown = 7000;

    // Show initial overlay
    this.showInitialOverlay();
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

      // Handle pause key
      if (e.keyCode === KEYBOARD.PAUSE && this.gameState === STATE.PAUSED) {
        this.resume();
      }

      // Handle fire key with rate limiting
      if (e.keyCode === KEYBOARD.FIRE) {
        this.player.fire();
      }
    });

    // Menu event listeners
    this.welcomeMenu = new WelcomeMenu(this.canvas.width, this.canvas.height);
    this.welcomeMenu.events.on('start', this.onStart);

    this.lostMenu = new LostMenu();
    this.lostMenu.events.on('start', this.onStart);

    this.pauseMenu = new PauseMenu();
    this.pauseMenu.events.on('resume', this.onResume);
  }

  onStart() {
    if (
      this.gameState === STATE.WELCOME ||
      this.gameState === STATE.LOST ||
      this.gameState === STATE.WON
    ) {
      this.startGame();
    }
  }

  startGame() {
    // Initialize or reset game objects
    this.blocks = this.generateBlocks();
    this.player = this.generatePlayer();
    
    this.scoreBoard = new ScoreBoard();
    console.log("level:::::::::::: " + this.scoreBoard.level);
    this.enemies = (this.scoreBoard.level % 3 == 0) ? this.generateBoss() : this.generateEnemiesAndItems();
    if (this.scoreBoard.level % 3 == 0){
      this.changeGameState(STATE.BOSS)
    } else {
      this.changeGameState(STATE.PLAYING);
    }  
    this.assets.playBackgroundMusic();
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
        console.log("welcome");
        this.welcomeMenu.bind();
        break;
      case STATE.LOST:
        this.lostMenu.bind();
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
      y: this.canvas.height - 48,
      width: 64,
      height: 64,
      texture: this.assets.playerTexture,
      assets: this.assets,
    });
  }

  generateBoss() {
    let enemies = [];
    enemies.push(
      new BossEnemy({
        x: 100,
        y: 100,
        texture: this.assets.enemyTexture,
        assets: this.assets,
        canvas: this.canvas
      })
    );
    return enemies;
  }

  /**
   * Generates a given number of enemies
   */
  generateEnemiesAndItems() {
    let enemies = [];
    const totalEnemies = 12 * 6; // Total number of enemies
    const specialEnemyIndex = Math.floor(Math.random() * totalEnemies); // Pick a random index
  
    let currentIndex = 0; // Track the index of the current enemy being created
  
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 6; j++) {
        // Determine if this enemy is the special one
        const isFireBoostItem = currentIndex === specialEnemyIndex;
  
        enemies.push(
          new Enemy({
            x: 180 + i * 44,
            y: 64 + j * 44,
            width: 40,
            height: 40,
            texture: isFireBoostItem ? this.assets.fireBoostTexture : this.assets.enemyTexture,
            assets: this.assets,
            column: i,
            row: j,
            velocity: this.enemyVelocity,
            type: isFireBoostItem ? 1 : 0, // Assign type 1 if special
          })
        );
  
        currentIndex++; // Increment the current index
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
      case STATE.PAUSED:
        this.pauseMenu.render();
        break;
      case STATE.LOST:
        this.lostMenu.render();
        break;
      case STATE.WON:
        // Optionally render a won screen
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

    // Check collisions between player missiles and enemies
    this.enemies.forEach((enemy) => {
      this.player.missiles.forEach((missile) => {
        if (enemy.hit(missile)) {
          if (enemy.type == 1) {
            this.player.shootFast();
          }
          if (enemy.dead){
            enemy.die();
            this.scoreBoard.incrementScore();
            enemiesHit.push(enemy);
          }
          playerMissilesHit.push(missile);
        }
      });
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

  resume() {
    this.changeGameState(STATE.PLAYING);
    this.assets.backgroundMusic.play(); // Resume the music
  }

  generateNextLevel() {
    this.player = this.generatePlayer();
    this.blocks = this.generateBlocks();
    this.enemies = (this.scoreBoard.level % 3 == 0) ? this.generateBoss() : this.generateEnemiesAndItems(); 

    this.lastSpecialActionTime = Date.now();
  }

  loose() {
    this.changeGameState(STATE.LOST);
    this.assets.playLooseSound();
  
    // Stop the background music when the player loses
    this.assets.stopBackgroundMusic();

    // Pass the current score to the LostMenu
    this.lostMenu.setHighScore(this.scoreBoard.score);

    this.scoreBoard.reset();
    this.generateNextLevel();
  }

  win() {
    // Removed level-up and incrementing of enemies
    this.scoreBoard.levelup();

    // Increase difficulty
    this.enemyVelocity += 0.2;
    this.enemyFireRate -= this.enemyFireRate / 12;
    this.msUntilEnemyGoDown -= this.msUntilEnemyGoDown / 16;
    console.log("Upgrade");
    console.log("Speed " + this.enemyVelocity);
    console.log("Firerate " + this.enemyFireRate);
    console.log("Go Down Speed" + this.msUntilEnemyGoDown);

    // Reset the game state
    this.generateNextLevel();

    // Resume the game
    this.resume();
  }
}
