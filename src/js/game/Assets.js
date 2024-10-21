// Assets.js
import gameMusic from '../../assets/spaceinvaders1.mpeg';
import looseSound from '../../assets/explosion.wav';
import enemyTexture from '../../assets/enemy.png';
import killSound from '../../assets/invaderkilled.wav';
import playerTexture from '../../assets/player.png';
import fireSound from '../../assets/shoot.wav';

export default class Assets {
  constructor() {
    // Initialize Audio objects
    this.music = new Audio(gameMusic);
    this.looseSound = new Audio(looseSound);
    this.killSound = new Audio(killSound);
    this.fireSound = new Audio(fireSound);

    // Initialize Image objects
    this.enemyTexture = new Image();
    this.playerTexture = new Image();

    // Configure background music
    this.music.loop = true; // Loop the background music
    this.music.volume = 0.5; // Set desired volume level

    // Configure other sounds (optional: adjust volume levels)
    this.looseSound.volume = 1.0;
    this.killSound.volume = 0.5;
    this.fireSound.volume = 0.5;
  }

  load() {
    return Promise.all([
      this.loadAudio(this.music),
      this.loadAudio(this.looseSound),
      this.loadTexture(this.enemyTexture, enemyTexture),
      this.loadAudio(this.killSound),
      this.loadTexture(this.playerTexture, playerTexture),
      this.loadAudio(this.fireSound),
    ]);
  }

  loadAudio(audio) {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => {
        resolve(audio);
      };
      audio.onerror = (err) => {
        reject(err);
      };
      audio.load(); // Start loading the audio
    });
  }

  loadTexture(texture, src) {
    return new Promise((resolve, reject) => {
      texture.onload = () => {
        resolve(texture);
      };
      texture.onerror = (err) => {
        reject(err);
      };
      texture.src = src; // Start loading the image
    });
  }

  // Method to play background music
  playBackgroundMusic() {
    this.music.play().catch((error) => {
      console.error('Error playing background music:', error);
    });
  }

  // Method to play firing sound without interrupting background music
  playFireSound() {
    const fireSoundClone = this.fireSound.cloneNode(); // Clone the fire sound
    fireSoundClone.play().catch((error) => {
      console.error('Error playing fire sound:', error);
    });
  }

  // Optional: Methods to play other sounds
  playLooseSound() {
    this.looseSound.play().catch((error) => {
      console.error('Error playing loose sound:', error);
    });
  }

  playKillSound() {
    this.killSound.play().catch((error) => {
      console.error('Error playing kill sound:', error);
    });
  }
}
