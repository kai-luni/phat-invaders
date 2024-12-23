// Assets.js

// Graphics
import candleTexture from '../../assets/graphics/kerze.png';
import enemyTexture from '../../assets/graphics/grinch_1.png';
import enemyShockedTexture from '../../assets/graphics/grinch_2.png';
import enemyRocketTexture from '../../assets/graphics/schneeflocke.png';
import fireBoostTexture from '../../assets/graphics/zuckerstange.png';
import santaRocketTexture from '../../assets/graphics/kugel_rot.png';
import presentTexture from '../../assets/graphics/geschenk.png';
import blockTexture from '../../assets/graphics/kugel_gruen.png';
import playerTexture from '../../assets/graphics/santa.png';
import soundOffTexture from '../../assets/graphics/sound_off.png';
import soundOnTexture from '../../assets/graphics/sound_on.png';
import welcomeTexture from '../../assets/graphics/welcome.png';

// New additions
import highscoreTextTexture from '../../assets/graphics/scoreboard_text.png';
import gameOverTexture from '../../assets/graphics/game_over_text.png';
import headlineTexture from '../../assets/graphics/headline.png';

// Sounds
import bossMusic from '../../assets/audio/boss_music_2.mp3';
import boostSound from '../../assets/audio/boost.mp3';
import fireSound from '../../assets/audio/080245_sfx_magic_84935.mp3';
import gameMusic from '../../assets/audio/happy_christmas_background_music_small.mp3';
import killSound from '../../assets/audio/ding-80828.mp3';
import laughingSound from '../../assets/audio/laughing.mp3';

export default class Assets {
  constructor() {
    // Initialize Image objects and assign `src` for each texture
    this.candleTexture = new Image();
    this.candleTexture.src = candleTexture;
    this.enemyTexture = new Image();
    this.enemyTexture.src = enemyTexture;
    this.enemyShockedTexture = new Image();
    this.enemyShockedTexture.src = enemyShockedTexture;
    this.enemyRocketTexture = new Image();
    this.enemyRocketTexture.src = enemyRocketTexture;
    this.fireBoostTexture = new Image();
    this.fireBoostTexture.src = fireBoostTexture;
    this.blockTexture = new Image();
    this.blockTexture.src = blockTexture;
    this.playerTexture = new Image();
    this.playerTexture.src = playerTexture;
    this.presentTexture = new Image();
    this.presentTexture.src = presentTexture;
    this.santaRocketTexture = new Image();
    this.santaRocketTexture.src = santaRocketTexture;
    this.soundOnTexture = new Image();
    this.soundOnTexture.src = soundOnTexture;
    this.soundOffTexture = new Image();
    this.soundOffTexture.src = soundOffTexture;
    this.welcomeTexture = new Image();
    this.welcomeTexture.src = welcomeTexture;

    // New textures
    this.highscoreTextTexture = new Image();
    this.highscoreTextTexture.src = highscoreTextTexture;

    this.gameOverTextTexture = new Image();
    this.gameOverTextTexture.src = gameOverTexture;

    this.headlineTexture = new Image();
    this.headlineTexture.src = headlineTexture;

    // Paths for audio files
    this.audioFiles = {
      boost: boostSound,
      laughing: laughingSound,
      kill: killSound,
      fire: fireSound,
    };

    // Object to hold decoded audio buffers
    this.buffers = {};

    // Create an AudioContext for sound effects
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Global volume and speed control (0.0 to 1.0)
    this.globalVolume = 0.14; // Default volume
    this.backgroundMusicSpeed = 1.0;

    // Initialize all music tracks
    this.backgroundMusic = new Audio(gameMusic);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.globalVolume;

    this.bossMusic = new Audio(bossMusic);
    this.bossMusic.loop = true;
    this.bossMusic.volume = this.globalVolume;

    // Keep track of the current music playing
    this.currentMusic = null;
  }

  async load() {
    try {
      // Load and decode all audio files (sound effects)
      const audioPromises = Object.keys(this.audioFiles).map((key) =>
        this.loadAudio(key, this.audioFiles[key])
      );

      // Load all textures
      const texturePromises = [
        this.loadTexture(this.enemyTexture),
        this.loadTexture(this.enemyShockedTexture),
        this.loadTexture(this.enemyRocketTexture),
        this.loadTexture(this.fireBoostTexture),
        this.loadTexture(this.blockTexture),
        this.loadTexture(this.playerTexture),
        this.loadTexture(this.presentTexture),
        this.loadTexture(this.santaRocketTexture),
        this.loadTexture(this.welcomeTexture),
        // New textures
        this.loadTexture(this.highscoreTextTexture),
        this.loadTexture(this.gameOverTextTexture),
        this.loadTexture(this.headlineTexture),
      ];

      // Wait for all assets to load
      await Promise.all([...audioPromises, ...texturePromises]);

    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
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
   */
  loadTexture(image) {
    return new Promise((resolve, reject) => {
      if (!image || !image.src) {
        reject(new Error('Image element or its src property is missing.'));
        return;
      }

      if (image.complete) {
        console.log(`Texture already loaded from cache: ${image.src}`);
        resolve(image);
        return;
      }

      image.onload = () => {
        console.log(`Texture loaded successfully: ${image.src}`);
        resolve(image);
      };

      image.onerror = (err) => {
        console.error(`Error loading texture (${image.src}):`, err);
        reject(err);
      };
    });
  }

  /**
   * Play a specific music track. Possible values could be 'background' or 'boss'.
   * This will ensure only one music track is playing at a time.
   */
  playMusic(track = 'background') {
    console.log(track);
    // Stop currently playing music if any
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    // Select the track to play
    let chosenMusic = null;
    switch (track) {
      case 'boss':
        chosenMusic = this.bossMusic;
        break;
      case 'background':
      default:
        chosenMusic = this.backgroundMusic;
        break;
    }

    // Update chosen track volume and play
    chosenMusic.volume = this.globalVolume;
    chosenMusic.play().catch((error) => {
      console.error(`Error playing ${track} music:`, error);
    });

    // Set this track as the currently playing music
    this.currentMusic = chosenMusic;
    this.currentMusic.playbackRate = this.backgroundMusicSpeed;
  }

  // Stop any currently playing music
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  // Adjust the volume of the currently playing music
  updateMusicVolume() {
    if (this.currentMusic) {
      this.currentMusic.volume = this.globalVolume;
    }
  }

  // Sound effects
  playBoostSound() {
    this.playSoundEffect('boost', 0.6);
  }

  playFireSound() {
    this.playSoundEffect('fire', 0.6);
  }

  playKillSound() {
    this.playSoundEffect('kill', 0.6);
  }

  playLaughingSound() {
    this.playSoundEffect('laughing', 0.6);
  }

  // Helper method to play sound effects using Web Audio API
  playSoundEffect(key, volume = 0.14) {
    if (!this.buffers[key]) {
      console.error(`Sound effect buffer not loaded: ${key}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffers[key];

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume * this.globalVolume;

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start(0);
  }

  /**
   * Set the playback speed for the currently playing music.
   * @param {number} speed - The desired playback speed (default is 1.0 for normal speed).
   */
  setMusicSpeed(speed) {
    // Ensure the speed is a positive number
    if (speed <= 0) {
      speed = 0;
    }
    this.backgroundMusicSpeed = speed;

    if (this.currentMusic) {
      this.currentMusic.playbackRate = speed;
    }
  }

  setVolume(value) {
    // Ensure the volume is within the valid range
    this.globalVolume = Math.max(0.0, Math.min(1.0, value));

    // Update music volume
    this.updateMusicVolume();
  }

  getVolume() {
    return this.globalVolume;
  }

  /**
   * Turns the sound on by setting the global volume to the previous value.
   */
  soundOn() {
    this.soundEnabled = true;
    this.setVolume(0.14); // Restore to the default global volume
  }

  /**
   * Turns the sound off by setting the global volume to zero.
   */
  soundOff() {
    this.soundEnabled = false;
    this.setVolume(0.0); // Mute the global volume
  }
}
