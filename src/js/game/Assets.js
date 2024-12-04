// Assets.js

// Graphics
import gameMusic from '../../assets/audio/happy_christmas_background_music_small.mp3';
import enemyTexture from '../../assets/graphics/grinch_1.png';
import enemyRocketTexture from '../../assets/graphics/schneeflocke.png';
import fireBoostTexture from '../../assets/graphics/zuckerstange.png';
import santaRocketTexture from '../../assets/graphics/kugel_rot.png';
import blockTexture from '../../assets/graphics/kugel_gruen.png';
import playerTexture from '../../assets/graphics/santa.png';
import welcomeTexture from '../../assets/graphics/welcome.png';

// Sounds
import fireSound from '../../assets/audio/080245_sfx_magic_84935.mp3';
import killSound from '../../assets/audio/ding-80828.mp3';
import looseSound from '../../assets/explosion.mp3';

export default class Assets {
  constructor() {
    // Initialize Image objects and assign `src` for each texture
    this.enemyTexture = new Image();
    this.enemyTexture.src = enemyTexture;
    this.enemyRocketTexture = new Image();
    this.enemyRocketTexture.src = enemyRocketTexture;
    this.fireBoostTexture = new Image();
    this.fireBoostTexture.src = fireBoostTexture;
    this.blockTexture = new Image();
    this.blockTexture.src = blockTexture;
    this.playerTexture = new Image();
    this.playerTexture.src = playerTexture;
    this.santaRocketTexture = new Image();
    this.santaRocketTexture.src = santaRocketTexture;
    this.welcomeTexture = new Image();
    this.welcomeTexture.src = welcomeTexture;

    // Paths for audio files
    this.audioFiles = {
      loose: looseSound,
      kill: killSound,
      fire: fireSound,
    };

    // Object to hold decoded audio buffers
    this.buffers = {};

    // Create an AudioContext for sound effects
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Initialize background music using HTML5 Audio element
    this.backgroundMusic = new Audio(gameMusic);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5; // Adjust volume as needed
    this.musicStarted = false; // Flag to track if music has started
  }

  async load() {
    try {
      // Load and decode all audio files except the background music
      const audioPromises = Object.keys(this.audioFiles).map((key) =>
        this.loadAudio(key, this.audioFiles[key])
      );
  
      // Load all textures
      const texturePromises = [
        this.loadTexture(this.enemyTexture),
        this.loadTexture(this.enemyRocketTexture),
        this.loadTexture(this.fireBoostTexture), // Corrected line
        this.loadTexture(this.blockTexture),
        this.loadTexture(this.playerTexture),
        this.loadTexture(this.santaRocketTexture),
        this.loadTexture(this.welcomeTexture),
        // ... include any other textures you have
      ];
  
      // Wait for all assets to load
      await Promise.all([...audioPromises, ...texturePromises]);
  
      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error; // Rethrow the error to propagate it
    }
  }

  // Load and decode audio files (for sound effects)
  async loadAudio(key, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.buffers[key] = audioBuffer;
      console.log(`Audio loaded: ${key}`);
    } catch (error) {
      console.error(`Error loading audio (${key}):`, error);
      throw error;
    }
  }

/**
 * Loads a given texture (image) and returns a Promise that resolves when the image is successfully loaded.
 * 
 * @param {HTMLImageElement} image - The `HTMLImageElement` object representing the texture to be loaded.
 *                                   This object should have its `src` property set to the image URL.
 * 
 * @returns {Promise<HTMLImageElement>} - A Promise that resolves with the `HTMLImageElement` once loaded,
 *                                        or rejects with an error if loading fails.
 */
loadTexture(image) {
  return new Promise((resolve, reject) => {
    if (!image || !image.src) {
      reject(new Error('Image element or its src property is missing.'));
      return;
    }

    // If the image is already loaded (cached by the browser), resolve immediately
    if (image.complete) {
      console.log(`Texture already loaded from cache: ${image.src}`);
      resolve(image);
      return;
    }

    // Attach the onload handler to resolve the promise when the image loads
    image.onload = () => {
      console.log(`Texture loaded successfully: ${image.src}`);
      resolve(image);
    };

    // Attach the onerror handler to reject the promise if the image fails to load
    image.onerror = (err) => {
      console.error(`Error loading texture (${image.src}):`, err);
      reject(err);
    };
  });
}

  // Play background music
  playBackgroundMusic() {
    if (!this.musicStarted) {
      this.backgroundMusic.play().catch((error) => {
        console.error('Error playing background music:', error);
      });
      this.musicStarted = true;
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.musicStarted) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.musicStarted = false;
    }
  }

  // Play firing sound
  playFireSound() {
    this.playSoundEffect('fire', 1.0);
  }

  // Play kill sound
  playKillSound() {
    this.playSoundEffect('kill', 1.0);
  }

  // Play loose sound
  playLooseSound() {
    this.playSoundEffect('loose', 1.0);
  }

  // Helper method to play sound effects using Web Audio API
  playSoundEffect(key, volume = 1.0) {
    if (!this.buffers[key]) {
      console.error(`Sound effect buffer not loaded: ${key}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[key];

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);
  }
}
