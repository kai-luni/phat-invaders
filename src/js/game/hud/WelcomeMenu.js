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

    // Load images
    this.loadImages();

    // Initialize the button
    this.btn = new Button({
      text: 'Starte jetzt deine Challenge',
      x: this.width / 2,
      y: 750, // We'll place the button below the text line
      color: '#9AF11C', // Set the button background color to green
      textColor: '#000000'
    });

    this.events = new Events();

    // Prepare event handlers but do not bind them yet
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Loads the images for Santa.
   */
  loadImages() {
    // Assuming that assets.load() has already been called in the main game initialization
    // and images are available in this.assets.welcomeTexture
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

    // Draw Santa Image (assuming 700x490 from original code)
    canvas.ctx.drawImage(this.santaImage, 70, 160, 800, 610);

    // Set font for the text and button
    canvas.ctx.font = '18px Arial';
    canvas.ctx.fillStyle = '#9AF11C';
    canvas.ctx.textAlign = 'center';

    // Draw the green text below the graphic
    const text = 'Schickt den Grinch nach Hause und genießt das Fest der Liebe mit guter Laune.';
    const text2 = 'Wir wünschen euch die besten Weihnachten der Welt.';
    // Position the text roughly 60px below the image (image ends at ~690, so at ~750)
    canvas.ctx.fillText(text, this.width / 2, 850);
    canvas.ctx.fillText(text2, this.width / 2, 876);

    // Render the button (it should now also use Arial font and appear below the text)
    this.btn.render();
  }
}
