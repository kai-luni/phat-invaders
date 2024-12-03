// WelcomeMenu.js
import { canvas } from '../Canvas.js';
import Events from '../Events.js';
import Button from './elements/Button.js';
import Assets from '../Assets.js';

export default class WelcomeMenu {
  /**
   * Creates a new WelcomeMenu instance.
   * @param {number} width - The width of the canvas or screen.
   * @param {number} height - The height of the canvas or screen.
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.assets = new Assets();

    // Initialize images (they should be loaded before rendering)
    this.santaImage = null;
    this.grinchImage = null;

    // Load images
    this.loadImages();

    // Initialize the button
    this.btn = new Button({
      text: 'Start a new Challenge',
      x: this.width / 2,
      y: 750, // Placeholder, will be updated in render()
      color: '#9AF11C', // Set the button background color to green
      textColor: '#000000'
    });

    this.events = new Events();

    // Prepare event handlers but do not bind them yet
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Loads the images for Santa and Grinch.
   */
  loadImages() {
    // Assuming that assets.load() has already been called in the main game initialization
    // and images are available in assets.playerTexture and assets.enemyTexture

    this.santaImage = this.assets.welcomeTexture;
  }

  // Event handler for button click
  onButtonClick() {
    this.events.emit('start');
  }

  // Event handler for keydown event
  onKeyDown(e) {
    if (e.code === 'Space') {
      // Check if the pressed key is Space
      this.events.emit('start');
    }
  }

  // Bind event listeners when the menu is active
  bind() {
    // Bind the button click event
    this.btn.events.on('click', this.onButtonClick);

    // Bind the keydown event
    document.addEventListener('keydown', this.onKeyDown);
  }

  // Unbind event listeners when the menu is inactive
  unbind() {
    // Unbind the button click event
    this.btn.events.off('click', this.onButtonClick);

    // Unbind the keydown event
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    // Clear the canvas
    canvas.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Santa
    canvas.ctx.drawImage(
      this.santaImage,
      150,
      200,
      700,
      490
    );

    // Start button
    this.btn.render();
  }
}
