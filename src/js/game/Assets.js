// Assets.js

//graphics
import gameMusic from '../../assets/audio/happy_christmas_background_music_small.mp3';
import enemyTexture from '../../assets/graphics/grinch_1.png';
import enemyRocketTexture from '../../assets/graphics/schneeflocke.png';
import fireBoostTexture from '../../assets/graphics/zuckerstange.png';
import santaRocketTexture from '../../assets/graphics/kugel_rot.png';
import blockTexture from '../../assets/graphics/kugel_gruen.png';
import playerTexture from '../../assets/graphics/santa.png';
import welcomeTexture from '../../assets/graphics/welcome.png';

//sounds
import fireSound from '../../assets/audio/080245_sfx_magic_84935.mp3';
import killSound from '../../assets/audio/ding-80828.mp3';
import looseSound from '../../assets/explosion.mp3';

export default class Assets {
  constructor() {
    // Initialize Audio objects
    this.music = new Audio(gameMusic);
    this.looseSound = new Audio(looseSound);
    this.killSound = new Audio(killSound);
    this.fireSound = new Audio(fireSound);

    // Create an AudioContext
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Object to hold decoded audio buffers
    this.buffers = {};

    // Initialize Image objects and assign `src` for each texture
    this.enemyTexture = new Image();
    this.enemyTexture.src = enemyTexture;
    this.enemyRocketTexture = new Image();
    this.enemyRocketTexture.src = enemyRocketTexture;
    this.fireBoostTexture = new Image();
    this.fireBoostTexture.src = fireBoostTexture;
    this.blockTexture = new Image();
    this.blockTexture.src = blockTexture;  // Set the image source
    this.playerTexture = new Image();
    this.playerTexture.src = playerTexture;  // Set the image source
    this.santaRocketTexture = new Image();
    this.santaRocketTexture.src = santaRocketTexture;
    this.welcomeTexture = new Image();
    this.welcomeTexture.src = welcomeTexture;

    // Paths for audio files
    this.audioFiles = {
      music: gameMusic,
      loose: looseSound,
      kill: killSound,
      fire: fireSound,
    };

    // Paths for textures
    this.textureFiles = {
      block: blockTexture,
      enemy: enemyTexture,
      player: playerTexture,
    };
  }

  async load() {
    try {
      // Resume the AudioContext upon user interaction
      await this.resumeAudioContext();

      // Load and decode all audio files
      const audioPromises = Object.keys(this.audioFiles).map(key => this.loadAudio(key, this.audioFiles[key]));

      // Load all textures
      const texturePromises = Object.keys(this.textureFiles).map(key => this.loadTexture(this.textureFiles[key], this.textureFiles[key]));

      // Wait for all assets to load
      await Promise.all([...audioPromises, ...texturePromises]);

      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  // Function to resume AudioContext on user interaction
  async resumeAudioContext() {
    if (this.audioContext.state === 'suspended') {
      const resume = () => {
        this.audioContext.resume().then(() => {
          document.removeEventListener('click', resume);
          document.removeEventListener('keydown', resume);
        });
      };
      document.addEventListener('click', resume);
      document.addEventListener('keydown', resume);
      // Wait until AudioContext is resumed
      return new Promise((resolve) => {
        const checkState = () => {
          if (this.audioContext.state === 'running') {
            resolve();
          } else {
            requestAnimationFrame(checkState);
          }
        };
        checkState();
      });
    }
  }

  // Load and decode audio files
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

  // Load textures
  loadTexture(src) {
    return new Promise((resolve, reject) => {
      const texture = new Image(); // Create a new Image object

      texture.onload = () => {
        console.log(`Texture loaded: ${src}`);
        resolve(texture);
      };

      texture.onerror = (err) => {
        console.error(`Error loading texture (${src}):`, err);
        reject(err);
      };

      // Assign the source to the image
      texture.src = src;
    });
  }

  // Play background music
  playBackgroundMusic() {
    // Check if the music buffer is loaded
    if (!this.buffers.music) {
      console.error('Background music buffer is not loaded yet.');
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers.music;
    source.loop = true;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.5; // Adjust volume as needed

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);

    this.backgroundMusicSource = source; // Keep reference if you need to stop it later
  }

  // Play firing sound
  playFireSound() {
    // Check if the fire sound buffer is loaded
    if (!this.buffers.fire) {
      console.error('Fire sound buffer is not loaded yet.');
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers.fire;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 1.0; // Adjust volume as needed

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);
  }

  // Play loose sound
  playLooseSound() {
    // Check if the loose sound buffer is loaded
    if (!this.buffers.loose) {
      console.error('Loose sound buffer is not loaded yet.');
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers.loose;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 1.0; // Adjust volume as needed

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);
  }

  // Play kill sound
  playKillSound() {
    // Check if the kill sound buffer is loaded
    if (!this.buffers.kill) {
      console.error('Kill sound buffer is not loaded yet.');
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers.kill;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 1.0; // Adjust volume as needed

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);
  }
}
